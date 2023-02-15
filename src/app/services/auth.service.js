import axios from "axios";
// import { useSelector } from "react-redux";
// import { getCurrentUserData, getCurrentUserId } from "../store/users";
import localStorageService from "./localStorage.service";
// import userService from "./user.service";

export const httpAuth = axios.create({
    baseURL: "https://identitytoolkit.googleapis.com/v1/",
    params: {
        key: process.env.REACT_APP_FIREBASE_KEY
    }
});
// const currentUserId = useSelector(getCurrentUserId());
// const currentUser = useSelector(getCurrentUserData());
const authService = {
    register: async ({ email, password }) => {
        const { data } = await httpAuth.post(`accounts:signUp`, {
            email,
            password,
            returnSecureToken: true
        });
        return data;
    },
    login: async ({ email, password }) => {
        const { data } = await httpAuth.post(`accounts:signInWithPassword`, {
            email,
            password,
            returnSecureToken: true
        });
        return data;
    },
    refresh: async () => {
        const { data } = await httpAuth.post("token", {
            grant_type: "refresh_token",
            refresh_token: localStorageService.getRefreshToken()
        });
        return data;
    }
    // updateProfile: async ({
    //     email,
    //     idToken = localStorageService.getAccessToken(),
    //     ...rest
    // }) => {
    //     if (currentUser.email !== email) {
    //         const { data } = await httpAuth.post(`accounts:update`, {
    //             idToken,
    //             email,
    //             returnSecureToken: true
    //         });
    //         console.log("data после updateEmail", data);
    //         localStorageService.setTokens(data);
    //     }
    //     const { content } = await userService.updateUser({
    //         _id: currentUserId,
    //         email,
    //         ...rest
    //     });
    //     console.log("content", content);
    //     return content;
    // }
};

export default authService;
