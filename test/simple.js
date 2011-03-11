var util=require('util'), asciiimage = require('../lib/asciiimage').asciiimage;

var t0 = new Date();
var t1 = null;
asciiimage.convertImage(
		__dirname + '/images/logo.png',
		function(s) { t1=new Date(); util.puts(s); },
		{ resolution: 0.3 }
	);

util.puts(t0);
util.puts(t1);
util.puts(t1-t0);
