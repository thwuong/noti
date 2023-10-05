function urlBase64ToUint8Array(base64String) {
    var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

    var rawData = window.atob(base64);

    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
if ("serviceWorker" in navigator) {
    console.log("Registering service worker");

    run().catch((error) => console.error(error));
}

async function run() {
    console.log("Registering service worker");
    const registration = await navigator.serviceWorker.register("/worker.js", { scope: "/" });
    console.log("Registered service worker");
    const response = await fetch("./register");
    const publicVapidKey = await response.text();

    console.log("Registering push");
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        // The `urlBase64ToUint8Array()` function is the same as in
        // https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    console.log("Registered push");

    console.log("Sending push");
    await fetch("/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "content-type": "application/json",
        },
    });
    console.log("Sent push");
}
