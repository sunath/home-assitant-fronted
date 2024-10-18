import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';


import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils
} from "@mediapipe/tasks-vision"
import {Store} from "@ngrx/store";
import {handMotionDetectAction} from "../../state/actions/hand.motion.detect.actions";
import {microphoneRecordingStart} from "../../state/actions/microphone.recording.actions";

@Component({
  selector: 'app-hand-controller',
  templateUrl: './hand-controller.component.html',
  styleUrls: ['./hand-controller.component.scss']
})
export class HandControllerComponent implements OnInit {

  @ViewChild('webcam') video:ElementRef<HTMLVideoElement> | undefined = undefined;

  runningMode = "VIDEO"
  gestureRecognizer: GestureRecognizer | null = null;
  videoConstraints = {
    video:true
  }

  constructor(private ngZone:NgZone,private store:Store<{handGesture:string}>) {
    this.nextFrame = this.nextFrame.bind(this)
    this.onCameraDataAvailable = this.onCameraDataAvailable.bind(this)
  }

  async ngOnInit() {
    await this.createGestureRecognizer();
    await this.activateWebCamStream();

  }

  async activateWebCamStream(){
    await navigator.mediaDevices.getUserMedia(this.videoConstraints).then(stream => {
      // @ts-ignore
      this.video?.nativeElement.srcObject = stream;
      this.video?.nativeElement.addEventListener('loadeddata',this.onCameraDataAvailable);
    })
  }

  lastTime = -1
  result = undefined
  gesture = ""
  previousCategory = ""

  nextFrame(){
    this.ngZone.runTask(this.onCameraDataAvailable);
  }

  onCameraDataAvailable() {
    let nowInMs = Date.now();
    // console.log("camera available")
      if(this.video?.nativeElement.currentTime != this.lastTime){
          // @ts-ignore
          this.lastTime = this.video?.nativeElement.currentTime;
          // @ts-ignore
          const results = this.gestureRecognizer?.recognizeForVideo(this.video?.nativeElement,nowInMs)
          if(results && results.gestures.length >0){
            const name = results.gestures[0][0].categoryName
             if(this.previousCategory != name){
               // console.log(name)
               if(name == "Closed_Fist" ){
                 this.store.dispatch(handMotionDetectAction({change:"off"}))
               }else if(name == "Pointing_Up"){
                 this.store.dispatch(handMotionDetectAction({change:"on"}))
               }else if(name == "Thumb_Up"){
                 this.store.dispatch(handMotionDetectAction({change:"navbar on"}))
               }else if(name == "Thumb_Down"){
                 this.store.dispatch(handMotionDetectAction({change:"navbar off"}))
               }
               this.previousCategory = name;
               // console.log(this.previousCategory);
             }else{
               if(this.previousCategory == "Open_Palm"){
                 console.log("open palm")
                  this.store.dispatch(handMotionDetectAction({change:"navigate " + Math.random()}))
               }

             }

          }
      }

    // setTimeout(()=>{},1000)
    setTimeout(() => { window.requestAnimationFrame(this.onCameraDataAvailable)} , 200)
    // window.requestAnimationFrame(this.onCameraDataAvailable);
  }



  hasUserMedia(){
    return (navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

   createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    this.gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
        delegate: "GPU"
      },
      // @ts-ignore
      runningMode: this.runningMode
    });
  };

}
