const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const getFormatDate = (dateStr) => {
    if (dateStr) {
        const date = new Date(dateStr);
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }
    return "null date";
};

const getFormatDateTime = (dateStr) => {
    if (dateStr) {
        const date = new Date(dateStr);
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()} ${date
            .getHours()
            .toString()
            .padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}:${date
            .getSeconds()
            .toString()
            .padStart(2, 0)}`;
    }
    return "null datetime";
};

export { monthNames, getFormatDateTime, getFormatDate };
