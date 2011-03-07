
var scales = {
	defaultScale : ' .,:;i1tfLCG08@'.split(''),
	variant2 : '@%#*+=-:. '.reverse().split(''),
	variant3 : '#¥¥®®ØØ$$ø0oo°++=-,.    '.reverse().split(''),
	variant4 : '#WMBRXVYIti+=;:,. '.reverse().split(''),
	'ultra-wide' : ('MMMMMMM@@@@@@@WWWWWWWWWBBBBBBBB000000008888888ZZZZZZZZZaZaaaaaa2222222SSS' +
			'SSSSXXXXXXXXXXX7777777rrrrrrr;;;;;;;;iiiiiiiii:::::::,:,,,,,,.........       ').reverse().split(''),
	wide : '@@@@@@@######MMMBBHHHAAAA&&GGhh9933XXX222255SSSiiiissssrrrrrrr;;;;;;;;:::::::,,,,,,,........        '.reverse().split(''),
	hatching : '##XXxxx+++===---;;,,...    '.reverse().split(''),
	bits : '# '.reverse().split(''),
	binary : '01 '.reverse().split(''),
	greyscale : '"█▓▒░ '.reverse().split(''),

    color : ' CGO08@'.split('')
};

function renderImage(options) {
	options = options || {};
	
	// settings : prefer options over attributes over defualts
	var scale = options.scale || 1; 
	var isColor = options.color || false;

	// FIXME: we should be able to retrieve this from the image-file
	var isAlpha = options.alpha || false;
	var isBlock = options.block || false;
	var isInverted = options.invert || false;
	// factor by which pixels are mapped to a number of characters
	var resolution = options.resolution || 0.5;
	var characters = options.characters || (isColor ? scales.color : scales.defaultScale);
	
	// FIXME: rename
	switch (resolution) {
		case "low": resolution = 0.25; break;
		case "medium": resolution = 0.5; break;
		case "high": resolution = 1; break;
	}
	

	// FIXME
	//  - retrieve those values from somwhere (jhead or something)!
	//  - find out how node-canvas needs those values
	var imageFile, imageWidth, imageHeight;

	//setup our resources
	var width = Math.round(imageWidth * resolution);
	var height = Math.round(imageHeight * resolution);

	// FIXME: implement gimmeTheCanvas using @tjholowaychucks node-canvas-foo
	var canvas = gimmeTheCanvas(width, height);
	var context = canvas.getContext('2d');

	// FIXME: since characters don't have an aspect-ratio of 1, the image should be stretched
	//   accordingly when drawing to the canvas (this should produce much better results...)
	context.drawImage(imageFile, 0, 0, width, height);

	var data = context.getImageData(0, 0, width, height).data;
	
	// yeah, we'll get rid of you later...
	var strChars = "<span>";
	var offset, // offset in imageData array
		red, green, blue, alpha; // rgba

	function getCharacterReplacement(red, green, blue, alpha) {
		var strChars='', charScale=characters, thisChar=' ', characterPosition=0; brightness=0;
		
		if(alpha !== 0) {
			if(isAlpha) {
				brightness = (0.3*red + 0.59*green + 0.11*blue) * (alpha/255) / 255;
			} else {
				brightness = (0.3*red + 0.59*green + 0.11*blue) / 255;
			}
			characterPosition = (charScale.length-1) - Math.round(brightness * (charScale.length-1));
		}

		if(isInverted) {
			characterPosition = (characters.length-1) - characterPosition;
		}
		
		thisChar = characters[characterPosition];
		
		if (thisChar === ' ') {
			thisChar = '&nbsp;';
		}
		
		if (isColor) {
			strChars += '<span style="'
				+ 'color:rgb('+red+','+green+','+blue+');'
				+ (isBlock ? 'background-color:rgb('+red+','+green+','+iBlue+');' : '')
				+ (isAlpha ? 'opacity:' + (alpha/255) + ';' : '')
				+ '">' + thisChar + '</span>';
		} else {
			if(isAlpha) {
				if(alpha/255 < 0.3) {
					strChars += ' ';
				} else {
					strChars += thisChar;
				}
			} else {
				strChars += thisChar;
			}
		}
		
		return strChars;
	}

	for (var y=0; y<height; y+=2) {
		for (var x=0; x<width; x++) {
			if(x%3 === 0) { continue; } // account for the mismatch in scale of a char, here we assume 3:2 ratio and correct to 2:2
			offset = (y*width + x) * 4;
			red = data[offset];
			green = data[offset + 1];
			blue = data[offset + 2];
			alpha = data[offset + 3];
			
			strChars += getCharacterReplacement(red, green, blue, alpha);
		}
		strChars += '</span><br/><span>';
	}
}

