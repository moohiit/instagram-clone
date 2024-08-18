import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "notification",
  initialState: {
    liveNotification: [],
  },
  reducers: {
    setLiveNotification: (state, action) => {
        state.liveNotification.push(action.payload);
      // if (action.payload.type === "like") {
      // } else if (action.payload.type === "dislike") {
      //   state.liveNotification = state.liveNotification.filter(
      //     (items) => items.userId !== action.payload.userId
      //   );
      // } else if (action.payload.type === "comment") {
      //   state.liveNotification.push(action.payload);
      // }
    },
  },
});

export const { setLiveNotification } = rtnSlice.actions;
export default rtnSlice.reducer;
