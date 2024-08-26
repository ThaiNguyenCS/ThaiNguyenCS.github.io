import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./SettingMenu.css";
import { setLoginState } from "../slicers/AppSlice";
import { Link } from "react-router-dom";
const SettingMenu = ({ className, settingMenuRef }) => {
    const isLogin = useSelector((state) => state.appState.isLogined);
    const dispatch = useDispatch();

    const logOut = () => {
        localStorage.removeItem("jwt_token");
        dispatch(setLoginState(false));
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
                        <Link
                            to={"/login"}
                            className="unstyled-link setting-menu-item"
                        >
                            Login
                        </Link>
                        <Link
                            to={"/register"}
                            className="unstyled-link setting-menu-item"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </>
    );
};

export { SettingMenu };
