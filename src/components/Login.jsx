import React, { useEffect, useState } from "react";
import "./Login.css";
import { Form, useActionData, useNavigate, useSubmit } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoginState } from "../slicers/AppSlice";

const serverURL = import.meta.env.VITE_SERVER_DOMAIN;

const action = async ({ request, params }) => {
    console.log(request);
    const data = await request.formData();
    const res = await axios.post(`${serverURL}/auth/login`, data);
    console.log(res.headers);
    const returnData = res.data;
    if (returnData.result) {
        localStorage.setItem("jwt_token", returnData.token);
        return returnData;
    }
    return returnData;
};

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const submit = useSubmit();
    const loginStatus = useActionData();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    
    useEffect(() => {
        console.log(loginStatus);
        if (loginStatus) {
            if (loginStatus.result) {
                if (loginStatus.statusCode !== 1) {
                    setPassword("");
                } else {
                    console.log("login successfully");
                    dispatch(setLoginState(true));
                    navigate("/home", {replace: true}); // back to the previous page
                }
            }
        }
    }, [loginStatus]);

    const handleEmailInput = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordInput = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email) {
            alert("Please enter the email!");
            return;
        }
        if (!password) {
            alert("Please enter the password");
            return;
        }
        const formData = new FormData(e.target);
        submit(formData, { action: "/login", method: "POST" });
    };
    return (
        <div className="login-page-container">
            <div className="login-form-container">
                <Form
                    action="/login"
                    method="POST"
                    onSubmit={(e) => handleLogin(e)}
                >
                    <div>
                        <label htmlFor="emailInput">Email</label>
                        <input
                            id="emailInput"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => handleEmailInput(e)}
                        />
                    </div>
                    <div>
                        <label htmlFor="passwordInput">Password</label>
                        <input
                            id="passwordInput"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => handlePasswordInput(e)}
                        />
                    </div>
                    <button type="submit">Login</button>
                </Form>
                <div>{loginStatus && loginStatus.msg}</div>
            </div>
        </div>
    );
};

export { Login, action };
