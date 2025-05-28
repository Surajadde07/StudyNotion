import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: (() => {
        const token = localStorage.getItem("token");
        try {
            return token ? JSON.parse(token) : null; // Try parsing as JSON
        } catch (error) {
            return token; // If parsing fails, return the raw string
        }
    })(),
};

const authSlice =createSlice({
    name:"auth",
    initialState: initialState,
    reducers:{
        setSignupData(state, value) {
            state.signupData = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
        setToken(state,value){
            state.token=value.payload
        }
    }
});

export const {setToken,setLoading,setSignupData}=authSlice.actions;
export default authSlice.reducer;