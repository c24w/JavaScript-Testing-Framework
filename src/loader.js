window.addEventListener('DOMContentLoaded', function () {
	loadResource('framework.js');
});

var loaded = new Array();
loaded[0] = 'loader.js';

function loadResource(file) {
	if (loaded.indexOf(file) == -1) {
		if (file.endsWith('.js'))
			loadScript(file);
		else if (file.endsWith('.css'))
			loadStylesheet(file);
		loaded[loaded.length] = file;
	}
}

function loadScript(file) {
	var script = document.createElement('script');
	script.src = frameworkBaseURL + file;
	document.head.appendChild(script);
}

function loadStylesheet(file) {
	var stylesheet = document.createElement('link');
	stylesheet.rel = 'stylesheet';
	stylesheet.href = frameworkBaseURL + file;
	document.head.appendChild(stylesheet);
}