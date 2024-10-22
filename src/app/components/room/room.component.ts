import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HomeService} from "../../services/home.service";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";
import {removeAngularSubscription} from "../../SubcriptionsHandler";
import {animate, state, style, transition, trigger} from "@angular/animations";


export interface RoomHandGestureSignal {
  id:number,
  type:"LIGHT" | "FAN" | "DOOR",
  message:string,
}

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  animations:[
    trigger('swipe',[

      state('show',style({
        transform:"translateY(-50px)",
        opacity:1
      })),

      state('hide',style({
        transform:"translateY(200%)",
        opacity:0
      })),

      state('hideReverse',style({
        transform:"translateY(-200%)",
        opacity:0,
      })),

      state('reset',style({
        transform:"translateY(-200%)"
      })),

      state('resetReverse',style({
        transform:"translateY(200%)"
      })),

      transition("hide => reset",animate('50ms')),
      transition("hideReverse => resetReverse",animate('50ms')),

      transition('reset => show',animate('300ms ease-out')),
      transition('resetReverse => show',animate('300ms ease-out')),

      transition("show => hide",animate('250ms ease-in')),
      transition("show => hideReverse",animate('250ms ease-in'))
    ])
  ]
})
export class RoomComponent implements OnInit,OnDestroy {

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

  allComponentsCount:number = 0;

  $handGestureSubscription: Subscription | undefined;
  $pathParameterSubscription: Subscription | undefined;

  props = {name:"",components:{light:[],door:[],fan:[]}}


  swipeState = "show"
  swiping  = false

  constructor(
    private activatedRoute:ActivatedRoute,
    private homeService:HomeService,
    private route:Router,
    private store:Store<{handGesture:string}>
  ) {}

   ngOnInit() {
     this.$pathParameterSubscription = this.activatedRoute.paramMap.subscribe(async (params) => {
      // @ts-ignore
      this.roomId = params.get("id")
      // @ts-ignore
      this.props = await this.homeService.getRoomProperties(this.roomId);
      this.allComponentsCount = this.props.components.light.length + this.props.components.door.length + this.props.components.fan.length;

    })
     this.$handGestureSubscription = this.store.select('handGesture').subscribe(e => {
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

            if(this.navigateRight && this.currentComponentIndex < this.allComponentsCount -2){
                this.goRightArrowClick()
            }else if(!this.navigateRight && this.currentComponentIndex > 0){
              this.goLeftArrowClick();
            }else if(this.currentComponentIndex == this.allComponentsCount -2){
              this.goRightArrowClick();
              this.navigateRight = false;
            }else if(this.currentComponentIndex == 0){
              this.goRightArrowClick()
              this.navigateRight = true;
            }

            setTimeout(() => {this.canNavigate = true;} ,2000)

          }

     })

  }


  ngOnDestroy() {
    removeAngularSubscription(this.$handGestureSubscription);
    removeAngularSubscription(this.$handGestureSubscription);
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

    this.swipeState = "hideReverse"
    this.swiping = true;

    setTimeout(() => {
      this.currentComponentIndex--;
      this.swipeState = "resetReverse"

      setTimeout(() => {
        this.swipeState = "show"
        setTimeout(() => {
          this.swiping = false;
        },300)

      },55)
    },300)

  }

  goRightArrowClick(){
    this.swipeState = "hide"
    this.swiping = true;

    setTimeout(() => {
      this.currentComponentIndex++;
      this.swipeState = "reset"

      setTimeout(() => {
        this.swipeState = "show"
        setTimeout(() => {
          this.swiping = false;
        },300)

      },55)
    },300)


    // this.swipeRight();
  }

}
