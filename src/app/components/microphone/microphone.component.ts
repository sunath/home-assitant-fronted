import {AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Stream } from 'stream';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MicrophoneService} from "../../services/microphone.service";
import {HttpClient} from "@angular/common/http";
import {findCommand} from "../../commands";
import {serverBase} from "../../../main";
import {Store} from "@ngrx/store";
import {microphoneRecordingEnd, microphoneRecordingStart} from "../../state/actions/microphone.recording.actions";
import {Router} from "@angular/router";
import {shuffleArray} from "./shuffle";
import {HomeService} from "../../services/home.service";


function numberStringToNumber(str:string){

  switch (str){
    case "one":
      return 1
    case "two":
      return 2
    case "three":
      return 3
    case "four":
      return 4
    case "five":
      return 5
    case "1":
      return 1
    case "2":
      return 2
    case "3":
      return 3
    case "4":
      return 4
    case "5":
      return 5
  }

  return 0;

}

/**
 * Microphone component - Handle the actions via microphone (sound)
 */
@Component({
  selector: 'app-microphone',
  templateUrl: './microphone.component.html',
  styleUrls: ['./microphone.component.scss'],
  animations:[
    trigger('microphoneBackground',[

      state('recording',style({
        // background:"linear-gradient(162deg, #ff5f6d  0%, #ffc371 100%)",
        opacity:1,
        // height:"100vh",
        transform:"translateX(0)",
      })),

      state('paused',style({
        // background:"#000",
        opacity:0,
        transform:"translateX(-100%)",
        // height:"0vh"
      })),

      transition('paused => recording',[animate('.5s')]),

      transition('recording => paused', [animate('.2s')])


    ]),


    trigger('audioAnalyserAnim',[
      state('recording',style({
        opacity:1
      })),

      state('paused',style({
        opacity:0
      })),

      transition('paused => recording',[animate('1s')]),

      transition('recording => paused', [animate('.001s')])


    ])

  ]
})
export class MicrophoneComponent implements OnInit,AfterViewInit {


  isRecording = false;
  showResult = false;
  canToggleRecording = true;
  audioAnalyser:AnalyserNode | undefined  | null= null;

  @ViewChild('audioAnalyser')
  audioAnalyserCanvas: ElementRef<HTMLCanvasElement> | undefined;

  analyserWidth = window.innerWidth;
  analyserHeight = window.innerHeight / 10;

  // @ts-ignore
  voiceAPI:webkitSpeechRecognition = null;




  constructor(private microphoneService:MicrophoneService,
              private httpClient:HttpClient,
              private router:Router,
              private store:Store<{microphoneRecording:boolean}>,
              private ngZone:NgZone,
              private homeService:HomeService
              ) {
    this.getResult = this.getResult.bind(this)
    this.store.select('microphoneRecording').subscribe(e => {
      this.isRecording = e;
    })
    this.toggleRecording = this.toggleRecording.bind(this)
  }


  classNames = []

  /**
   * Change the state of the recording
   */
  toggleRecording(){

    if(this.isRecording){
      if(this.voiceAPI){
        this.voiceAPI.stop()
      }
      this.store.dispatch(microphoneRecordingEnd())
    }else{
      this.startListening()
      this.store.dispatch(microphoneRecordingStart())
    }
  }

  ngAfterViewInit() {
    if(!this.audioAnalyserCanvas)return;
    const audioCanvasContext = this.audioAnalyserCanvas.nativeElement.getContext('2d');
    if(!audioCanvasContext)return;
    audioCanvasContext.rect(0,0,this.analyserWidth,this.analyserHeight)
    audioCanvasContext.fillStyle = "white"

    for(let i = 0 ; i < this.analyserWidth;i++){
      const pixelHeight = (Math.random()) * this.analyserHeight;
      audioCanvasContext.fillRect(i,this.analyserHeight,1,-pixelHeight);
    }

    audioCanvasContext.clearRect(0,0,this.analyserWidth,this.analyserHeight);

    // audioCanvasContext.fillRect(0,0,this.analyserWidth,this.analyserHeight);
  }

  ngOnInit() {

  }


  getRecordingContainerClassNames(){
    let names = ['recording-background']
    if(this.isRecording){
      names.push('recording-activated')
    }else{
      names.push('recording-deactivated')
    }

    return names.join(' ')
  }



  results = "";

  startListening() {
    // let voiceHandler = this.hiddenSearchHandler?.nativeElement;
    if ('webkitSpeechRecognition' in window) {
      // @ts-ignore
      const vSearch = new webkitSpeechRecognition();
      vSearch.continuous = false;
      vSearch.interimresults = false;
      vSearch.lang = 'en-US';
      vSearch.start();

      this.voiceAPI = vSearch;

      vSearch.onspeechend = () => {
        vSearch.stop();
      };

      vSearch.onresult = (e:any) => {
        this.results = e.results[0][0].transcript;
        this.results = findCommand(this.results) || this.results
        this.ngZone.run(this.getResult);
        vSearch.stop();
        // this.toggleRecording()
      };
    } else {
      alert('Your browser does not support voice recognition!');
    }
  }

  getResult() {
    this.showResult = true;
    setTimeout(async () => {
      this.toggleRecording()
      this.showResult = false;


      let command = findCommand(this.results)

      if(command.startsWith("turn on the light")){
        command = command.replace("turn on the light ",'');
        const num = numberStringToNumber(command)
        await this.homeService.lightOn(num)
        this.router.navigateByUrl('/light/'+num+'?on=true')
      }else if(command.startsWith("turn off the light")){
        command = command.replace("turn off the light ",'');
        let num = numberStringToNumber(command)
        await this.homeService.lightOff(num)
        this.router.navigateByUrl('/light/'+num+'?on=false')
      }else if(command.startsWith("open the door")){
        command = command.replace('open the door ','')
        const num = await numberStringToNumber(command);
        await this.homeService.doorOpen(num);
        this.router.navigateByUrl("/door/"+num+"?on=true")

      }else if(command.startsWith("close the door")){
        command = command.replace('close the door ','')
        const num = await numberStringToNumber(command);
        await this.homeService.doorClose(num);
        this.router.navigateByUrl("/door/"+num+"?on=false")
      } else if(command.startsWith("turn on the fan")){
        command = command.replace('turn on the fan ','')
        const num = await numberStringToNumber(command);
        await this.homeService.fanOpen(num);
        this.router.navigateByUrl("/fan/"+num+"?on=true")
      }else if(command.startsWith("turn off the fan")){
        command = command.replace('turn off the fan ','')
        const num = await numberStringToNumber(command);
        await this.homeService.fanOff(num);
        this.router.navigateByUrl("/fan/"+num+"?on=false")
      }

    },2000)
    console.log(this.results);


  }

}
