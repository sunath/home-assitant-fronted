import { Injectable } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class MicrophoneService {

  mediaRecorder:MediaRecorder | null = null;
  stream:MediaStream | null = null;
  audioBlobs:any[] = []

  constructor(private domSanitizer:DomSanitizer) { }


  startRecording(){
    this.audioBlobs = []
    this.mediaRecorder = null
    this.stream = null
      if(!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)){
        return Promise.reject("Browser does not meet the requirements.")
      }

      return navigator.mediaDevices.getUserMedia({audio:true}).then(stream => {
        this.stream = stream;
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.addEventListener('dataavailable',(event) => {
            this.audioBlobs.push(event.data)
        })

        this.mediaRecorder.start();
      }).catch(error => {console.error(error)})

  }

  endRecording(){
    this.mediaRecorder?.stop();
    this.stream?.getTracks().forEach(e => e.stop());
    return new Promise((resolve, reject) => {
      this.mediaRecorder?.addEventListener('stop',(event) => {
        const audioBlob = new Blob(this.audioBlobs,{type:this.mediaRecorder?.mimeType})
        // const audio = new Audio(URL.createObjectURL(audioBlob))
        // audio.play()
        resolve(audioBlob)
      })
    })

  }


  getRecordedAudio(){
    return new Blob(this.audioBlobs,{type:this.mediaRecorder?.mimeType})
  }

  getAudioContext(){
    if(!this.stream)return;
  const audioContext = new AudioContext();
  let audioInput = audioContext.createMediaStreamSource(this.stream);
  let analyser = audioContext.createAnalyser();
  audioInput.connect(analyser)
    return analyser;
  }

  sanitizeBlobUrl(){
    return this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.getRecordedAudio()));
  }



}
