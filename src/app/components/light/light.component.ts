import {Component, EventEmitter, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {HomeService} from "../../services/home.service";
import {ActivatedRoute, Router, RouterState} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Store} from "@ngrx/store";
import {RoomHandGestureSignal} from "../room/room.component";
import {Subscription} from "rxjs";
import {removeAngularSubscription} from "../../SubcriptionsHandler";
import {SwipeAnimationTrigger} from "../../animations/swipe";
import {TextFadingAnimationTrigger} from "../../animations/textFadeIn";

@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.scss'],
  animations: [
    trigger('containerChange',[
     transition(":enter",[
       style({opacity:0}),
       animate('500ms ease-out',style({opacity:1}),)
     ])
      ,
      transition("* => *" ,animate("100ms ease-out"))
    ])
    ,
  trigger('fakeLightTransition', [
    state(
      'on',
      style({
        width: '300px',
        height: '300px',
        backgroundColor: 'yellow',
        transform: 'translateX(0) translateY(200px)',
        boxShadow: 'rgb(248, 185, 0) 0 0 20px 20px'

      })
    ),
    state(
      'off',
      style({
        width: 0,
        height: '0',
        transform: 'translateX(150px) translateY(350px)'
      })
    ),
    transition('off => on', animate('300ms 200ms ease-out')),
    transition('on => off', animate('300ms 200ms ease-in'))
  ]),
  SwipeAnimationTrigger,
  TextFadingAnimationTrigger
]
})
export class LightComponent implements OnInit,OnDestroy {

  @Input('handGestureRoomEmitter') handGestureRoomEmitter:EventEmitter<RoomHandGestureSignal> | undefined;
  @Input('lightNumber') number:number = 1;
  @Input('routerMode') routerMode = true;

  swipeAnimationTime = 500;

  $handGestureSubscription: Subscription | undefined;
  $queryParameterSubscription: Subscription | undefined;
  $pathParameterSubscription : Subscription | undefined;

  lightOn = false;
  lightName = "HomeLight"

  routerURL = ""
  navigating = false;
  navigatingRight = true;
  canNavigate = true;

  swipeState = "appear"
  swiping = false

  textState = "show"
  textAnimating = false

  async toggleLightOnOff($event:any){

    if($event){
      // @ts-ignore
      event.preventDefault();
    }

      try{
        // @ts-ignore
        const val = ( await this.homeService['light' + (this.lightOn ? 'Off' : 'On' )](this.number))
        this.lightOn = !this.lightOn;
      }catch (error){
       console.error(error)
      }
  }

  constructor(private homeService:HomeService,
              private routerParam:ActivatedRoute,
              private store:Store<{handGesture:string}>,
              private route:Router,private ngZone:NgZone) {}

  // Change the light according to the home service state
  async setupTheLight(){
    // get the properites from the home
    const props = await this.homeService.getProperties();
    // @ts-ignore
    const state = props['light'][this.number.toString()]
    this.textAnimating = true;
    this.textState = "hide"
    // change the light state
    this.lightOn = state['state'] == 'on';

    setTimeout(() => {
      this.textState = "show"
      // set the light name
      this.lightName = state['name']

    },400)




  }

  async ngOnInit() {
    // Check weather we are in router mode or room mode
    if(!this.routerMode){
      // set up the light according to the given input
      // then subscribe to the hand gesture
      await this.setupTheLight()
      // if the hand gesture emitter was not given,we just pass it
      if(!(this.handGestureRoomEmitter)){return;}
      // subscribe to the hand gesture
      this.$handGestureSubscription =  this.handGestureRoomEmitter.subscribe( (e) => {
        // check weather this is the light or not
        if(!(e.type == "LIGHT" && e.id == this.number)){return;}
        // Change the light state according to the hand signature
        if(e.message == "on" && !this.lightOn){
            // turn on the light if it does not
            this.toggleLightOnOff(null)
        }else if(e.message == "off" && this.lightOn){
            // turn off the light if it does not
            this.toggleLightOnOff(null)
        }
      })
    }else{
      // add the path parameter subscription
      this.$pathParameterSubscription = this.routerParam.paramMap.subscribe(async (params) => {
        await this.queryAndPathSubscriptionHandler()
      })
      // add the query parameter subscription
      this.$queryParameterSubscription = this.routerParam.queryParamMap.subscribe( async (e) => {
        await this.queryAndPathSubscriptionHandler()
      })
      // add the hand gesture subscription
      this.$handGestureSubscription =  this.store.select('handGesture').subscribe(e => {

        if(!this.route.url.startsWith("/light")){return;}
        if(e == "on" && (!this.lightOn)){
          this.toggleLightOnOff(null)
          this.navigating = false;
        }else if(e == "off" && (this.lightOn)){
          this.toggleLightOnOff(null)
          this.navigating = false;
        }else if(e.startsWith("navigate")){
          if(!this.navigating){
            this.navigating = true;
          }

          if(this.number == 5){
            this.navigatingRight = false;
          }

          if(!this.canNavigate){
            return;
          }

          if(this.navigatingRight){
            this.goRightArrowClick()
          }else{
            if(this.number == 1){
              this.navigatingRight = true;
              this.goRightArrowClick()
            }else{
              this.goLeftArrowClick();
            }

          }

          this.canNavigate = false;

          setTimeout(() => {
            this.canNavigate = true;
          },2000)

        }

      })
    }


  }

  async ngOnDestroy(){
    // remove all the subscription when we are going out from the view
    removeAngularSubscription(this.$handGestureSubscription);
    removeAngularSubscription(this.$pathParameterSubscription);
    removeAngularSubscription(this.$queryParameterSubscription);
  }

  lightOnOffClasses(){
    return ' main-circle '  + (this.lightOn ? ' light-on ' : 'light-off')
  }

  getClassNameForLightIconCirlce(index:number){
    let names = "  light-icon-circle "
      if(this.number == index){
          names += " light-icon-circle-highlight "
      }
      return names
  }

  async onLightCircleGetClicked(index:number){
    if(this.swiping){return;}
    const num = this.number
    await this.route.navigateByUrl('/light/'+index)
    // console.log('running')
    const f = (num != index) ? (num > index) ? this.swipeRight() : this.swipeLeft() : null;
  }


  async goLeftArrowClick(){
    if(this.number == 1 || this.swiping){return;}
    await this.route.navigateByUrl('/light/'+ (this.number-1))
    this.swipeLeft();
  }

  async goRightArrowClick(){
    if(this.number == 5 || this.swiping){return;}
    await this.route.navigateByUrl('/light/'+ (++this.number) )
    this.swipeRight();
  }



  // handle the changes when the query and path parameters change
  async queryAndPathSubscriptionHandler(){
    // get the current snapshot
    const snapshot = this.routerParam.snapshot;
    // get the id
    const id= snapshot.paramMap.get('id')
    // get the light state
    const state = snapshot.queryParamMap.get('on')
    // @ts-ignore
    this.number = id;
    //   @ts-ignore
    if(state){
      this.lightOn = state  == "on";
    }
    await this.setupTheLight()
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
