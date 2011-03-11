#!/bin/env node

(function(filename) {
	var util=require('util'), fs=require('fs'), asciiimage=require('../lib/asciiimage').asciiimage;
	
	if(!filename) {
		util.puts('Usage: asciiimage IMAGEFILE');
		process.exit(1);
	}
	
	try {
		filename=fs.realpathSync(filename);
	} catch(e) {
		util.puts(e);
		process.exit(1);
	}

	asciiimage.convertImage(
			filename,
			function(s) { util.puts(s); },
			{ resolution: 0.3 }
		);
})(process.ARGV[2]);
