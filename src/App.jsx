import "./App.css";
import { Header } from "./components/Header";
import { Outlet } from "react-router-dom";

function App() {
    return (
        <>
            <Header></Header>
            <div className="main-page-body">
                <Outlet></Outlet>
            </div>
        </>
    );
}

export default App;
