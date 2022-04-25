function format_date(date) {
     
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const minutes = date.getMinutes();

    let hour;
    if (date.getHours() > 12) {
        hour = Math.floor(date.getHours() / 2);
    } else {
        hour = date.getHours();
    }
    if (hour == 0) {
        hour = 12;
    }

    return `${month}/${day}/${year} at ${hour}:${minutes}`
}

module.exports = format_date