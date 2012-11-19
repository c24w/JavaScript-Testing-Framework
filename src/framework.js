window.JTF = window.JTF || (new function () {

	this.loadFramework = function (loadCallback) {
		this.loadResources('TestFixture.js', 'Assert.js', 'TestRunner.js', loadCallback);
	}

	this.loadHtmlResources = function (loadCallback) {
		this.loadResources('HtmlTestHandler.js', 'style.css', loadCallback);
	}

	this.loadConsoleResources = function (loadCallback) {
		this.loadResources('ConsoleTestHandler.js', loadCallback);
	}

	this.loadResources = function (/* args usage: (resource.css, resource.js, ..., ..., batchResourceLoadCallback) */) {
		var loadCount = 0;
		var resourceCount = arguments.length - 1;
		var batchLoadCallback = arguments[arguments.length - 1];

		for (var i = 0; i < resourceCount; i++) {
			this.loadResource(arguments[i], function () {
				if (++loadCount === resourceCount && typeof batchLoadCallback !== 'undefined') {
					batchLoadCallback();
				}
			});
		}
	}

	this.loadResource = function (file, loadCallback) {
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

});