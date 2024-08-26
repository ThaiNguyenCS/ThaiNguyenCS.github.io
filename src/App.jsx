import axios from "axios";
import "./App.css";
import { Header } from "./components/Header";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoginState } from "./slicers/AppSlice";
function App() {

    return (
        <>
            <Outlet></Outlet>
        </>
    );
}

export default App;
