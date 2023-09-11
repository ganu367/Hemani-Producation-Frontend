import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
import { Form } from "../components";
import axios from "../api/axios";
import { useAuth } from "../hooks";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function Signin() {
    const {setAuth} = useAuth();
    // const navigate = useNavigate();
    // const location = useLocation();
    // const from = location.state?.from?.pathname || "/company";
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    // const [userType, setUserType] = useState("user");
    const [showPassword, setShowPassword] = useState(false);
    const isInvalid = password === "" || username === "";

    const resetInputFields = () => {
        setUsername("");
        setPassword("");
    }

    const isValidEmail = (username) => {
        return /\S+@\S+\.\S+/.test(username);
    }
    useEffect(() => {
        setError("");
    }, [username,password]);
    
    const handleSignin = async (event) => {
        event.preventDefault();
        // if(!isValidEmail(event.target.username.value)) {
        //     setError("Username is invalid!");
        //     return;
        // }
        // const isAdmin = (userType === "admin" ? "True" : "False");
        const data = {
            username: username,
            password: password,
        };
        try {
            const response = await axios.post("/auth/login-user", //+isAdmin,
            data,
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded", "Access-Control-Allow-Origin": "*" },
                withCredentials: true
            }
            );
            const accessToken = response?.data?.access_token;
            const tokenType = response?.data?.token_type;
            setAuth({accessToken, tokenType});
            setUsername("");
            setPassword("");
        }
        catch (err) {
            if(!err?.response) {
                setError("No server response!");
            }
            else if (err.response?.status === 400) {
                setError("Missing username or password!")
            }
            else if (err.response?.status === 401) {
                setError("Unauthorized!")
            }
            else {
                setError(`${err?.response?.data?.detail}`);
            }
        }
    }

    return (
        <>
        <Form>
            <Form.Title>SIGN IN</Form.Title>
            <Form.Line />
            {error &&
                <Form.Error>
                    Error: {error}
                </Form.Error>
            }
            {/* <Form.ToggleGroup>
                <Form.Toggle onClick={() => {
                    setUserType((userType === "user" ? "admin" : "user"));
                    resetInputFields();
                }}>
                    Signin as {(userType === "user" ? "admin" : "user")}
                </Form.Toggle>
            </Form.ToggleGroup> */}
            <Form.Base onSubmit={handleSignin} >
                <Form.InputContainer>
                    <Form.Input type="text" id="username" placeholder=" " autoComplete="off" value={username} onChange={({target}) => setUsername(target.value)} />
                    <Form.Label htmlFor="username">Username</Form.Label>
                </Form.InputContainer>
                <Form.InputContainer>
                    <Form.Input type={(showPassword) ? "text" : "password"} id="password"  autoComplete="off" placeholder=" " value={password} onChange={({target}) => setPassword(target.value)} />
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <Form.Icon onClick={() => {setShowPassword(!showPassword)}}>
                        {(showPassword) ? <AiFillEye /> : <AiFillEyeInvisible />}
                    </Form.Icon>
                </Form.InputContainer>
                <Form.Submit disabled={isInvalid} type="submit">Sign In</Form.Submit>
            </Form.Base>
        </Form>
        </>
    );
}

export default Signin;
