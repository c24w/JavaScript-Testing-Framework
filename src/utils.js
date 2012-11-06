String.prototype.format = function () {
	var s = this;
	for (var i = 0; i < arguments.length; i++) {
		var reg = new RegExp("\\{" + i + "\\}", "gm");
		s = s.replace(reg, arguments[i]);
	}
	return s;
}

String.prototype.isWhitespace = function () {
	return /^\s*$/.test(this);
}

String.prototype.endsWith = function (suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
}

String.prototype.startsWith = function (prefix) {
	return this.indexOf(prefix) === 0;
}