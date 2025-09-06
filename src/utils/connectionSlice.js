import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: "Connection",
     initialState: null,
     reducers: {
        addConnections: (state, action) => {
            return action.payload;
        },
        remoceConnections: (state, action) => {
            return null;
        }
     }
});

export const {addConnections, remoceConnections} = connectionSlice.actions;

export default connectionSlice.reducer;