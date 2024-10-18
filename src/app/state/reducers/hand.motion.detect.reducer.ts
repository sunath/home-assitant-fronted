import {createReducer, on} from "@ngrx/store";
import {handMotionDetectAction} from "../actions/hand.motion.detect.actions"

const initialState = "none";
export const HandGestureMotionReducer = createReducer(
  initialState,
  on(handMotionDetectAction, (state, payload) => (state = payload.change))
);
