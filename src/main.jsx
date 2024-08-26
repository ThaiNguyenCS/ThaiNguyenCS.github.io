import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
    Dictation,
    loader as dictationLoader,
} from "./components/Dictation.jsx";
import {
    DictationTopics,
    loader as topicLoader,
} from "./components/DictationTopics.jsx";
import store from "./store.js";
import { Provider } from "react-redux";
import {
    Exercises,
    loader as exerciseLoader,
} from "./components/Exercises.jsx";
import { MainPage } from "./components/MainPage.jsx";
import { action as loginAction, Login } from "./components/Login.jsx";
import { SignUp, action as registerAction } from "./components/SignUp.jsx";
import { AuthenticCheck } from "./components/AuthenticCheck.jsx";
import {ErrorComponent} from "./components/ErrorComponent.jsx";
import { Tests, loader as testLoader } from "./components/Tests.jsx";
import { TestDetail, loader as testDetailLoader, action as testDetailAction } from "./components/TestDetail.jsx";
import { TestPractice, loader as testPracticeLoader } from "./components/TestPractice.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage />,
        errorElement: <ErrorComponent/>,
        children: [
            {
                path: "home",
                element: <div>Home page</div>,
            },
            {
                path: "dictation",
                element: <DictationTopics />,
                loader: topicLoader,
            },
            {
                path: "dictation/:topic",
                element: <Exercises />,
                loader: exerciseLoader,
            },
            {
                path: "dictation/:topic/:exerciseID",
                element: <Dictation />,
                loader: dictationLoader,
            },
            {
                path: "tests/practice/:id",
                element: <TestPractice/>,
                loader: testPracticeLoader,
            },
            {
                path: "tests/:id",
                element: <TestDetail/>,
                loader: testDetailLoader,
                action: testDetailAction,
            },
            {
                path: "tests",
                element: <Tests/>,
                loader: testLoader,
            },
        ],
    },
    {
        path: "/login",
        element: (
            <>
                <AuthenticCheck/>
                <Login />

            </>
        ),
        action: loginAction,
    },
    {
        path: "/register",
        element: (
            <>
                <AuthenticCheck />
                <SignUp />
            </>
        ),
        action: registerAction,
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}></RouterProvider>
        </Provider>
    </StrictMode>
);
