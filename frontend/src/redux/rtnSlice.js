import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "notification",
  initialState: {
    liveNotification: [],
  },
  reducers: {
    setLiveNotification: (state, action) => {
        state.liveNotification=action.payload;
    },
  },
});

export const { setLiveNotification } = rtnSlice.actions;
export default rtnSlice.reducer;
