(function (ctx) {

	ctx.addClassToMany = function (selector, newClass) {
		var selection = document.querySelectorAll(selector);
		for (var i = 0; i < selection.length; i++)
			ctx.addClassTo(selection[i], newClass);
	}

	ctx.addClassTo = function (element, newClass) {
		if (element.className.indexOf(newClass) === -1)
			element.className += ' ' + newClass;
	}

	ctx.removeClassFromMany = function (selector, removeClass) {
		var selection = document.querySelectorAll(selector);
		for (var i = 0; i < selection.length; i++)
			ctx.removeClassFrom(selection[i], removeClass);
	}

	ctx.removeClassFrom = function (element, removeClass) {
		element.className = element.className.replace(new RegExp('\\b' + removeClass + '\\b'), '');
	}

	ctx.makeOnClickButton = function (label, func) {
		var button = ctx.makeEl('button');
		button.innerHTML = label;
		button.onclick = func;
		return button;
	}

	ctx.makeDiv = function (className) {
		return ctx.makeEl('div', className);
	}

	ctx.makeEl = function (type, className) {
		var e = document.createElement(type);
		e.className = className || '';
		return e;
	}

	ctx.addTextTo = function (element, text) {
		element.appendChild(document.createTextNode(text));
	}

	ctx.addTo = function (parent, el) {
		parent.appendChild(el);
	}

})(window.JTF.html = window.JTF.html || {});