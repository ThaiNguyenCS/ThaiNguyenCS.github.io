import React, { useEffect, useRef, useState } from "react";
import { RiMenu2Line } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoginState } from "../slicers/AppSlice";
import { SettingMenu } from "./SettingMenu";

const Header = () => {
    const navigate = useNavigate();
    const isUserLogin = useSelector((state) => state.appState.isLogined);
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

    const backToMainPage = () => {
        navigate("/home");
    };

    const goToDictation = () => {
        navigate("/dictation");
    };

    const goToTests = () => {
        navigate("/tests/all");
    };

    const goToFlashCard = () => {
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
                    <RiMenu2Line
                        id="side-menu-icon"
                        style={{ fontSize: "1.5rem" }}
                    ></RiMenu2Line>
                </div>
                <div id="web-title">
                    <span id="web-title-text" onClick={() => backToMainPage()}>
                        English Breaker
                    </span>
                </div>
                <div id="dictation-navigation" onClick={() => goToDictation()}>
                    Dictation
                </div>

                <div id="test-navigation" onClick={() => goToTests()}>
                    Tests
                </div>

                <div id="flashcard-navigation" onClick={() => goToFlashCard()}>
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
                        className={`setting-drop-menu ${
                            isMenuOpen ? "visible" : ""
                        }`}
                    />
                </div>
            </header>
        </>
    );
};

export { Header };
