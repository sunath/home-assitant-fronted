import {Component, EventEmitter, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HomeService} from "../../services/home.service";
import {Store} from "@ngrx/store";


export interface RoomHandGestureSignal {
  id:number,
  type:"LIGHT" | "FAN" | "DOOR",
  message:string,
}

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  roomHandSignatureEmitter: EventEmitter<RoomHandGestureSignal> = new EventEmitter<RoomHandGestureSignal>();
  roomHandSignatureProps:RoomHandGestureSignal = {
    'id':0,
    'type':'LIGHT',
    message:""
  }

  roomId = 1;
  currentComponentIndex = 0;

  canNavigate = true;
  navigateRight = true;

  allComponentsCount:Array<number> = new Array(0);


  props = {name:"",components:{light:[],door:[],fan:[]}}
  constructor(
    private activatedRoute:ActivatedRoute,
    private homeService:HomeService,
    private route:Router,
    private store:Store<{handGesture:string}>
  ) {}

   ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async (params) => {
      // @ts-ignore
      this.roomId = params.get("id")
      // @ts-ignore
      this.props = await this.homeService.getRoomProperties(this.roomId);
      console.log(this.props)
      const count  = this.props.components.light.length + this.props.components.door.length + this.props.components.fan.length;
      this.allComponentsCount = new Array(count);
    })

     this.store.select('handGesture').subscribe(e => {
          if(!this.route.url.startsWith("/room")){return;}

          if(e == "on"){
            this.roomHandSignatureProps.message = "on"
            this.roomHandSignatureEmitter.emit(this.roomHandSignatureProps)
          }else if(e == "off"){
            this.roomHandSignatureProps.message = "off"
            this.roomHandSignatureEmitter.emit(this.roomHandSignatureProps)
          }else if(e.startsWith("navigate")){
            if(!this.canNavigate){return;}
            this.canNavigate = false;

            if(this.navigateRight && this.currentComponentIndex < this.allComponentsCount.length-1){
                this.currentComponentIndex += 1;
            }else if(!this.navigateRight && this.currentComponentIndex > 0){
              this.currentComponentIndex -= 1;
            }else if(this.currentComponentIndex == this.allComponentsCount.length -1){
              this.currentComponentIndex -= 1;
              this.navigateRight = false;
            }else if(this.currentComponentIndex == 0){
              this.currentComponentIndex +=1;
              this.navigateRight = true;
            }

            setTimeout(() => {this.canNavigate = true;} ,2000)

          }

     })

  }


  getRoomClasses(electricType:string,index:number){
    if(electricType === "light"){
      if(index == this.currentComponentIndex){
        this.roomHandSignatureProps.type = "LIGHT"
        this.roomHandSignatureProps.id = this.props.components.light[index]
        return 'component-container component-container-show'
      }
    }else if(electricType == "door"){
        if( this.props.components.light.length+index == this.currentComponentIndex){
          this.roomHandSignatureProps.type = "DOOR"
          this.roomHandSignatureProps.id = this.props.components.door[index]
          return 'component-container component-container-show'
        }
    }else if(electricType == "fan"){
      if(this.props.components.light.length + this.props.components.door.length + index == this.currentComponentIndex){
        this.roomHandSignatureProps.type = "FAN"
        this.roomHandSignatureProps.id = this.props.components.fan[index]
        return 'component-container component-container-show'
      }
    }

    return 'component-container'
  }


  goLeftArrowClick(){
    this.currentComponentIndex--;
  }

  goRightArrowClick(){
    this.currentComponentIndex++;
  }

  getClassNameForLightIconCirlce(index:number){
    let names = "  light-icon-circle "
    if(this.currentComponentIndex == index){
      names += " light-icon-circle-highlight "
    }
    return names
  }

  onLightCircleGetClicked(index:number){
    this.currentComponentIndex = index;
  }

}
