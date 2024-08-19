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
        const newNotification = action.payload;

        // Remove "like" notification if a "dislike" notification for the same post/user exists
        if (newNotification.type === "dislike") {
          state.liveNotification = state.liveNotification.filter(
            (notification) =>
              !(
                notification.type === "like" &&
                notification.userId === newNotification.userId &&
                notification.postId === newNotification.postId
              )
          );
        }

        // Add the new notification
        state.liveNotification = [...state.liveNotification, newNotification];
      }
    },
  },
});

export const { setLiveNotification } = rtnSlice.actions;
export default rtnSlice.reducer;
