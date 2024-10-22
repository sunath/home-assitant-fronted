import {animate, state, style, transition, trigger} from "@angular/animations";

export const SwipeAnimationTrigger = trigger('swipe',[

  state('disappearLeft',style({
    transform: 'translateX(-200%)',
    opacity:0
  })),

  state('disappearRight',style({
    transform: 'translateX(200%)',
    opacity:0
  })),

  state('appear',style({
    transform: 'translateX(0%)',
    opacity:1
  })),

  state('noDisplayRight',style({
    transform:'translateX(200%)',
  })),

  state('noDisplayLeft',style({
    transform:"translateX(-200%)"
  })),

  transition("disappearLeft => noDisplayRight",animate("100ms ease-in")),
  transition("disappearRight => noDisplayLeft",animate("100ms ease-in")),
  transition("appear => disappearLeft",animate("300ms ease-in")),
  transition("appear => disappearRight",animate("300ms ease-in")),
  transition("noDisplayLeft => appear",animate("300ms ease-out")),
  transition("noDisplayRight => appear",animate("300ms ease-out"))
])
