(function (NS) {

	NS.add = function (baseNode, namespaceString, callback) {
		if (typeof baseNode === 'string') {
			callback = namespaceString;
			namespaceString = baseNode;
			baseNode = window;
		}
		var nodes = namespaceString.split('.');
		var currentNode = baseNode;

		nodes.forEach(function (node) {
			currentNode = add(node).to(currentNode);
		});

		if (callback) callback(currentNode);
	};

	function add(newNode) { return new NodeAdder(newNode); }

	function NodeAdder(newNode) {
		this.to = function (existingNode) {
			return existingNode[newNode] = existingNode[newNode] || {};
		};
	}

})(window.NS = window.NS || {});