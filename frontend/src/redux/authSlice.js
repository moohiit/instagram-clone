import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    suggestedUsers: [],
    followings:[],
    userProfile: null,
    selectedUser: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setSuggestedusers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setFollowings: (state, action) => {
      state.followings = action.payload;
    }
  },
});

export const {
  setAuthUser,
  setToken,
  setSuggestedusers,
  setUserProfile,
  setSelectedUser,
  setFollowings,
} = authSlice.actions;
export default authSlice.reducer;