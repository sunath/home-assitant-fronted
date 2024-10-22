import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HomeService} from "../../services/home.service";
import {Store} from "@ngrx/store";
import {RoomHandGestureSignal} from "../room/room.component";
import {SwipeAnimationTrigger} from "../../animations/swipe";
import {TextFadingAnimationTrigger} from "../../animations/textFadeIn";
import {Subscription} from "rxjs";
import {removeAngularSubscription} from "../../SubcriptionsHandler";

@Component({
  selector: 'app-door',
  templateUrl: './door.component.html',
  styleUrls: ['./door.component.scss'],
})
export class DoorComponent implements OnInit,OnDestroy{

  @Input('handGestureRoomEmitter') handGestureRoomEmitter:EventEmitter<RoomHandGestureSignal> | undefined;
  @Input('doorID') doorId:number = 2;
  @Input('doorRouterView') doorRouterView:boolean = true;
  doorName = "Door 1"
  doorOpen = false;

  navigating = false;
  canNavigate = true;

  swipeState = "appear"
  swiping = false


  $pathParameterSubscription:Subscription | undefined;
  $queryParameterSubscription:Subscription | undefined;
  $handGestureSubscription:Subscription | undefined;

  constructor(public route:Router,
              public activatedRouter:ActivatedRoute,
              private homeService:HomeService,
              private store:Store<{handGesture:string}>) {

  }

 async  ngOnInit() {

    if(this.doorRouterView){
    this.$pathParameterSubscription= this.activatedRouter.paramMap.subscribe( async (e) => {
        // @ts-ignore
        this.doorId = e.get('id');
        const props = await this.homeService.getProperties()
        // @ts-ignore
        this.doorOpen = props['door'][this.doorId.toString()]['state'] == 'on';
        // @ts-ignore
        this.doorName = props['door'][this.doorId.toString()]['name']
      })
    this.$queryParameterSubscription = this.activatedRouter.queryParamMap.subscribe( async (e) => {
        // @ts-ignore
        this.doorId = this.activatedRouter.snapshot.paramMap.get('id');
        const props = await this.homeService.getProperties()
        // @ts-ignore
        this.doorOpen = props['door'][this.doorId.toString()]['state'];
        // @ts-ignore
        this.doorName = props['door'][this.doorId.toString()]['name']
      })
    this.$handGestureSubscription =this.store.select('handGesture').subscribe(e => {

        if(!this.route.url.startsWith("/door")){return;}
        if(e == "on" && (!this.doorOpen)){
          this.toggleDoorOpenClose()
          this.navigating = false;
        }else if(e == "off" && (this.doorOpen)){
          this.toggleDoorOpenClose()
          this.navigating = false;
        }else if(e.startsWith("navigate")){
          if(!this.navigating){
            this.navigating = true;
          }

          if(!this.canNavigate){
            return;
          }

          if(this.doorId == 1){
            this.goRightArrowClick();
          }else{
            this.goLeftArrowClick();
          }
          this.canNavigate = false;

          setTimeout(() => {
            this.canNavigate = true;
          },2000)

        }

      })
    }else {
      if(this.doorId){
        const props = await this.homeService.getProperties()
        // @ts-ignore
        this.doorOpen = props['door'][this.doorId.toString()]['state'] == 'on';
        // @ts-ignore
        this.doorName = props['door'][this.doorId.toString()]['name']
       }
      if(this.handGestureRoomEmitter){
        this.$handGestureSubscription = this.handGestureRoomEmitter.subscribe(e => {
          if(e.type == "DOOR" && e.id == this.doorId){
            if(e.message == "on" && !this.doorOpen){
                this.toggleDoorOpenClose()
            }else if(e.message == "off" && this.doorOpen){
              this.toggleDoorOpenClose()
            }
          }
        })
      }
    }
  }

  async ngOnDestroy(){
    removeAngularSubscription(this.$pathParameterSubscription);
    removeAngularSubscription(this.$queryParameterSubscription);
    removeAngularSubscription(this.$handGestureSubscription);
  }

  async toggleDoorOpenClose(){

    this.doorOpen = !this.doorOpen;
    if(this.doorOpen){
      await this.homeService.doorOpen(this.doorId)
    }else{
      await this.homeService.doorClose(this.doorId)
    }

  }

  getClassList(){
    const doorState = this.doorOpen ? 'doorOpen' : 'doorClose'
    return ( 'door '  + doorState)
  }


//   navigation controls
  getClassNameForLightIconCirlce(index:number){
    let names = "  light-icon-circle "
    if(this.doorId == index){
      names += " light-icon-circle-highlight "
    }
    return names
  }

  onLightCircleGetClicked(index:number){
    this.route.navigateByUrl('/door/'+index)
  }


  goLeftArrowClick(){
    if(this.doorId == 1 || this.swiping){return;}
    this.route.navigateByUrl('/door/'+ (this.doorId-1))
    this.swipeLeft();
  }

  goRightArrowClick(){
    if(this.doorId == 2 || this.swiping){return;}
    this.route.navigateByUrl('/door/'+ (++this.doorId) )
    this.swipeRight();
  }




  swipeLeft(){
    this.swipeState = "disappearRight"
    this.swiping = true;
    setTimeout(() => {
      this.swipeState = "noDisplayLeft"

      setTimeout(() => {
        this.swipeState = "appear"
        setTimeout(() => {
          this.swiping = false;
        },450)

      },100)

    },300)
  }

  swipeRight(){
    this.swipeState = "disappearLeft"
    this.swiping = true;
    setTimeout(() => {
      this.swipeState = "noDisplayRight"

      setTimeout(() => {
        this.swipeState = "appear"
        setTimeout(() => {
          this.swiping = false;
        },450)

      },100)

    },300)
  }
}
