import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MicrophoneComponent } from './components/microphone/microphone.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {HttpClientModule} from "@angular/common/http";
import { NavbarComponent } from './components/navbar/navbar.component';
import { LightComponent } from './components/light/light.component';
import { StoreModule } from '@ngrx/store';
import {microphoneReducer} from "./state/reducers/microphone.recording.reducer";
import {MatCardModule} from "@angular/material/card";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import { FanComponent } from './components/fan/fan.component';
import { DoorComponent } from './components/door/door.component';
import { HomeComponent } from './components/home/home.component';
import { RoomComponent } from './components/room/room.component';
import { HandControllerComponent } from './components/hand-controller/hand-controller.component';
import {HandGestureMotionReducer} from "./state/reducers/hand.motion.detect.reducer";
import { NavbarHandControllerComponent } from './components/navbar-hand-controller/navbar-hand-controller.component';
import {navbarReducer} from "./state/reducers/navbar.reducer";

@NgModule({
  declarations: [
    AppComponent,
    MicrophoneComponent,
    NavbarComponent,
    LightComponent,
    FanComponent,
    DoorComponent,
    HomeComponent,
    RoomComponent,
    HandControllerComponent,
    NavbarHandControllerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    StoreModule.forRoot({
      microphoneRecording: microphoneReducer,
      handGesture:HandGestureMotionReducer,
      navbarState:navbarReducer
    }),
    MatCardModule,
    MatSlideToggleModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
