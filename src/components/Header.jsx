import React, { useEffect, useRef, useState } from "react";
import { RiMenu2Line } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setActivePath, setLoginState } from "../slicers/AppSlice";
import { SettingMenu } from "./SettingMenu";

const Header = () => {
    const navigate = useNavigate();
    const isUserLogin = useSelector((state) => state.appState.isLogined);
    const activeNav = useSelector((state) => state.appState.activePath);
    const dispatch = useDispatch();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const settingMenuRef = useRef(null);

    useEffect(() => {
        // console.log(settingMenuRef.current);
        if (isMenuOpen) {
            const hideMenu = (e) => {
                // console.log(e.clientX);
                // console.log(e.clientY);
                const menuRect = settingMenuRef.current.getBoundingClientRect();
                if (
                    e.clientX < menuRect.x ||
                    e.clientX > menuRect.right ||
                    e.clientY < menuRect.y ||
                    e.clientY > menuRect.bottom
                ) {
                    console.log("outside");
                    // if (isMenuOpen) {
                    setMenuOpen(false);
                    // }
                }
            };
            document.addEventListener("mousedown", hideMenu);
            return () => {
                document.removeEventListener("mousedown", hideMenu);
            };
        }
    }, [isMenuOpen]);

    const backToMainPage = (navStatus) => {
        dispatch(setActivePath(Number(navStatus)));
        navigate("/home");
    };

    const goToDictation = (navStatus) => {
        dispatch(setActivePath(Number(navStatus)));
        navigate("/dictation");
    };

    const goToTests = (navStatus) => {
        dispatch(setActivePath(Number(navStatus)));
        navigate("/tests/all");
    };

    const goToFlashCard = (navStatus) => {
        dispatch(setActivePath(Number(navStatus)));
        navigate("/flashcard");
    };

    const toggleSettingMenu = (e) => {
        e.preventDefault();

        console.log("toggleSettingMenu");

        setMenuOpen((state) => !state);
    };

    return (
        <>
            <header className="header-container">
                <div id="side-menu-button">
                    <RiMenu2Line id="side-menu-icon" style={{ fontSize: "1.5rem" }}></RiMenu2Line>
                </div>
                <div id="web-title">
                    <span id="web-title-text" onClick={() => backToMainPage(0)}>
                        English Breaker
                    </span>
                </div>
                <div
                    id="dictation-navigation"
                    data-nav-status={1}
                    className={activeNav === 1 && "nav-active"}
                    onClick={(e) => goToDictation(e.target.dataset.navStatus)}
                >
                    Dictation
                </div>

                <div
                    id="test-navigation"
                    data-nav-status={2}
                    className={activeNav === 2 && "nav-active"}
                    onClick={(e) => goToTests(e.target.dataset.navStatus)}
                >
                    Tests
                </div>

                <div
                    id="flashcard-navigation"
                    data-nav-status={3}
                    className={activeNav === 3 && "nav-active"}
                    onClick={(e) => goToFlashCard(e.target.dataset.navStatus)}
                >
                    Flashcard
                </div>

                <div id="setting-button">
                    <IoMdSettings
                        id="setting-icon"
                        style={{ fontSize: "1.5rem" }}
                        onClick={(e) => toggleSettingMenu(e)}
                    />

                    <SettingMenu
                        settingMenuRef={settingMenuRef}
                        className={`setting-drop-menu ${isMenuOpen ? "visible" : ""}`}
                    />
                </div>
            </header>
        </>
    );
};

export { Header };
