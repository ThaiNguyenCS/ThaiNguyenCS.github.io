import React from "react";
import { RiMenu2Line } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import "./Header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    console.log("Header render " + status);


    const backToMainPage = () => {
        navigate("/home");
    };

    const goToDictation = () => {
        navigate("/dictation");
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
                <div id="dictation-navigation" onClick={() => goToDictation()}>Dictation</div>
                <div id="setting-button">
                    <IoMdSettings
                        id="setting-icon"
                        style={{ fontSize: "1.5rem" }}
                    />
                </div>
            </header>
        </>
    );
};

export { Header };
