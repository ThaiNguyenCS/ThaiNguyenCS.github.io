import React, { useEffect } from "react";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import axios from "axios";
import "./Header.css"
import { useDispatch } from "react-redux";
import { setLoginState } from "../slicers/AppSlice";
const serverURL = import.meta.env.VITE_SERVER_DOMAIN;

const MainPage = () => {
    console.log("MainPage render");
    const dispatch = useDispatch();

    useEffect(() => {
        const jwtToken = localStorage.getItem("jwt_token");
        if (jwtToken) {
            const res = axios
                .get(`${serverURL}/auth/verify`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                    withCredentials: true,
                })
                .then((res) => res.data)
                .then((data) => {
                    console.log(data);
                    if (data.email) {
                        dispatch(setLoginState(true));
                    } else {
                        dispatch(setLoginState(false));
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, []);

    return (
        <>
            <Header></Header>
            <div className="main-page-body">
                <Outlet></Outlet>
            </div>
            <footer>

            </footer>
        </>
    );
};

export { MainPage };
