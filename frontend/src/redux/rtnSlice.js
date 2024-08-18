import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "notification",
  initialState: {
    liveNotification: [],
  },
  reducers: {
    setLiveNotification: (state, action) => {
      if (action.payload === null) {
        state.liveNotification = [];
      } else {
        state.liveNotification = [...state.liveNotification, action.payload];
      }
    },
  },
});

export const { setLiveNotification } = rtnSlice.actions;
export default rtnSlice.reducer;
