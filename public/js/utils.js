
/** This function return the params of the query URL
 * @return Object 
*/
export function getUrlParams() { 
    var urlParams = window.location.search.substring(1).split('&');
    var params = urlParams.map((urlParam) => {
        var splitUrl = urlParam.split('=');
        var param = {
            name: splitUrl[0],
            value: splitUrl.length > 1 ? splitUrl[1] : null
        };
        return param;
    });
    return params; // Returns a dictionery with name and value
}

export function findParamByName(params, name) { // Get the params array and param by name
    return params.find(param => param.name === name);
}

/** Gets timestamp and return string of the date by format (dd/mm)
 * @param timeStamp - timestamp (number)
 * @return string 
*/
export function getDateString(timeStamp) {
    var d = new Date(timeStamp);
    // Day of the month
    var mon = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    // Month 
    var monDay = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);

    var dateString = mon + '/' + monDay; // day/month
    return dateString;
}

/** Gets timestamp and return string of the day 
 * @param timeStamp - timestamp (number)
 * @return string
*/
export function getDayString(timeStamp) {
    var daysStrings = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var d = new Date(timeStamp);
    return daysStrings[d.getDay()]
}

// Get string of phone number and return sting by the format xx-xxx-xxxx or xxx-xxx-xxxx
export function formatPhoneNumber(phoneNumber) {
    var phoneFormat;

    if (phoneNumber.length === 10) {
        phoneFormat = phoneNumber.substring(0, 3) + "-" + phoneNumber.substring(3, 6) + "-" + phoneNumber.substring(6, 11)
    } else {
        phoneFormat = phoneNumber.substring(0, 2) + "-" + phoneNumber.substring(2, 5) + "-" + phoneNumber.substring(5, 10)
    }
    return phoneFormat;
}

// Get ID from URL (https://www.example.com/1215465654)
export function getUrlIdParam() {
    var { pathname } = window.location;
    var id = pathname.substring(pathname.lastIndexOf('/') + 1);
    return id;
}
