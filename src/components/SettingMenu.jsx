import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./SettingMenu.css";
import { setLoginState } from "../slicers/AppSlice";
import { Link } from "react-router-dom";
import axios from "axios";
import { axiosRequestWithCookieOption } from "../utils/requestOption";
const serverURL = import.meta.env.VITE_SERVER_DOMAIN;

const SettingMenu = ({ className, settingMenuRef }) => {
    const isLogin = useSelector((state) => state.appState.isLogined);
    const dispatch = useDispatch();

    const logOut = async () => {
        try {
            const response = await axios.post(`${serverURL}/auth/logout`, {}, axiosRequestWithCookieOption);
            const data = response.data;
            if (data.result) {
                dispatch(setLoginState(false));
            }
            else
            {
                alert("Logout failed")
            }
        } catch (error) {
            console.log(error)
            alert("Logout failed")
        }
    };

    return (
        <>
            <div className={`setting-drop-menu ${className}`} ref={settingMenuRef}>
                {isLogin ? (
                    <div id="logout-button" className="setting-menu-item" onClick={() => logOut()}>
                        Logout
                    </div>
                ) : (
                    <>
                        <Link to={"/login"} className="unstyled-link setting-menu-item">
                            Login
                        </Link>
                        <Link to={"/register"} className="unstyled-link setting-menu-item">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </>
    );
};

export { SettingMenu };
