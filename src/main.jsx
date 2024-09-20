import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dictation, loader as dictationLoader } from "./components/Dictation.jsx";
import { DictationTopics, loader as topicLoader } from "./components/DictationTopics.jsx";
import store from "./store.js";
import { Provider } from "react-redux";
import { MainPage } from "./components/MainPage.jsx";
import { action as loginAction, Login } from "./components/Login.jsx";
import { SignUp, action as registerAction } from "./components/SignUp.jsx";
import { AuthenticCheck } from "./components/AuthenticCheck.jsx";
import { ErrorComponent } from "./components/ErrorComponent.jsx";
import { Tests, loader as testLoader } from "./components/Tests.jsx";
import { TestDetail, loader as testDetailLoader, action as testDetailAction } from "./components/TestDetail.jsx";
import {
    TestPractice,
    loader as testPracticeLoader,
    action as testPracticeAction,
} from "./components/TestPractice.jsx";
import { TestResult, loader as testResultLoader } from "./components/TestResult.jsx";
import { Flashcard, loader as flashcardLoader, action as flashcardAction } from "./components/Flashcard.jsx";
import { FlashcardItem } from "./components/FlashcardItem.jsx";
import {
    action as flashcardDetailAction,
    FlashcardDetail,
    loader as flashcardDetailLoader,
} from "./components/FlashcardDetail.jsx";
import {
    FlashcardPractice,
    loader as flashcardPracticeLoader,
    action as flashcardPracticeAction,
} from "./components/FlashcardPractice.jsx";
import { DictationExercises, loader as exerciseLoader } from "./components/DictationExercises.jsx";
import {
    FlashcardTest,
    loader as flashcardTestLoader,
    action as flashcardTestAction,
} from "./components/FlashcardTest.jsx";
import { CurrentNavigation } from "./components/CurrentNavigation.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage />,
        errorElement: <ErrorComponent />,
        children: [
            {
                path: "home",
                element: (
                    <>
                        <CurrentNavigation />
                        <div>Home page</div>
                    </>
                ),
            },
            {
                path: "dictation",
                element: (
                    <>
                        <CurrentNavigation />
                        <DictationTopics />
                    </>
                ),
                loader: topicLoader,
            },
            {
                path: "dictation/:topic",
                element: (
                    <>
                        <CurrentNavigation />
                        <DictationExercises />
                    </>
                ),
                loader: exerciseLoader,
            },
            {
                path: "dictation/:topic/:exerciseID",
                element: (
                    <>
                        <CurrentNavigation />
                        <Dictation />
                    </>
                ),
                loader: dictationLoader,
            },
            {
                path: "tests/practice/:id",
                element: (
                    <>
                        <CurrentNavigation />
                        <TestPractice />
                    </>
                ),
                loader: testPracticeLoader,
                action: testPracticeAction,
            },
            {
                path: "tests/:id/result/:historyID",
                element: (
                    <>
                        <CurrentNavigation />
                        <TestResult />
                    </>
                ),
                loader: testResultLoader,
            },
            {
                path: "tests/:topic/:id",
                element: (
                    <>
                        <CurrentNavigation />
                        <TestDetail />
                    </>
                ),
                loader: testDetailLoader,
                action: testDetailAction,
            },
            {
                path: "tests/:topic?", // topic is optional
                element: (
                    <>
                        <CurrentNavigation />
                        <Tests />
                    </>
                ),
                loader: testLoader,
            },
            {
                path: "flashcard/:id/practice",
                element: (
                    <>
                        <CurrentNavigation />
                        <FlashcardPractice />
                    </>
                ),
                loader: flashcardPracticeLoader,
                action: flashcardPracticeAction,
            },
            {
                path: "flashcard/:id/test",
                element: (
                    <>
                        <CurrentNavigation />
                        <FlashcardTest />
                    </>
                ),
                loader: flashcardTestLoader,
                action: flashcardTestAction,
            },
            {
                path: "flashcard/:id",
                element: (
                    <>
                        <CurrentNavigation />
                        <FlashcardDetail />
                    </>
                ),
                action: flashcardDetailAction,
                loader: flashcardDetailLoader,
            },
            {
                path: "flashcard",
                element: (
                    <>
                        <CurrentNavigation />
                        <Flashcard />
                    </>
                ),
                loader: flashcardLoader,
                action: flashcardAction,
            },
        ],
    },
    {
        path: "/login",
        element: (
            <>
                <AuthenticCheck />
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
