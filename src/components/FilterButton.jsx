import React from "react";
import styles from "./FilterButton.module.css";
import { useNavigate } from "react-router-dom";
const FilterButton = (props) => {
    const navigate = useNavigate();

    return(<>
    <button className={styles['button']} onClick={() => navigate(`/tests/${props.categoryURL}`)}>{props.title}</button>
    </>)
}

export {FilterButton};