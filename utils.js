String.prototype.format = function () {
	var s = this;
	for (var i = 0; i < arguments.length; i++) {
		var reg = new RegExp("\\{" + i + "\\}", "gm");
		s = s.replace(reg, arguments[i]);
	}
	return s;
}

function requires(src) {
	var script = document.createElement('script');
	script.src = src;
	document.head.appendChild(script);
}

String.prototype.isWhitespace = function () {
	console.log(this);
	return /^\s*$/.test(this);
}