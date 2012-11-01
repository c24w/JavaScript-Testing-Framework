requires('assertions.js');

window.addEventListener('load', function () {

	new autoRunTestFixture('Dumb Tests', {

		'Test should pass': function () {
			assert(true);
		},

		'Test should fail': function () {
			assert(false);
		},

		'Test should fail also': function () {
			assert(false, 'because I said so');
		},

		
	});

});