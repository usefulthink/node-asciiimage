var util = require('util'),
	Canvas = require('canvas');

var brightnessMappings = {
	defaultScale : ' .,:;i1tfLCG08@'.split(''),
	//variant : '@%#*+=-:. '.split(''),
	//variant3 : '#¥¥®®ØØ$$ø0oo°++=-,.    '.split(''),
	//variant4 : '#WMBRXVYIti+=;:,. '.split(''),
	wideInv : '@@@@@@@######MMMBBHHHAAAA&&GGhh9933XXX222255SSSiiiissssrrrrrrr;;;;;;;;:::::::,,,,,,,........        '.split(''),
	wide : '        ........,,,,,,,:::::::;;;;;;;;rrrrrrrssssiiiiSSS552222XXX3399hhGG&&AAAAHHHBBMMM######@@@@@@@'.split(''),
	//x:         '    ...,,:;---===+++xxxXX##@@'.split(''),
	//bits : ' #'.split(''),
	//binary : ' 10'.split('')
};

var currentBrightnessMapping = brightnessMappings.wide;

function renderImage(image, callback, options) {
	//util.debug("render called...");

	options = options || {};
	// factor by which pixels are mapped to a number of characters
	var resolution = options.resolution || 0.05;
	var imageWidth = image.width, imageHeight = image.height,
			width = Math.round(imageWidth * resolution),
			height = Math.round(imageHeight * resolution);

	if(options.brightnessMapping) {
		if(options.brightnessMapping instanceof Array) {
			currentBrightnessMapping = options.brightnessMapping;
		} else if(options.brightnessMapping in brightnessMappings) {
			currentBrightnessMapping = brightnessMappings[options.brightnessMapping];
		}
	}

	// TODO: might make sense to externalize this into a node-worker
	var canvas = new Canvas(width, height);
	var context = canvas.getContext('2d');

	// TODO: it might make sense to do some precalculations on the image to reduce the colorspace
	context.drawImage(image, 0, 0, width, height);

	var data = context.getImageData(0, 0, width, height).data;
	callback(processImageData(data, width, height));
}

function processImageData(data, width, height) {
	function getCharacterReplacement(r,g,b,a) {
		var charScale = currentBrightnessMapping;

		if(a/255 < 0.3) { return ' '; }

		var brightness = (0.3*r + 0.59*g + 0.11*b) * (a/255) / 255;
		var characterPosition = (charScale.length-1) - Math.round(brightness * (charScale.length-1));

		return charScale[characterPosition];
	}

	var chars = "";
	for (var y=0; y<height; y+=2) { // process every 2nd row
		for (var x=0; x<width; x++) {
			var o = (y*width + x) * 4;
			chars += getCharacterReplacement(data[o], data[o+1], data[o+2], data[o+3]);
		}
		chars += '\n';
	}

	return chars;
}


exports.asciiimage = {
	convertImage : function(filename, callback, options) {
		//util.debug("convertImage called - filename: " + filename + ", callback: " + callback + ", options: " + options);
		var img = new Canvas.Image();
		img.onload = function() {
			//util.debug("image loaded: " + util.inspect(img));
			renderImage(img, function(s) {
				//util.debug("render complete...");
				callback(s);
			}, options);
		};

		img.src = filename;
	}
};
