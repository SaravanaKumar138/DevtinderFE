import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "Requests",
  initialState: null,
  reducers: {
    addRequests: (state, action) => {
      return action.payload;
    },
    removeRequests: (state, action) => {
      const newArray = state.filter(
        (request) => request._id !== action.payload
      );
      return newArray;
    },
  },
});

export const { addRequests, removeRequests } = requestSlice.actions;

export default requestSlice.reducer;
