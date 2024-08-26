import React, { useState } from "react";
import "./SpanWithDictionary.css";

const SpanWithDictionary = (props) => {

    return (
        <>
            <span className="answer-span" onClick={props.onClick}>
                {props.text}
            </span>
        </>
    );
};

export { SpanWithDictionary };
