import { createSlice } from "@reduxjs/toolkit";
import { _updateHomeStateAction } from "./home.actions";

export interface HomeState {
  title: string;
  userName: string;
}

export interface HomeStateOptions extends Partial<HomeState> {}

const initialState: HomeState = {
  title: "Home bajo",
  userName: "",
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    updateHomeState: _updateHomeStateAction,
  },
});

// TODO: Try to make export of actions dynamical...
export const { updateHomeState } = homeSlice.actions;

export const homeReducer = homeSlice.reducer;
