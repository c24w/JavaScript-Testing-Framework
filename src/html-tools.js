JTF.namespace('HTML', function (HTML) {

	HTML.addClassToMany = function (selector, newClass) {
		var selection = document.querySelectorAll(selector);
		for (var i = 0; i < selection.length; i++)
			HTML.addClassTo(selection[i], newClass);
	}

	HTML.addClassTo = function (element, newClass) {
		if (element.className.indexOf(newClass) === -1)
			element.className += ' ' + newClass;
	}

	HTML.removeClassFromMany = function (selector, removeClass) {
		var selection = document.querySelectorAll(selector);
		for (var i = 0; i < selection.length; i++)
			HTML.removeClassFrom(selection[i], removeClass);
	}

	HTML.removeClassFrom = function (element, removeClass) {
		element.className = element.className.replace(new RegExp('\\b' + removeClass + '\\b'), '');
	}

	HTML.makeOnClickButton = function (label, func) {
		var button = HTML.makeEl('button');
		button.innerHTML = label;
		button.onclick = func;
		return button;
	}

	HTML.makeDiv = function (className) {
		return HTML.makeEl('div', className);
	}

	HTML.makeEl = function (type, className) {
		var e = document.createElement(type);
		if (className) e.className = className;
		return e;
	}

	HTML.addTextTo = function (element, text) {
		element.appendChild(document.createTextNode(text));
	}

	HTML.addTo = function (parent, el) {
		parent.appendChild(el);
	}

});