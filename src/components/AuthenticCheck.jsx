import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoginState } from "../slicers/AppSlice";
import { getJWTToken } from "../utils/authentication";
import { axiosRequestWithCookieOption } from "../utils/requestOption";
const serverURL = import.meta.env.VITE_SERVER_DOMAIN;

const AuthenticCheck = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const jwtToken = getJWTToken();
        if (jwtToken) {
            const res = axios
                .get(`${serverURL}/auth/verify`, axiosRequestWithCookieOption)
                .then((res) => res.data)
                .then((data) => {
                    console.log(data);
                    if (data.email) {
                        dispatch(setLoginState({login: true, email: data.email, appname: data.appname}));
                        const timeout = setTimeout(() => {
                            navigate("/home", {replace: true});
                        }, 3000);
                   
                        return () => {
                            console.log("clear timing");
                            clearTimeout(timeout);
                        };
                    } else {
                        dispatch(setLoginState({login: false, email: "", appname: ""}));
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, []);

};

export { AuthenticCheck };
