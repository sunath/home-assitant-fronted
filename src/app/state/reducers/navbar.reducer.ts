import {createReducer, on} from "@ngrx/store";
import {navbarCloseAction, navbarOpenAction} from "../actions/navbar.actions";


const initialState = false;

export const navbarReducer = createReducer(
  initialState,
  on(navbarOpenAction, (state) => true),
  on(navbarCloseAction, (state) => false),
  )
