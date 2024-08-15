import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dictation, { loader as dictationLoader} from "./components/Dictation.jsx";
import DictationTopics, { loader as topicLoader } from "./components/DictationTopics.jsx";
import TopicItem from "./components/TopicItem.jsx";
import store from "./store.js";
import { Provider } from "react-redux";
import Exercises, { loader as exerciseLoader } from "./components/Exercises.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Provider store={store}>
                <App />
            </Provider>
        ),
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
                loader: dictationLoader
            },

        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router}></RouterProvider>
    </StrictMode>
);
