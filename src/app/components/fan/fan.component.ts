import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {HomeService} from "../../services/home.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {RoomHandGestureSignal} from "../room/room.component";

@Component({
  selector: 'app-fan',
  templateUrl: './fan.component.html',
  styleUrls: ['./fan.component.scss']
})
export class FanComponent implements OnInit,AfterViewInit {

  @Input('handGestureRoomEmitter') handGestureRoomEmitter:EventEmitter<RoomHandGestureSignal> | undefined;

  @Input('routerView') routerView = true;

  @ViewChild('fanCheckBox') fanCheckBox: ElementRef<HTMLInputElement> | undefined = undefined;
  fanOn = false;

  fanName = "this is the fan"

  @Input('fanNumber') fanNumber:number = 1;

  navigating = true;



  constructor(private homeService:HomeService,
              private route:Router,
              private activatedRouter:ActivatedRoute,
              private store:Store<{handGesture:string}>) { }

  async ngOnInit() {


  }

   async ngAfterViewInit() {
     if (!this.fanCheckBox) return;

     if (this.routerView) {

       this.activatedRouter.paramMap.subscribe(async (e) => {
         // @ts-ignore
         this.fanNumber = Number.parseInt(e.get('id')) || 1
         const props = await this.homeService.getProperties()
         //  @ts-ignore
         const faninfo = props['fan'][this.fanNumber]
         this.fanOn = faninfo.state == 'on' ? true : false;
         // @ts-ignore
         this.fanCheckBox.nativeElement.checked = this.fanOn;
         this.fanName = faninfo['name']
         // @ts-ignore
         this.fanCheckBox.nativeElement.addEventListener('change', async (ev) => {
           console.log(ev, " this was  happned")
           this.fanOn = this.fanCheckBox?.nativeElement.checked || false;
           if (this.fanOn) {
             await this.homeService.fanOpen(this.fanNumber);
           } else {
             await this.homeService.fanOff(this.fanNumber)
           }
         })
       })


       this.activatedRouter.queryParamMap.subscribe(async (e) => {
         const props = await this.homeService.getProperties()
         //  @ts-ignore
         const faninfo = props['fan'][this.fanNumber]
         this.fanOn = faninfo.state == 'on' ? true : false;
         // @ts-ignore
         this.fanCheckBox.nativeElement.checked = this.fanOn;
         this.fanName = faninfo['name']
         // @ts-ignore
         this.fanCheckBox.nativeElement.addEventListener('change', async (ev) => {
           console.log(ev, " this was  happned")
           this.fanOn = this.fanCheckBox?.nativeElement.checked || false;
           if (this.fanOn) {
             await this.homeService.fanOpen(this.fanNumber);
           } else {
             await this.homeService.fanOff(this.fanNumber)
           }
         })
       })

       this.store.select('handGesture').subscribe(async (e) => {
        console.log(e, " from fan component")
         if (!this.route.routerState.snapshot.url.startsWith("/fan")) {
           return;
         }
         console.log("pass to here")
         if (e == "on" && (!this.fanOn)) {
           this.fanOn = true;
           // @ts-ignore
           this.fanCheckBox.nativeElement.checked = this.fanOn;
           this.navigating = false;
           await this.homeService.fanOpen(this.fanNumber)
         } else if (e == "off" && (this.fanOn)) {
           this.fanOn = false;
           this.navigating = false;
           // @ts-ignore
           this.fanCheckBox.nativeElement.checked = this.fanOn;
           await this.homeService.fanOff(this.fanNumber)
         }

       })

     } else {

       const props = await this.homeService.getProperties()
       //  @ts-ignore
       const faninfo = props['fan'][this.fanNumber]
       this.fanOn = faninfo.state == 'on' ? true : false;
       this.fanCheckBox.nativeElement.checked = this.fanOn;
       this.fanName = faninfo['name']
       this.fanCheckBox.nativeElement.addEventListener('change', async (ev) => {
         console.log(ev, " this was  happned")
         this.fanOn = this.fanCheckBox?.nativeElement.checked || false;
         if (this.fanOn) {
           await this.homeService.fanOpen(this.fanNumber);
         } else {
           await this.homeService.fanOff(this.fanNumber)
         }
       })

       if(this.handGestureRoomEmitter){

         this.handGestureRoomEmitter.subscribe( async (e) => {
              if(e.type == "FAN" && e.id == this.fanNumber){
                if(e.message == "on" && !this.fanOn){
                  this.fanOn = true;
                  // @ts-ignore
                  this.fanCheckBox?.nativeElement.checked  = true;
                  await this.homeService.fanOpen(this.fanNumber);
                }else if(e.message == "off" && this.fanOn){
                  this.fanOn = false;
                  // @ts-ignore
                  this.fanCheckBox?.nativeElement.checked  = false;
                  await this.homeService.fanOpen(this.fanNumber);
                  // await this.homeService.fanOff(this.fanNumber)
                }

              }
         })
       }

     }
   }



//   Navigating
  //   navigation controls
  getClassNameForLightIconCirlce(index:number){
    let names = "  light-icon-circle "
    if(this.fanNumber == index){
      names += " light-icon-circle-highlight "
    }
    return names
  }

  onLightCircleGetClicked(index:number){
    this.route.navigateByUrl('/fan/'+index)
  }


  goLeftArrowClick(){
    if(this.fanNumber == 1){return;}
    this.route.navigateByUrl('/fan/'+ (this.fanNumber-1))
  }

  goRightArrowClick(){
    if(this.fanNumber == 1){return;}
    this.route.navigateByUrl('/fan/'+ (++this.fanNumber) )
  }

}
