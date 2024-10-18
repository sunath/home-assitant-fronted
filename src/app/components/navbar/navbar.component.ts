import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";
import {navbarCloseAction} from "../../state/actions/navbar.actions";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  urls = [
    "/light/1",
    "/door/1",
    "/fan/1",
    "/room/1",
    "/room/2"
  ]


  $microphoneRecording = false;
  userActed = false;
  isNavbarOpened = false;
  navbarClasses:string[] = ['navbar']

  openedUsingHand = false;
  handMoveDown = true;
  canMoveUsingHand = true;

  constructor(
    private store:Store<{microphoneRecording:boolean,navbarState:boolean,handGesture:string}>,
    private router:Router,
    private activatedRouter:ActivatedRoute
  ) {

    this.store.select('microphoneRecording').subscribe(e => {
      this.$microphoneRecording = e;
    })

    this.store.select('navbarState').subscribe(e => {
      if(e && !this.isNavbarOpened){
          this.toggleNavbar()
        this.openedUsingHand  = true;
      }else if(!e && this.isNavbarOpened && this.openedUsingHand){
        if(!this.router.url.startsWith("/navbar"))return;
        const navigateURL = this.activatedRouter.snapshot.queryParamMap.get('cameFrom') || "/"
        this.router.navigateByUrl(navigateURL,{replaceUrl:true});
        this.toggleNavbar()
      }
    })


    this.store.select('handGesture').subscribe(async (e) => {
      // console.log(this.router.url.startsWith("/navbar"))
      if(!this.router.url.startsWith("/navbar"))return;

      if(e.startsWith("navigate") && this.openedUsingHand && this.canMoveUsingHand){

        if(this.highlightedNavigation == 1) {
          this.handMoveDown = true;
          this.highlightedNavigation += 1;

        }else if(this.highlightedNavigation == 5){
          this.handMoveDown = false;
          this.highlightedNavigation -= 1;
        }else if(this.handMoveDown){
          this.highlightedNavigation += 1;
        }else{
          this.highlightedNavigation -= 1;
        }

        this.canMoveUsingHand = false;
        setTimeout(() => {
          this.canMoveUsingHand = true;
        },1250)

      }
      else if(e == "on" && this.openedUsingHand){

        // console.log(this.urls[this.highlightedNavigation-1])
        await this.router.navigateByUrl(this.urls[this.highlightedNavigation-1],{replaceUrl:true})
        this.canMoveUsingHand = true;
        this.handMoveDown = true;
        this.highlightedNavigation = 1;
        this.store.dispatch(navbarCloseAction())
        this.toggleNavbar()
      }
    })

  }

  ngOnInit(): void {
  }


  toggleNavbar(){
    this.userActed = true;
    this.isNavbarOpened = !this.isNavbarOpened;

    if(!this.isNavbarOpened){
      this.navbarClasses = ['navbar','navbar-expanded','navbar-close']

      setTimeout(() => {
        this.navbarClasses = ['navbar']
      },300)
    }else{
      this.navbarClasses = ['navbar','navbar-expanded']
    }

  }


  getMainNavbarClassNames(){
   return this.navbarClasses.join(" ")
  }


  createNavLink(url:string){
    this.router.navigateByUrl(url,{replaceUrl:true});
    this.toggleNavbar()
  }

  highlightedNavigation = 1;


  getButtonHighlightedAccent(index:number){
      let className: "primary" | "warn" | "accent"   = "primary"
      if(this.openedUsingHand && this.highlightedNavigation == index){
        className = "warn"
      }
      return className;
  }

}
