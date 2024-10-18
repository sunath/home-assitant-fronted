import {Component, EventEmitter, Input, NgZone, OnInit} from '@angular/core';
import {HomeService} from "../../services/home.service";
import {ActivatedRoute, Router, RouterState} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Store} from "@ngrx/store";
import {RoomHandGestureSignal} from "../room/room.component";

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
  ])
]
})
export class LightComponent implements OnInit {

  @Input('handGestureRoomEmitter') handGestureRoomEmitter:EventEmitter<RoomHandGestureSignal> | undefined;

  @Input('lightNumber') number:number = 1;

  lightOn = false;

  @Input('routerMode') routerMode = true;

  lightName = "HomeLight"

  routerURL = ""

  navigating = false;
  navigatingRight = true;
  canNavigate = true;




  toggleLightOnOff($event:any){
    if($event){
      // @ts-ignore
      event.preventDefault();
    }
    this.lightOn = !this.lightOn;
    if(this.lightOn) {
      this.homeService.lightOn(this.number).then(e => console.log(e, " ight on is on"))
    }else{
      this.homeService.lightOff(this.number).then(e => console.log(e))
    }
  }

  constructor(private homeService:HomeService,
              private routerParam:ActivatedRoute,
              private store:Store<{handGesture:string}>,
              private route:Router,private ngZone:NgZone) {}

  async setupTheLight(){
    const props = await this.homeService.getProperties();
    // console.log(props)
    // @ts-ignore
    // console.log(props['light']['1'])
    // @ts-ignore
    const state = props['light'][this.number.toString()]
    console.log(state)
    this.lightName = state['name']
    this.lightOn = state['state'] == 'on' ? true : false;
  }

  async ngOnInit() {

    if(!this.routerMode){
      console.log("setup the light",this.number)
      await this.setupTheLight()

      if(this.handGestureRoomEmitter){
          this.handGestureRoomEmitter.subscribe(e => {
          // console.log(e,)
            if(e.type == "LIGHT" && e.id == this.number ){
              if(e.message == "on" && !this.lightOn){
                this.toggleLightOnOff(null)
              }else if(e.message == "off" && this.lightOn){
                this.toggleLightOnOff(null)
              }
            }

          })
      }

    }else{

      this.routerParam.paramMap.subscribe(params => {
        const snapshot = this.routerParam.snapshot;
        const id= snapshot.paramMap.get('id')
        const state = snapshot.queryParamMap.get('on')
        console.log(snapshot)
        // @ts-ignore
        this.number = id;
        //   @ts-ignore
        if(state){
          this.lightOn = state  == "on" ? true : false;
        }

        this.setupTheLight()
        // this.ngZone.run(this.setupTheLight())
      })

      this.routerParam.queryParamMap.subscribe(e => {
        const snapshot = this.routerParam.snapshot;
        const id= snapshot.paramMap.get('id')
        const state = snapshot.queryParamMap.get('on')
        console.log(snapshot)

        // @ts-ignore
        this.number = id;
        //   @ts-ignore
        if(state){
          this.lightOn = state  == "on" ? true : false;
        }
        this.setupTheLight()
      })

    }




    this.store.select('handGesture').subscribe(e => {

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


  lightOnOffClasses(){
    return ' main-circle '  + (this.lightOn ? ' light-on ' : 'light-off')
  }

  fakeLightClasses(){
    return (this.lightOn ? ' fake-light-on ' : ' fake-light-off ') + ' fake-light '
  }

  getClassNameForLightIconCirlce(index:number){
    let names = "  light-icon-circle "
      if(this.number == index){
          names += " light-icon-circle-highlight "
      }
      return names
  }

  onLightCircleGetClicked(index:number){
    this.route.navigateByUrl('/light/'+index)
  }


  goLeftArrowClick(){
    if(this.number == 1){return;}
    this.route.navigateByUrl('/light/'+ (this.number-1))
  }

  goRightArrowClick(){
    if(this.number == 5){return;}
    this.route.navigateByUrl('/light/'+ (++this.number) )
  }

}
