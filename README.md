JavaScript Testing Framework
============================

For JavaScript using JavaScript; built for Google Chrome.

Basic Components
----------------

### Set-up

HTML file:

<html data-frameworkBaseURL="../src/">
<head>
    <title>JavaScript Testing Framework Tests</title>
    <script src="../src/utils.js" type="text/javascript"></script>
    <script src="../src/framework.js" type="text/javascript"></script>
    <script src="file_containing_my_tests.js" type="text/javascript"></script>
</head>
<body>
</body>
</html>

Where ```data-frameworkBaseURL``` is the path to the framework src directory.

### Framework Overview

* A TestRunner accepts a TestFixture
* The TestRunner is run, which accepts a TestHandler
* The TestHandler receives all events (and associated data) of the test run

```TestRunner( TestFixture ).run( TestHandler( Config ) ) ```

### TestFixture

```
new JTF.TestFixture('Test fixture description goes here', {

  'Test name goes here': function () {
		// assertions, etc go here
	},

	'Next test name goes here': function () {
		// assertions, etc go here
	}
	
}

Complete Examples
-------------

### Simplest HTML output

```
JTF.loadFramework(function () {
  JTF.loadHtmlResources(function () {

	var Assert = JTF.Assert;

		var testFixture = new JTF.TestFixture('My first test fixture', {
		
			'Pointless test should always pass': function () {
				Assert.false(false);
			}
			
		}

		var testHandler = new JTF.HTML.TestHandler()

		new JTF.TestRunner.Single(testFixture).run(testHandler);

	});
});
```

### Simplest console output

```
JTF.loadFramework(function () {
	JTF.loadConsoleResources(function () {
	
		var Assert = JTF.Assert;

		var testFixture = new JTF.TestFixture('My first test fixture', {
		
			'Pointless test should always pass': function () {
				Assert.true(true);
			}
			
		}

		var testHandler = new JTF.Console.TestHandler()

		new JTF.TestRunner.Single(testFixture).run(testHandler);
	
	});
});
```