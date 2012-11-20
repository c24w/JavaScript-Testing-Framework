function somethingWentWrong(msg) {
	alert('Something went wrong' + (msg ? '\n\n' + msg : ''))
}

function scriptResourceError(event) {
	alert('Script didn\'t load properly:\n\n' + event.srcElement.attributes.src.value);
}

function stylesheetResourceError(event) {
	alert('Stylesheet didn\'t load properly:\n\n' + event.srcElement.attributes.href.value);
}

window.onerror = somethingWentWrong;

(function (ctx) {
	/*
	ctx.makeNamespace = function (hierarchyString) {
		var parts = hierarchyString.split('.');
		var partsRootNode = window[parts[0]];
		var currentNode = window;

		if (partsRootNode) {
			currentNode = partsRootNode;
			parts = parts.slice(1);
		}

		for (var i = 0; i < parts.length; i++) {
			currentNode[parts[i]] = currentNode[parts[i]];
			var nextNode = currentNode[parts[i]];
			nextNode = nextNode || {};
			currentNode = nextNode;
			if (i === parts.length - 1)
				return currentNode;
		}
	}*/

	ctx.loadFramework = function (loadCallback) {
		ctx.loadResources('TestFixture.js', 'Assert.js', 'TestRunner.js', loadCallback);
	}

	ctx.loadHtmlResources = function (loadCallback) {
		ctx.loadResources('html.js', 'style.css', loadCallback);
	}

	ctx.loadConsoleResources = function (loadCallback) {
		ctx.loadResources('console.js', loadCallback);
	}

	ctx.loadResources = function (/* args usage: (resource.css, resource.js, ..., ..., batchResourceLoadCallback) */) {
		var loadCount = 0;
		var resourceCount = arguments.length - 1;
		var batchLoadCallback = arguments[arguments.length - 1];

		for (var i = 0; i < resourceCount; i++) {
			ctx.loadResource(arguments[i], function () {
				if (++loadCount === resourceCount && typeof batchLoadCallback !== 'undefined') {
					batchLoadCallback();
				}
			});
		}
	}

	ctx.loadResource = function (file, loadCallback) {
		if (isLoaded(file)) {
			if (typeof loadCallback !== 'undefined')
				loadCallback();
			return;
		}

		if (isLoading(file)) {
			setTimeout(function () { loadResource(file, loadCallback) }, 50);
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
		script.onerror = scriptResourceError;
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
		stylesheet.onerror = stylesheetResourceError;
		document.head.appendChild(stylesheet);
		stylesheet.onload = function () {
			setLoaded(file);
			if (typeof (loadCallback) !== 'undefined')
				loadCallback();
		};
	}

	var fileStatuses = {
		LOADING: 0,
		LOADED: 1
	}

	var fileStatus = {
		'loader.js': fileStatuses.LOADED,
		'utils.js': fileStatuses.LOADED
	}

	function isLoaded(file) {
		return fileStatus[file] === fileStatuses.LOADED;
	}

	function isLoading(file) {
		return fileStatus[file] === fileStatuses.LOADING;
	}

	function setLoaded(file) {
		fileStatus[file] = fileStatuses.LOADED;
	}

	function setLoading(file) {
		fileStatus[file] = fileStatuses.LOADING;
	}

	function isScript(file) {
		return file.endsWith('.js');
	}

	function isStylesheet(file) {
		return file.endsWith('.css');
	}

})(window.JTF = window.JTF || {});