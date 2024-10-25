import React, { useEffect, useState } from "react";
import { Header } from "./Header";
import { Outlet, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";
import { useDispatch } from "react-redux";
import { setLoginState } from "../slicers/AppSlice";
import { axiosRequestWithCookieOption } from "../utils/requestOption";
import { Suspense } from "react";


const serverURL = import.meta.env.VITE_SERVER_DOMAIN;

const loader = async ({ request, params }) => {
    try {
        const res = await axios.get(`${serverURL}/auth/verify`, axiosRequestWithCookieOption);

        const data = res.data;
        if (data.email) {
            return { ...data, login: true };
        } else {
            return {login: false };
        }
    } catch (error) {
        console.log(error);
        return { login: false };
    }
};

const MainPage = () => {
    console.log("MainPage render");
    const dispatch = useDispatch();
    const loaderData = useLoaderData();
    const [loginStatus, setLoginStatus] = useState(loaderData)
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/") navigate("/home");
    }, []);

    useEffect(() => {
        if (loginStatus.login) {
            dispatch(setLoginState({login: loginStatus.login, email: loginStatus.email, appname: loginStatus.appname}));
        }
    }, [loginStatus]);

    return (
        <>
            <Header></Header>
            <div className="main-page-body">
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet></Outlet>
                </Suspense>
            </div>
            <footer></footer>
        </>
    );
};

export { MainPage, loader };
