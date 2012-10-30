window.addEventListener('DOMContentLoaded', function () {
	requires('framework/framework.js');
	requires('framework/framework.js');
});

var loaded = new Array();
loaded[0] = 'framework/loader.js';

function requires(src) {
	if (loaded.indexOf(src) == -1) {
		loaded[loaded.length] = src;
		var script = document.createElement('script');
		script.src = src;
		document.head.appendChild(script);
	}
}