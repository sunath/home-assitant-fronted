import {createReducer, on} from "@ngrx/store";
import {microphoneRecordingEnd, microphoneRecordingStart} from "../actions/microphone.recording.actions";


const initialState = false;
export const microphoneReducer = createReducer(
  initialState,
  on(microphoneRecordingStart,(state) => true),
  on(microphoneRecordingEnd,(state) => false),
);
