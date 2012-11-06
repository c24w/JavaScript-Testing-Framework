function consoleTestWriter(writePasses, testPassed, testName, msg) {
	loadResource('formatting.js', function () {
		if (!testPassed)
			console.error(failIndent + testName + formatMsg(msg));
		else if (writePasses)
			console.log(normalIndent + testName);
	});
}