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
            workerReg.showNotification("Success (sw)", options);
        });
    }
};

function askForNotificationPermission() {
    Notification.requestPermission(function (result) {
        if (result !== "granted") {
            console.log("No notification permission granted!");
        } else {
            displayNotification();
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
