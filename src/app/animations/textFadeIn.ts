import {animate, state, style, transition, trigger} from "@angular/animations";

export const TextFadingAnimationTrigger = trigger('textAnimation', [
  state('show',style({
    opacity:1
  })),

  state('hide',style({
    opacity:0
  })),


  transition("hide => show",animate('1.2s ease-out')),
  transition('show => hide',animate('.4s ease-in')),
  transition("* => *",animate('.4s'))
])
