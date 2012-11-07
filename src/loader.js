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

var resourceStatus = {
	'loader.js': 'loaded',
	'utils.js': 'loaded'
}

function isLoaded(file) {
	return resourceStatus[file] === 'loaded';
}

function isLoading(file) {
	return resourceStatus[file] === 'loading';
}

function setLoaded(file) {
	resourceStatus[file] = 'loaded';
}

function setLoading(file) {
	resourceStatus[file] = 'loading';
}

function isScript(file) {
	return file.endsWith('.js');
}

function isStylesheet(file) {
	return file.endsWith('.css');
}