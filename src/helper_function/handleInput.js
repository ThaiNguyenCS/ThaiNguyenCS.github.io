import { monthNames } from "../helper_function/timeHandling";

function handleInput(str) {
    let input = str;
    input = input.toLowerCase();
    let formattedInput = "";
    let countConsecutiveSpaces = 0;
    for (let i = 0; i < input.length; i++) {
        const chr = input.charAt(i);
        if (chr === " ") {
            countConsecutiveSpaces++;
            if (countConsecutiveSpaces < 2) formattedInput += chr;
        } else if (chr >= "a" && chr <= "z") {
            formattedInput += chr;
            countConsecutiveSpaces = 0;
        }
    }
    formattedInput = formattedInput.trim();
    return formattedInput;
}

function checkValidRegisterUserName(username) {
    let formatName = username.trim();
    if (formatName.length < 3) return {result: false, msg: 'Username must be at least 3 characters length'};
    for (let i = 0; i < formatName.length; i++) {
        const chr = formatName.charAt(i);
        if (
            !(
                (chr >= "a" && chr <= "z") ||
                (chr >= "A" && chr <= "Z") ||
                chr === " " ||
                chr === "_" ||
                (chr >= "0" && chr <= "9")
            )
        )
            return {result: false, msg: "Username can only contain lowercase, uppercase, number, space and underscore"};
    }
    return {result: true, msg: "Valid username"};
}
// password: at least 1 uppercase, 1 lowercase, 1 number, length is more than 8
function checkValidRegisterPassword(password) {
    const requirement = { lwrcase: false, uprcase: false, hasNumber: false };
    if (password.length < 8)
        return {
            result: false,
            msg: "Password must be at least 8 characters length",
        };
    if (password.length > 32)
        return {
            result: false,
            msg: "Password must be at most 32 characters length",
        };
    for (let i = 0; i < password.length; i++) {
        const chr = password.charAt(i);
        if (chr >= "a" && chr <= "z") requirement.lwrcase = true;
        if (chr >= "A" && chr <= "Z") requirement.uprcase = true;
        if (chr >= "0" && chr <= "9") requirement.hasNumber = true;
    }
    if (requirement.hasNumber && requirement.uprcase && requirement.lwrcase)
        return { result: true, msg: "Password is valid" };
    return { result: false, msg: "Password does not meet all the demands" };
}

function checkTheSecondPassword(password1, password2)
{
    if(password1 !== password2)
        return {result: false, msg: "Password does not match!"}
    return {result: true, msg: "Password matched!"}
}

function convertPixelSizeToNumber (str)
{
    if(str.length < 3)
    {
        console.log("Invalid str");
        return 0;
    }
    let formattedStr = str.substring(0, str.length-2);
    return Number(formattedStr);
}

function convertSecondsToTime (second)
{
    if(second < 60)
    {
        return `00:${second.toString().padStart(2, '0')}`
    }
    else
    {
        const minutes = Math.trunc(second / 60);
        const leftSecond = second % 60;
        return `${minutes.toString().padStart(2, '0')}:${leftSecond.toString().padStart(2, '0')}`
    }
}

const getPartOrderJSONArr = (parts) => {
    if (parts) {
        const arr = [];
        parts.forEach((part) => arr.push(part.partOrder));
        return JSON.stringify(arr);
    }
    return "";
};

const generateSQLTimestamp = (timeStr) => {
    if (timeStr) {
        return timeStr
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
    }
    return "";
};

const getDurationStrFromSecond =  (second) => {
    const minute = Math.trunc(second / 60);
    const hour = Math.trunc(minute / 60);
    const sec = second % 60;
    return `${hour.toString().padStart(1, '0')}:${minute.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

const getFormatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()} ${date.getHours().toString().padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}:${date.getSeconds().toString().padStart(2, 0)}`;
}

const getPartStr = (partJSON) => 
{
    let partArr = JSON.parse(partJSON);
    return partArr.join(", ");
}

export { handleInput, checkValidRegisterPassword, checkValidRegisterUserName, checkTheSecondPassword, convertPixelSizeToNumber, convertSecondsToTime, generateSQLTimestamp
    , getPartOrderJSONArr, getPartStr, getFormatDate, getDurationStrFromSecond
 };
