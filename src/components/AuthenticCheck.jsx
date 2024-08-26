import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoginState } from "../slicers/AppSlice";
const serverURL = import.meta.env.VITE_SERVER_DOMAIN;

const AuthenticCheck = () => {
    const navigate = useNavigate();
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
                        const timeout = setTimeout(() => {
                            navigate("/home", {replace: true});
                        }, 3000);
                   
                        return () => {
                            console.log("clear timing");
                            clearTimeout(timeout);
                        };
                    } else {
                        dispatch(setLoginState(false));
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, []);

};

export { AuthenticCheck };
