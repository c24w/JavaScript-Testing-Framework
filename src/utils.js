var StringProt = String.prototype;

StringProt.format = StringProt.format || function () {
	var s = this;
	for (var i = 0; i < arguments.length; i++) {
		var reg = new RegExp("\\{" + i + "\\}", "gm");
		s = s.replace(reg, arguments[i]);
	}
	return s;
}

StringProt.isWhitespace = StringProt.isWhitespace || function () {
	return /^\s*$/.test(this);
}

StringProt.endsWith = StringProt.endsWith || function (suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
}