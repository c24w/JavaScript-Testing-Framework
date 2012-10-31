var frameworkBaseURL = '../src/';

window.addEventListener('DOMContentLoaded', function () {
	requires('framework.js');
	loadStylesheet();
});

var loaded = new Array();
loaded[0] = 'loader.js';

function requires(src, onload) {
	var src = frameworkBaseURL + src;
	if (loaded.indexOf(src) == -1) {
		loaded[loaded.length] = src;
		var script = document.createElement('script');
		script.src = src;
		document.head.appendChild(script);
		script.onload = onload;
	}
}

function loadStylesheet() {
	var stylesheet = document.createElement('link');
	stylesheet.rel = 'stylesheet';
	stylesheet.href = frameworkBaseURL + 'style.css';
	document.head.appendChild(stylesheet);
}