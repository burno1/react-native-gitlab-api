import React, { createContext, useReducer } from 'react';
import axios from 'axios';
import * as RootNavigation from './../../RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';



const AuthContext = createContext(null);

function authReducer(state, action) {
    switch (action.type) {
        case 'signIn':
            return ({
                ...state,
                signedIn: true,
                access_token: action.payload.access_token
            });
        case 'signOut':
            return ({
                ...state,
                signedIn: false,
                access_token: null
            });
        case 'error':
            return ({
                ...state,
                signedIn: false,
                access_token: null,
                error: action.payload
            })
        default:
            return ({ ...state });
    }
}

const AuthProvider = ({ children }) => {

    const errorAction = (msg) => {
        dispatch({ type: 'error', payload: msg });
    }

    const logoutAction = async () => {
        const access_token = await AsyncStorage.removeItem('access_token');

        dispatch({type:'signOut'});
        RootNavigation.navigate("Login");
    }

    const isLoggedIn = async () =>{
        const access_token = await AsyncStorage.getItem('access_token');

        return access_token;

    }

    const [authState, dispatch] = useReducer(authReducer, {
        signedIn: false,
        access_token: null,
        error: ''
    });


    const tryLocalSignIn = async () =>{
        const access_token = await AsyncStorage.getItem('access_token');

        if(access_token) {
            dispatch({type: 'signIn', payload: access_token})
            RootNavigation.navigate("Home");
        } else {
            dispatch({type:'signOut'});
            RootNavigation.navigate("Login");

        }
    }

    const signInAction = async ({ username, password }) => {
        try {
            const response = await axios({
                method: "post",
                url: "https://gitlab.tadsufpr.net.br/oauth/token",
                data: {
                    grant_type: "password",
                    username,
                    password,
                },
            });
            await AsyncStorage.setItem('access_token',response.data.access_token);
            dispatch({ type: "signIn", payload: response.data.access_token });
            RootNavigation.navigate("Home");
        } catch (err) {
            console.log(err);
            dispatch({
                type: "error",
                payload: "Error during authentification",
            });
        }
    };


    return (
        <AuthContext.Provider value={{
            authState,
            signInAction,
            tryLocalSignIn,
            logoutAction,
            isLoggedIn
        }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthContext, AuthProvider }

