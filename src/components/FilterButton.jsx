import React from "react";
import styles from "./FilterButton.module.css";
const FilterButton = (props) => {
    return(<>
    <button className={styles['button']}>{props.title}</button>
    </>)
}

export {FilterButton};