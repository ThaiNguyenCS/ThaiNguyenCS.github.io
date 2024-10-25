import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { Form, useActionData, useLocation, useNavigate, useSubmit } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoginState } from "../slicers/AppSlice";

import IcGoogle from "../assets/ic_google.png";
import { axiosRequestWithCookieOption } from "../utils/requestOption";

const serverURL = import.meta.env.VITE_SERVER_DOMAIN;
console.log("ServerURL", serverURL);


const action = async ({ request, params }) => {
    console.log(request);
    const data = await request.formData();
    const res = await axios.post(`${serverURL}/auth/login`, data, axiosRequestWithCookieOption);
    // console.log(res.headers);
    const returnData = res.data;
    console.log(returnData);
    
    if (returnData.result) {
        // localStorage.setItem("jwt_token", returnData.token);
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
    const location = useLocation();

    useEffect(() => {
        console.log(loginStatus);
        if (loginStatus) {
            if (loginStatus.result) {
                if (loginStatus.statusCode !== 1) {
                    setPassword("");
                } else {
                    console.log("login successfully");
                    dispatch(setLoginState({login: true, email: loginStatus.data.email, appname: loginStatus.data.appname}));
                    if (location.search !== "") {
                        console.log("location.search");
                        
                        const redirect = new URLSearchParams(location.search);
                        navigate(redirect.get("redirect"), { replace: true });
                    } else {
                        console.log("home");
                        navigate("/home", { replace: true }); // back to the home page and clear login page
                    }
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
        submit(formData, { action: `/login${location.search}`, method: "POST" });
    };

    const loginWithGoogle = () => {
        window.location.href = "http://localhost:5000/auth/login/google";
    };

    return (
        <div className={styles["login-page-container"]}>
            <div className={styles["login-form-container"]}>
                <h1>Login</h1>
                <Form action="/login" method="POST" onSubmit={(e) => handleLogin(e)} className={styles["login-form"]}>
                    <div className={styles["input-group"]}>
                        <input
                            id="emailInput"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => handleEmailInput(e)}
                        />
                        <label
                            htmlFor="emailInput"
                            className={`${styles["label-line"]} ${email && styles["non-empty"]}`}
                        >
                            Email
                        </label>
                    </div>
                    <div
                        className={styles["input-group"]}
                        onFocus={(e) => {
                            console.log(e);
                        }}
                        onBlur={(e) => console.log(e)}
                    >
                        <input
                            id="passwordInput"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => handlePasswordInput(e)}
                        />
                        <label
                            htmlFor="passwordInput"
                            className={`${styles["label-line"]} ${password && styles["non-empty"]}`}
                        >
                            Password
                        </label>
                    </div>
                    <button type="submit" className={styles["login-button"]}>
                        Login
                    </button>
                </Form>
                <div className={styles["alternative-login-notify"]}>or login using</div>
                <div
                    className={styles["third-party-login"]}
                    onClick={() => {
                        loginWithGoogle();
                    }}
                >
                    <img src={IcGoogle} alt="Google Icon" className={styles["icon-30"]} />
                    <span>Sign in with Google</span>
                </div>
                <div>{loginStatus && loginStatus.msg}</div>
            </div>
        </div>
    );
};

export { Login, action };
