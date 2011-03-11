#!/bin/env node

(function() {
	var
		util=require('util'),
		fs=require('fs'),
		optparse = require('optparse'),
		asciiimage=require('../lib/asciiimage').asciiimage;
	
	var filename = null, resolution = 0.5;
	
	var switches = [
		['-h', '--help', 'shows the help'],
		['-r', '--resolution NUMBER', 'resolution in characters per pixel (defults to 0.5)' ]
	];
	
	var parser = new optparse.OptionParser(switches);

	parser.banner = 'Usage: asciiimage [OPTIONS] FILENAME'
	parser.on('help', function() { util.puts(parser); process.exit(0); });
	parser.on('resolution', function(p, n) { resolution = n; });
	parser.on(2, function(arg) { filename=arg; });
	
	parser.parse(process.ARGV);

	if(!filename) {
		util.puts('Error: no filename given');
		util.puts(parser);
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
			{ resolution: resolution }
		);
})();
