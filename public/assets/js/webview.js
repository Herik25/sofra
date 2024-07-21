function sendDataToAndroid(name) {

	JSInterface.login_success(name);
}
function sendDataToIos(name) {

	window?.webkit?.messageHandlers.callback.postMessage(name);

	try {
		window?.webkit?.messageHandlers.callback.postMessage(name);
		console.log("true")
	} catch (err) {
		console.log("false")
	}
}