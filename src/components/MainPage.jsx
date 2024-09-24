import React, { useEffect } from "react";
import { Header } from "./Header";
import { Outlet, useLoaderData } from "react-router-dom";
import axios from "axios";
import "./Header.css";
import { useDispatch } from "react-redux";
import { setLoginState } from "../slicers/AppSlice";
import { axiosRequestWithCookieOption } from "../utils/requestOption";
const serverURL = import.meta.env.VITE_SERVER_DOMAIN;

const loader = async ({ request, params }) => {
    try {
        const res = await axios.get(`${serverURL}/auth/verify`, axiosRequestWithCookieOption);

        const data = res.data;
        if (data.email) {
            return { login: true };
        } else {
            return { login: false };
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

    useEffect(() => {
        if (loaderData.login) {
            dispatch(setLoginState(true));
        }
    }, [loaderData]);

    return (
        <>
            <Header></Header>
            <div className="main-page-body">
                <Outlet></Outlet>
            </div>
            <footer></footer>
        </>
    );
};

export { MainPage, loader };
