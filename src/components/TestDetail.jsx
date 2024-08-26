import React from "react";
const apiURL = import.meta.env.VITE_API_URL;
import axios from "axios";
import { Form, redirect, useLoaderData } from "react-router-dom";

const loader = async ({ params }) => {
    const response = await axios.get(`${apiURL}/tests/foo/${params.id}`);
    const data = response.data;
    if (data.result) {
        console.log(data.data);
        return data.data;
    }
    console.log("No TestDetail");
    return null;
};

const action = async ({ request, params }) => {
    const formData = await request.formData();
    console.log(params)
    if(formData.get("__action") === 'selectPart')
    {
        const query = formData.getAll("part").map(item => `part=${item}`).join("&");
        console.log(query)
        return redirect(`/tests/practice/${params.id}?${query}`);
    }
    //   console.log(formData.getAll("part"))
    return null;
};

const TestDetail = () => {
    const test = useLoaderData();
    return (
        <>
            <Form method="POST">
                <input type="hidden" name="__action" value={"selectPart"}/>
                {test &&
                    test.map((item, idx) => (
                        <>
                            <label>Part {item.partOrder}</label>
                            <input type="checkbox" name="part" value={item.partOrder}/>
                        </>
                    ))}
                    <button type="submit">Do it!</button>
            </Form>
        </>
    );
};

export { TestDetail, loader, action };
