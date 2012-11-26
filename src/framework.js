(function (JTF) {

	var suppressErrorAlerts = true;

	JTF.setState = function (title, iconData) {
		var favicon;
		document.title = title;
		var linkEls = document.head.getElementsByTagName('link');
		for (var i = 0; i < linkEls.length; i++) {
			if (linkEls[i].rel === 'shortcut icon')
				favicon = linkEls[i];
		}
		if (!favicon) {
			favicon = document.createElement('link');
			favicon.rel = 'shortcut icon';
		}
		favicon.type = iconData.substring(iconData.indexOf(':') + 1, iconData.indexOf(';'));
		favicon.href = iconData;
		document.head.appendChild(favicon);
	}

	JTF.setState('', '');

	function setErrorState() {
		JTF.loadResource('resources.js', function () {
			JTF.setState('E R R O R', JTF.resources.errorIcon);
		});
	}

	window.onerror = function (msg) {
		setErrorState();
		confirmReload(msg);
	}

	JTF.resourceErrorFromEvent = function (event) {
		var file = (event.srcElement.attributes.src || event.srcElement.attributes.href).value
		resourceErrorMsg(file);
	}

	function resourceErrorMsg(msg) {
		setErrorState();
		confirmReload('Something went wrong' + (msg ? '\n\n' + msg : ''));
	}

	function confirmReload(msg) {
		if (!suppressErrorAlerts && confirm(msg + '\n\nClick OK to reload'))
			window.location.reload(true);
	}

	JTF.namespace = function (namespaceString, callback) {
		var namespaceNodes = namespaceString.split('.');
		var currentNode = addNamespaceNode(window.JTF, namespaceNodes[0]);
		for (var i = 1 ; i < namespaceNodes.length; i++)
			currentNode = addNamespaceNode(currentNode, namespaceNodes[i]);
		callback(currentNode);
	}

	JTF.namespaceAtRoot = function (callback) {
		callback(window.JTF);
	}

	function addNamespaceNode(parent, child) {
		return parent[child] = parent[child] || {};
	}

	JTF.reload = function () {
		window.location.reload();
	}

	JTF.loadFramework = function (loadCallback) {
		JTF.loadResource('resources.js', function () {
			JTF.loadResources('TestFixture.js', 'Assert.js', 'TestRunner.js', loadCallback);
		});
	}

	JTF.loadHtmlResources = function (loadCallback) {
		JTF.loadResources('HTML.js', 'HTML-tools.js', 'style.css', loadCallback);
	}

	JTF.loadConsoleResources = function (loadCallback) {
		JTF.loadResources('Console.js', loadCallback);
	}

	JTF.loadResources = function (/* args usage: (resource.css, resource.js, ..., ..., batchResourceLoadCallback) */) {
		var loadCount = 0;
		var resourceCount = arguments.length - 1;
		var batchLoadCallback = arguments[arguments.length - 1];

		for (var i = 0; i < resourceCount; i++) {
			JTF.loadResource(arguments[i], function () {
				if (++loadCount === resourceCount && typeof batchLoadCallback !== 'undefined') {
					batchLoadCallback();
				}
			});
		}
	}

	JTF.loadResource = function (file, loadCallback) {
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
		else
			resourceErrorMsg('Cannot handle resource type \'' + file.substring(file.lastIndexOf('.')) + '\' (' + file + ')');
	}

	function loadScript(file, loadCallback) {
		var script = document.createElement('script');
		script.src = addCacheBuster(frameworkBaseURL + file);
		script.type = 'text/javascript';
		script.onerror = JTF.resourceErrorFromEvent;
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
		stylesheet.onerror = JTF.resourceErrorFromEvent;
		document.head.appendChild(stylesheet);
		stylesheet.onload = function () {
			setLoaded(file);
			if (typeof (loadCallback) !== 'undefined')
				loadCallback();
		};
	}

	function addCacheBuster(url) {
		return url + '?cacheBuster=' + new Date().getTime();
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