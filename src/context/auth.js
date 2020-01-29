import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
    user: null
};

const token = localStorage.getItem('jwtToken');

if (token) {
    const { exp, username, id } = jwtDecode(token);

    if (exp * 1000 < Date.now()) {
        localStorage.removeItem('jwtToken');
    } else {
        initialState.user = {
            token,
            username,
            id
        };
    }
}

const AuthContext = createContext({
    user: null,
    login: userData => { },
    logout: () => { }
});

const authReducer = (state, { type, payload }) => {
    switch (type) {
        case 'LOGIN':
            return {
                ...state,
                user: payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default:
            return state;
    }
}

const AuthProvider = props => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = userData => {
        localStorage.setItem('jwtToken', userData.token);

        dispatch({
            type: 'LOGIN',
            payload: userData
        });
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');

        dispatch({
            type: 'LOGOUT'
        });
    }

    return (
        <AuthContext.Provider value={{ user: state.user, login, logout }} {...props} />
    )
}

export {
    AuthContext,
    AuthProvider
};