import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LightComponent} from "./components/light/light.component";
import {HomeComponent} from "./components/home/home.component";
import {DoorComponent} from "./components/door/door.component";
import {RoomComponent} from "./components/room/room.component";
import {FanComponent} from "./components/fan/fan.component";
import {NavbarHandControllerComponent} from "./components/navbar-hand-controller/navbar-hand-controller.component";

const routes: Routes = [

  {path:"light/:id",component:LightComponent},
  {path:"door/:id",component:DoorComponent},
  {path:"fan/:id",component:FanComponent},
  {path:"room/:id",component:RoomComponent},
  {path:"navbar",component:NavbarHandControllerComponent},
  {path:"",component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
