import React from "react";
import styles from "./NotifyBar.module.css"

const NotifyBar = (props) => {
    return (
        <>
            <div className={`${styles['container']} ${props.className && styles[props.className] || ""}`}>{props.message || ""}</div>
        </>
    );
};

export { NotifyBar };
