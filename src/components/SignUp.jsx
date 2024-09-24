import React, { useState } from "react";
import "./SignUp.css";
import { Form, redirect, useActionData, useSubmit } from "react-router-dom";
import axios from "axios";
import { checkValidRegisterPassword, checkValidRegisterUserName, checkTheSecondPassword } from "../utils/handleInput";
const serverURL = import.meta.env.VITE_SERVER_DOMAIN;

const action = async ({ request, pararms }) => {
    const formData = await request.formData();
    const res = await axios.post(`${serverURL}/auth/register`, formData);
    const data = res.data;
    if (data.result) {
        console.log(data.data);
        return redirect("/login");
    }
    console.log(data.msg);
    return data.msg;
};

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [username, setUsername] = useState("");
    const submit = useSubmit();
    const registerStatus = useActionData();

    const handleRegister = (e) => {
        e.preventDefault();
        const usernameResult = checkValidRegisterUserName(username);
        console.log(usernameResult)
        if (!usernameResult.result) {
            alert(usernameResult.msg);
            return;
        }
        const emailResult = email.trim();
        if (!emailResult) {
            return;
        }
        const passwordResult = checkValidRegisterPassword(password)
        console.log(passwordResult)
        if (!passwordResult.result) {
            alert(passwordResult.msg);
            return;
        }
        const password2Result = checkTheSecondPassword(password, password2)
        if (!password2Result.result) {

            alert(password2Result.msg);
            return;
        }
        submit(e.target, {method:"POST", action: "/register"});
    };

    return (
        <>
            <Form
                action="/register"
                method="POST"
                onSubmit={(e) => handleRegister(e)}
            >
                <div>
                    <label htmlFor="userName">Username</label>
                    <input
                        id="userName"
                        type="text"
                        name="userName"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="emailInput">Email</label>
                    <input
                        id="emailInput"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="passwordInput">Password</label>
                    <input
                        id="passwordInput"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="secondPasswordInput">
                        Confirm password
                    </label>
                    <input
                        id="secondPasswordInput"
                        type="password"
                        name="password2"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                </div>

                <button type="submit">Register</button>
            </Form>
            <div>{}</div>
        </>
    );
};

export { SignUp, action };
