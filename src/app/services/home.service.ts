import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {serverBase} from "../../main";
import {firstValueFrom} from "rxjs";
import {ServerDownError} from "../Errors/ServerDownError";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private httpClient:HttpClient,
    private errorShow:MatSnackBar
              ) { }


  async handleRequest(promiseFunction:Function){
    try{
      return (await promiseFunction())
    }catch (error){
      this.errorShow.open('Server is Down.','Close')
      setTimeout(() => {this.errorShow.dismiss()},1000)
      throw new ServerDownError();
    }

  }

  public async getProperties(){
    return this.handleRequest(async () => {
      return (await firstValueFrom(this.httpClient.get(serverBase+"/api/base")));
    })

  }


  public lightOn(lightID:number){
    return this.handleRequest(async () => {
      return (await firstValueFrom(this.httpClient.post(serverBase+"/api/light/"+lightID,{state:"on"} )))
    })

  }

  public lightOff(lightID:number){
    return this.handleRequest(async () => {
      return ( await firstValueFrom(this.httpClient.post(serverBase+"/api/light/"+lightID,{state:"off"})))
    })
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
