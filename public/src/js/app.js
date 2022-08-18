var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll(
    ".enable-notifications"
);

if (!window.Promise) {
    window.Promise = Promise;
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/sw.js")
        .then(function () {
            console.log("Service worker registered!");
        })
        .catch(function (err) {
            console.log(err);
        });
}

window.addEventListener("beforeinstallprompt", function (event) {
    console.log("beforeinstallprompt fired");
    event.preventDefault();
    deferredPrompt = event;
    return false;
});

const displayNotification = () => {
    if ("serviceWorker" in navigator) {
        let options = {
            body: "Successfully registered.",
            actions: [
                {
                    action: "confirm",
                    title: "OK",
                    icon: "/src/images/icons/app-icon-48x48.png",
                },
            ],
        };
        navigator.serviceWorker.ready.then((workerReg) => {
            workerReg.showNotification("Success!", options);
        });
    }
};

const configurePushSub = () => {
    if (!("serviceWorker" in navigator)) {
        return;
    }

    let workerReg;
    navigator.serviceWorker.ready
        .then((result) => {
            workerReg = result;
            return workerReg.pushManager.getSubscription();
        })
        .then((subscription) => {
            if (subscription === null) {
                const vpk =
                    "BBPTcrgqLG1YF047ikrcASD4Gs2J58WtCE-d1Etr_yAZa_U6F3MwEmdZ8Dt5kBElEdak0FOKGhRU8qmKEBitdq4";
                const ui8 = urlBase64ToUint8Array(vpk);
                return workerReg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: ui8,
                });
            } else {
            }
        })
        .then((subscription) => {
            return fetch(vars.firebaseUrlSubscription, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(subscription),
            });
        })
        .then((result) => {
            if (result.ok) {
                displayNotification();
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

function askForNotificationPermission() {
    Notification.requestPermission(function (result) {
        if (result !== "granted") {
            console.log("No notification permission granted!");
        } else {
            configurePushSub();
        }
    });
}

if ("Notification" in window) {
    for (var i = 0; i < enableNotificationsButtons.length; i++) {
        enableNotificationsButtons[i].style.display = "inline-block";
        enableNotificationsButtons[i].addEventListener(
            "click",
            askForNotificationPermission
        );
    }
}
