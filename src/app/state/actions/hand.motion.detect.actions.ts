import {createAction, props} from "@ngrx/store";


export const  handMotionDetectAction = createAction('[Hand MotionDetect HandMotionDetectAction]',props<{change:string}>())
// export const microphoneRecordingEnd = createAction('[MicrophoneRecordingEnd]')
