import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./SettingMenu.module.css";
import { setLoginState } from "../slicers/AppSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosRequestWithCookieOption } from "../utils/requestOption";
const serverURL = import.meta.env.VITE_SERVER_DOMAIN;

const SettingMenu = ({ className, settingMenuRef, closeMenu }) => {
    const appState = useSelector((state) => state.appState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logOut = async () => {
        try {
            const response = await axios.post(`${serverURL}/auth/logout`, {}, axiosRequestWithCookieOption);
            const data = response.data;
            if (data.result) {
                dispatch(setLoginState({login: false, email: "", appname: ""}));
            } else {
                alert("Logout failed");
            }
        } catch (error) {
            console.log(error);
            alert("Logout failed");
        }
    };

    const goToProfile = () => {
        closeMenu()
        navigate("/profile")
    }

    return (
        <>
            <div
                className={`${styles["setting-drop-menu"]} ${className ? styles[className] : ""}`}
                ref={settingMenuRef}
            >
                {appState?.isLogined ? (
                    <>
                        <div className={styles["user-card"]}>
                            <img src="" alt="Avatar" className={styles["user-avt"]} />
                            <div className={styles['user-info-section']}>
                                <div className={styles["user-name"]}>
                                    {appState?.appname}
                                </div>
                                <div className={styles["visit-profile"]} onClick={() => {
                                    goToProfile()
                                }}>Go to profile</div>
                            </div>
                        </div>
                        <div id="logout-button" className={styles["setting-menu-item"]} onClick={() => logOut()}>
                            Logout
                        </div>
                    </>
                ) : (
                    <>
                        <Link to={"/login"} className={`${styles["unstyled-link"]} ${styles["setting-menu-item"]}`}>
                            Login
                        </Link>
                        <Link to={"/register"} className={`${styles["unstyled-link"]} ${styles["setting-menu-item"]}`}>
                            Register
                        </Link>
                    </>
                )}
            </div>
        </>
    );
};

export { SettingMenu };
