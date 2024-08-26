import React from "react";
import TestsStyle from "./Tests.module.css";
import { FilterButton } from "./FilterButton";
import { TestItem } from "./TestItem";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
const apiURL = import.meta.env.VITE_API_URL;

const loader = async () => {
    const response = await axios.get(`${apiURL}/tests`);
    const data = response.data;
    if (data.result) {
        console.log(data.data);
        return data.data;
    }
    console.log("No tests");
    return null;
};

const Tests = () => {
    const testArr = useLoaderData();
    return (
        <>
            <div className={TestsStyle.container}>
                <div className={TestsStyle["left-section"]}>
                    <div className={TestsStyle.title}>English Tests</div>
                    <input
                        className={TestsStyle["search-bar"]}
                        placeholder="Search tests..."
                    />
                    <button className={TestsStyle["search-button"]}>
                        Search
                    </button>
                    <div className={TestsStyle["filter-container"]}>
                        <FilterButton title="All"></FilterButton>
                        <FilterButton title="Ielts Academic"></FilterButton>
                        <FilterButton title="Toeic"></FilterButton>
                    </div>
                    <div className={TestsStyle["tests-grid-layout"]}>
                        {testArr &&
                            testArr.map((test, idx) => (
                                <TestItem
                                    test={test}
                                    key={test.id || idx}
                                ></TestItem>
                            ))}
                    </div>
                </div>
                <div className={TestsStyle["right-section"]}>
                    {/* streak calendar */}
                    <div>Calendar</div>
                </div>
            </div>
        </>
    );
};

export { Tests, loader };
