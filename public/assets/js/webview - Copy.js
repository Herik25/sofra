function sendDataToAndroid(name) {

	JSInterface.login_success(name);
}
function sendDataToIos(name) {
	try {
		webkit.messageHandlers.callback.postMessage(name);
	} catch (err) {
		console.log("false")
	}
}

