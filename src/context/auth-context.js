import React, { useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = React.createContext({});

const AuthProvider = ({children}) => {
    const [auth,setAuth] = useState(JSON.parse(localStorage.getItem("auth")) || {accessToken: ""});
    const [JWT,setJWT] = useState(auth?.accessToken ? jwt_decode(auth.accessToken) : undefined);
    const navigate = useNavigate();

    useEffect(() => {
        setJWT(() => (auth?.accessToken ? jwt_decode(auth?.accessToken) : undefined));
        // navigate("/employer/dashboard");
    }, [auth]);

    useEffect(() => {
        console.log("JWT: ",JWT);
    }, [JWT]);

    useEffect(() => {
        localStorage.setItem("auth", JSON.stringify(auth));
    }, [auth])
    
    return (
        <AuthContext.Provider value={{auth,setAuth,JWT,setJWT}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;