import react from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setActivePath } from "../slicers/AppSlice";

const CurrentNavigation = () => {
    const location = useLocation()
    const dispatch = useDispatch();
    
    if(location.pathname.match("/dictation"))
    {
        dispatch(setActivePath(1))
    }
    else if(location.pathname.match("/tests"))
    {
        dispatch(setActivePath(2))
    }
    else if(location.pathname.match("/flashcard"))
    {
        dispatch(setActivePath(3))
    }
    else
    {
        dispatch(setActivePath(0))
    }

    console.log(location)
}

export {CurrentNavigation}
    