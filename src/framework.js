(function setUpJTF(JTF) {

	var frameworkBaseURL = document.documentElement.getAttribute('data-frameworkBaseURL'),
		suppressErrorAlerts = true;

	JTF.setState = function setState(title, iconData) {
		var favicon;
		document.title = title.isWhitespace() ? document.title : title;
		var linkEls = document.head.getElementsByTagName('link');
		for (var i = 0; i < linkEls.length; i++) {
			if (linkEls[i].rel === 'shortcut icon') {
				favicon = linkEls[i];
				break;
			}
		}
		if (!favicon) {
			favicon = document.createElement('link');
			favicon.rel = 'shortcut icon';
		}
		favicon.type = iconData.substring(iconData.indexOf(':') + 1, iconData.indexOf(';'));
		favicon.href = iconData;
		document.head.appendChild(favicon);
	};

	JTF.setState('', '');

	function setErrorState() {
		JTF.loadResource('resources.js', function () {
			JTF.setState('E R R O R', JTF.resources.errorIcon);
		});
	}

	window.onerror = function (msg) {
		setErrorState();
		confirmReload(msg);
	};

	JTF.resourceErrorFromEvent = function (event) {
		var file = (event.srcElement.attributes.src || event.srcElement.attributes.href).value;
		resourceErrorMsg(file);
	};

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
	};

	JTF.namespaceAtRoot = function (callback) {
		callback(window.JTF);
	};

	function addNamespaceNode(parent, child) {
		return parent[child] = parent[child] || {};
	}

	JTF.reload = function () {
		window.location.reload();
	};

	JTF.loadSubmodule = function (name, callback) {
		JTF.loadResource(name + '/' + name + '.js', callback);
	};

	JTF.loadSubmodules = function () {
		var args = Array.prototype.slice.call(arguments, 0);
		args.forEach(function load_file_from_arg_excluding_callback(arg, i) {
			if (i < args.length - 1)
				args[i] = arg + '/' + arg + '.js';
		});
		JTF.loadResources.apply(null, args);
	};

	JTF.loadFramework = function (callback) {
		JTF.loadResource('resources.js', function () {
			JTF.loadSubmodule('Assert', function () {
				JTF.loadSubmodule('namespace', function () {
					JTF.Assert = c24w.Assert;
					JTF.loadResources('TestFixture.js', 'TestRunner.js', 'TestCase.js', callback);
				});
			});
		});
	};

	JTF.loadHtmlResources = function (callback) {
		JTF.loadResources('html.js', 'html-tools.js', 'style.css', callback);
	};

	JTF.loadConsoleResources = function loadConsoleResources(callback) {
		JTF.loadResources('console.js', callback);
	};

	JTF.loadResources = function loadResources(/* resource.css, resource.js, ..., ..., callback */) {
		var numberOfResources = arguments.length - 1,
			resourcesToLoad = numberOfResources,
			callback = arguments[numberOfResources];

		function handleResourceLoaded() {
			if (--resourcesToLoad === 0) callback();
		}

		for (var i = 0; i < numberOfResources; i++) {
			JTF.loadResource(arguments[i], handleResourceLoaded);
		}
	};

	JTF.loadResource = function loadResource(file, callback) {
		var fileExt;

		if (isLoaded(file)) {
			if (callback) callback();
			return;
		}

		if (isLoading(file)) {
			setTimeout(JTF.loadResource.bind(JTF, file, callback), 100);
		}

		setLoading(file);

		fileExt = file.substring(file.lastIndexOf('.'));

		switch (fileExt) {
			case '.js': return loadScript(file, callback);
			case '.css': return loadStylesheet(file, callback);
			default: resourceErrorMsg('Cannot handle resource type \'' + fileExt + '\' (' + file + ')');
		}
	};

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
	};

	var fileStatus = {
		'framework.js': fileStatuses.LOADED,
		'utils.js': fileStatuses.LOADED
	};

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

})(window.JTF = window.JTF || {});