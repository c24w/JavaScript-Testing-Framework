(function (JTF) {

	var frameworkBaseURL = document.documentElement.getAttribute('data-frameworkBaseURL');

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
		if (namespaceNodes[0] !== 'JTF')
			addNamespaceNode(window, 'JTF');
		var currentNode = namespaceNodes[0] === 'JTF' ? window : window.JTF;
		for (var i = 0 ; i < namespaceNodes.length; i++)
			currentNode = addNamespaceNode(currentNode, namespaceNodes[i]);
		callback(currentNode);
	}

	//JTF.addNamespace = function (parent, child) {
	//	return parent[child] = parent[child] || {};
	//}

	JTF.namespaceAtRoot = function (callback) {
		callback(window.JTF);
	}

	function addNamespaceNode(parent, child) {
		return parent[child] = parent[child] || {};
	}

	JTF.reload = function () {
		window.location.reload();
	}

	JTF.loadFramework = function (callback) {
		JTF.loadResource('resources.js', function () {
			JTF.loadResources('TestFixture.js', 'Assert.js', 'TestRunner.js', 'TestCase.js', callback);
		});
	}

	JTF.loadHtmlResources = function (callback) {
		JTF.loadResources('HTML.js', 'HTML-tools.js', 'style.css', callback);
	}

	JTF.loadConsoleResources = function (callback) {
		JTF.loadResources('Console.js', callback);
	}

	JTF.loadResources = function (/* resource.css, resource.js, ..., ..., callback */) {
		var loadCount = 0;
		var lastArg = arguments[arguments.length - 1];
		var callback = lastArg instanceof Function ? lastArg : undefined;
		var resourceCount = arguments.length - (callback ? 1 : 0);
		for (var i = 0; i < resourceCount; i++) {
			JTF.loadResource(arguments[i], function () {
				if (++loadCount === resourceCount && callback !== null) {
					callback();
				}
			});
		}
	}

	JTF.loadResource = function (file, callback) {
		if (isLoaded(file)) {
			if (typeof callback !== 'undefined')
				callback();
			return;
		}

		if (isLoading(file)) {
			setTimeout(function () { JTF.loadResource(file, callback) }, 50);
			return;
		}

		setLoading(file);
		if (isScript(file))
			loadScript(file, callback);
		else if (isStylesheet(file))
			loadStylesheet(file, callback);
		else
			resourceErrorMsg('Cannot handle resource type \'' + file.substring(file.lastIndexOf('.')) + '\' (' + file + ')');
	}

	function loadScript(file, callback) {
		var script = document.createElement('script');
		script.src = addCacheBuster(frameworkBaseURL + file);
		script.type = 'text/javascript';
		script.onerror = JTF.resourceErrorFromEvent;
		document.head.appendChild(script);
		script.onload = function () {
			setLoaded(file);
			if (typeof callback !== 'undefined')
				callback();
		};
	}

	function loadStylesheet(file, callback) {
		var stylesheet = document.createElement('link');
		stylesheet.rel = 'stylesheet';
		stylesheet.href = addCacheBuster(frameworkBaseURL + file);
		stylesheet.onerror = JTF.resourceErrorFromEvent;
		document.head.appendChild(stylesheet);
		stylesheet.onload = function () {
			setLoaded(file);
			if (typeof (callback) !== 'undefined')
				callback();
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
		'framework.js': fileStatuses.LOADED,
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