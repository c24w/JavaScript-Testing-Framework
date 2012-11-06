function loadResources(/*resource.css, resource.js, ..., ..., batchResourceLoadCallback*/) {
	var loadCount = 0;
	var resourceCount = arguments.length - 1;
	var batchLoadCallback = arguments[arguments.length - 1];

	for (var i = 0; i < resourceCount; i++) {
		loadResource(arguments[i], function () {
			if (++loadCount === resourceCount && typeof batchLoadCallback !== 'undefined') {
				batchLoadCallback();
			}
		});
	}
}

var loading = new Array();
var loaded = new Array();
loaded[0] = 'loader.js';
loaded[1] = 'utils.js';

function loadResource(file, loadCallback) {
	if (isLoaded(file)) {
		if (typeof loadCallback !== 'undefined')
			loadCallback();
		return;
	}

	if (isLoading(file)) {
		setTimeout(function () { loadResource(file, loadCallback) }, 500);
		return;
	}

	setLoading(file);
	if (isScript(file))
		loadScript(file, loadCallback);
	else if (isStylesheet(file))
		loadStylesheet(file, loadCallback);
}

function loadScript(file, loadCallback) {
	var script = document.createElement('script');
	script.src = frameworkBaseURL + file;
	script.type = 'text/javascript';
	document.head.appendChild(script);
	script.onload = function () {
		setLoaded(file);
		loading[loading.indexOf(file)] == null;
		if (typeof loadCallback !== 'undefined')
			loadCallback();
	};
}

function loadStylesheet(file, loadCallback) {
	var stylesheet = document.createElement('link');
	stylesheet.rel = 'stylesheet';
	stylesheet.href = frameworkBaseURL + file;
	document.head.appendChild(stylesheet);
	stylesheet.onload = function () {
		setLoaded(file);
		if (typeof (loadCallback) !== 'undefined')
			loadCallback();
	};
}

function isLoaded(file) {
	return loaded.indexOf(file) !== -1;
}

function isLoading(file) {
	return loading.indexOf(file) !== -1;
}

function setLoading(file) {
	loading[loaded.length] = file;
}

function setLoaded(file) {
	loaded[loaded.length] = file;
	loading.splice(loading.indexOf(file), 1);
}

function isScript(file) {
	return file.endsWith('.js');
}

function isStylesheet(file) {
	return file.endsWith('.css');
}