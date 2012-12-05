var string = String.prototype;

string.format = string.format || function () {
	var s = this;
	for (var i = 0; i < arguments.length; i++) {
		var reg = new RegExp("\\{" + i + "\\}", "gm");
		s = s.replace(reg, arguments[i]);
	}
	return s;
}

string.isWhitespace = string.isWhitespace || function () {
	return /^\s*$/.test(this);
}

string.endsWith = string.endsWith || function (suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
}