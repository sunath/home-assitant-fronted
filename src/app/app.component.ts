import { Component } from '@angular/core';
import {HomeService} from "./services/home.service";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {navbarCloseAction, navbarOpenAction} from "./state/actions/navbar.actions";
import {ServerDownError} from "./Errors/ServerDownError";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fronted2.0';
  isRecording = false;


  constructor(private homeService: HomeService,
              private store:Store<{microphoneRecording:boolean,handGesture:string,navbarState:boolean}>,
              private router:Router,
              private snackBar:MatSnackBar
  ) {
  this.homeService.getProperties().
  then(e => console.log(e)).
  catch(e => {
      if(e instanceof ServerDownError){
        setTimeout(() => {
            this.snackBar.open('Refresh Page in one second','Close')
          setTimeout(() => {
            window.location.reload();
          },1000)
        },2000)
      }
  });

    store.select("microphoneRecording").subscribe(e => {
      this.isRecording  = e;
    })

    store.select('handGesture').subscribe(e => {
      if(e == "navbar on"){
        // console.log(this.router.routerState.snapshot.url)
        this.router.navigateByUrl("/navbar?cameFrom="+this.router.routerState.snapshot.url,{replaceUrl:true})
        this.store.dispatch(navbarOpenAction())
      }else if(e == "navbar off"){
        this.store.dispatch(navbarCloseAction())
      }
    })



  }





}
