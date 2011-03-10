var sys = require('sys'),
	Canvas = require('canvas'),
	Image = Canvas.Image;

var img = new Image();
img.onload = function() {
	renderImage(img);
}
img.src = __dirname + '/arnd.jpg';


function renderImage(image, options) {
	var brightnessMappings = {
		defaultScale : ' .,:;i1tfLCG08@'.split(''),
	//	variant2 : '@%#*+=-:. '.reverse().split(''),
	//	variant3 : '#¥¥®®ØØ$$ø0oo°++=-,.    '.reverse().split(''),
	//	variant4 : '#WMBRXVYIti+=;:,. '.reverse().split(''),
		wide : '@@@@@@@######MMMBBHHHAAAA&&GGhh9933XXX222255SSSiiiissssrrrrrrr;;;;;;;;:::::::,,,,,,,........        '.split(''),
		x:         '    ...,,:;---===+++xxxXX##@@'.split('')
	//	bits : ' #'.split(''),
	//	binary : ' 10'.split('')
	};
	
	options = options || {};
	
	// factor by which pixels are mapped to a number of characters
	var resolution = options.resolution || 0.05;
	var characters = brightnessMappings.wide;
	var imageWidth = image.width, imageHeight = image.height,
			width = Math.round(imageWidth * resolution),
			height = Math.round(imageHeight * resolution);

	var canvas = new Canvas(width, height);
	var context = canvas.getContext('2d');

	context.drawImage(image, 0, 0, width, height);

	var data = context.getImageData(0, 0, width, height).data;
	
	var chars = "";
	var offset, // offset in imageData array
		red, green, blue, alpha; // rgba

	function getCharacterReplacement(red, green, blue, alpha) {
		var chars='', charScale=characters, thisChar=' ', characterPosition=0; brightness=0;
		
		if(alpha/255 < 0.3) {
			return ' ';
		}
		
		brightness = (0.3*red + 0.59*green + 0.11*blue) * (alpha/255) / 255;
		characterPosition = (charScale.length-1) - Math.round(brightness * (charScale.length-1));

		return charScale[characterPosition];
	}

	for (var y=0; y<height; y+=2) { // process every 2nd row
		for (var x=0; x<width; x++) {
			if(x%3 === 0) { continue; } // account for the mismatch in scale of a char, here we assume 3:2 ratio and correct to 2:2
			offset = (y*width + x) * 4;
			red = data[offset];
			green = data[offset + 1];
			blue = data[offset + 2];

			// FIXME: if we load an opaque image, do we need to map the alpha-channel? or is it always 255?
			// TODO: make sure this is 255 for opaque pixels
			alpha = data[offset + 3];
			
			chars += getCharacterReplacement(red, green, blue, alpha);
		}
		chars += '\n';
	}

	sys.puts(chars);
}

