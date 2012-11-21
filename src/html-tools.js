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
		var d = ctx.makeEl('div');
		if (className) d.className = className;
		return d;
	}

	ctx.makeEl = function (type) {
		return document.createElement(type);
	}

})(window.JTF.html = window.JTF.html || {});