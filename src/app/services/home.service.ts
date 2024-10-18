import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {serverBase} from "../../main";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private httpClient:HttpClient) { }


  public getProperties(){
     const promise = firstValueFrom(this.httpClient.get(serverBase+"/api/base"));
     return promise;
  }


  public lightOn(lightID:number){
    const promise = firstValueFrom(this.httpClient.post(serverBase+"/api/light/"+lightID,{state:"on"} ))
    return promise;
  }

  public lightOff(lightID:number){
    const promise = firstValueFrom(this.httpClient.post(serverBase+"/api/light/"+lightID,{state:"off"} ))
    return promise;

  }

  public light1Off(){
    const promise = firstValueFrom(this.httpClient.post(serverBase+"/api/light1/off",null));
    return promise;
  }

  public doorOpen(doorID:number){
    const promise = firstValueFrom(this.httpClient.post(serverBase+"/api/door/"+doorID,{state:"on"}))
    return promise;
  }

  public doorClose(doorID:number){
    const promise = firstValueFrom(this.httpClient.post(serverBase+"/api/door/"+doorID,{state:"off"}))
    return promise;
  }


  public fanOpen(fanID:number){
    const promise = firstValueFrom(this.httpClient.post(serverBase+"/api/fan/"+fanID,{state:"on"}))
    return promise;
  }

  public fanOff(fanID:number){
    const promise = firstValueFrom(this.httpClient.post(serverBase+"/api/fan/"+fanID,{state:"off"}))
    return promise;
  }


  public getRoomProperties(roomId:number){
    const promise = firstValueFrom(this.httpClient.get(serverBase+"/api/room/"+roomId))
    return promise;
  }

}
