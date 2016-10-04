// SWIG SWAG
init = function () {
	infocontainer = document.getElementById("info-container");
	placeholder = document.getElementById("placeholder");
	img2 = null;
	$make = document.getElementById('make');
	$clip = document.getElementById('clip');

	getWidthOfText = function (txt, fontname, fontsize) {
		// create dummy span
		e = $('<span id="testline"></span>');
		$('body').append(e);
		// set text
		jQuery(e).text(txt);
		// set font parameters
		jQuery(e).css({
			'font-size': fontsize
			, 'font-family': fontname
		});
		// get width
		var width = jQuery(e).width();
		// Optional:
		test = document.getElementById("testline");
		test.parentNode.removeChild(test);
		// Return width
		return width;
	};
	
	getWidthOfImages = function (html) {
		// create dummy span
		f = $('<div style="display: inline;" id="testlineimg"></div>');
		$('body').append(f);
		// set text
		var div = document.createElement('div');
		div.innerHTML = "'" + html + "'";
		var images = div.childNodes;
		
		$(f).append(images);
		// set font parameters
		// get width
		// Optional:
		testimg = document.getElementById("testlineimg");
		var imgwidth = (jQuery(f).width()) - 7;
		testimg.parentNode.removeChild(testimg);
		// Return width
		return imgwidth;
	};
	
	$('#artist').quickfit({
		max: 70
		, min: 45
		, truncate: false
	});
	$('#album').quickfit({
		max: 70
		, min: 45
		, truncate: false
	});
	$('#artistinput').on('input', function (e) {
		if (img2) {
			img2.parentNode.removeChild(img2);
		}
		img2 = null;
		infocontainer.style.display = 'block';
		artistvalue = $('#artistinput').val();
		document.getElementById('artist').innerHTML = artistvalue;
		artistlength = getWidthOfText(artistvalue, "Programme2", "70px");
		imageslength = getWidthOfImages(artistvalue);
		if (artistlength > 470) {
			newfontsize = (artistlength / (artistlength * (artistlength * 0.000033)));
			document.getElementById("artist").style.fontSize = newfontsize + "px";
		} else {
			document.getElementById("artist").style.fontSize = 70 + "px";
			document.getElementById("artist").style.width = "none";
		}
	});
	$('#albuminput').on('input', function (e) {
		if (img2) {
			img2.parentNode.removeChild(img2);
		}
		img2 = null;
		infocontainer.style.display = 'block';
		albumvalue = $('#albuminput').val();
		document.getElementById('album').innerHTML = albumvalue;
		albumlength = getWidthOfText(albumvalue, "Programme2", "70px");
		if (albumlength > 490) {
			document.getElementById("album").style.fontSize = (albumlength / (albumlength * (albumlength * 0.000033))) + "px";
		} else {
			document.getElementById("album").style.fontSize = 70 + "px";
		}
	});
	bind();

	function copyTextToClipboard(text) {
		var textArea = document.createElement("textarea");

		//
		// *** This styling is an extra step which is likely not required. ***
		//
		// Why is it here? To ensure:
		// 1. the element is able to have focus and selection.
		// 2. if element was to flash render it has minimal visual impact.
		// 3. less flakyness with selection and copying which **might** occur if
		//    the textarea element is not visible.
		//
		// The likelihood is the element won't even render, not even a flash,
		// so some of these are just precautions. However in IE the element
		// is visible whilst the popup box asking the user for permission for
		// the web page to copy to the clipboard.
		//

		// Place in top-left corner of screen regardless of scroll position.
		textArea.style.position = 'fixed';
		textArea.style.top = 0;
		textArea.style.left = 0;

		// Ensure it has a small width and height. Setting to 1px / 1em
		// doesn't work as this gives a negative w/h on some browsers.
		textArea.style.width = '2em';
		textArea.style.height = '2em';

		// We don't need padding, reducing the size if it does flash render.
		textArea.style.padding = 0;

		// Clean up any borders.
		textArea.style.border = 'none';
		textArea.style.outline = 'none';
		textArea.style.boxShadow = 'none';

		// Avoid flash of white box if rendered for any reason.
		textArea.style.background = 'transparent';


		textArea.value = text;

		document.body.appendChild(textArea);

		textArea.select();

		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			console.log('Copying text command was ' + msg);
		} catch (err) {
			console.log('Oops, unable to copy');
		}

		document.body.removeChild(textArea);
	}

	$clip.onclick = function () {
		copyTextToClipboard("http://www.pumpn.net/mag/plahoma/" + image2url);
	};
};

bind = function () {
	$make.onclick = function () {
		box = document.getElementById('placeholder');
		html2canvas(box, {
			onrendered: function (canvas) {
				document.body.appendChild(canvas);
				canvas.style.display = 'none';
				canvas.setAttribute("id", "canvas");
				canvastoconvert = document.getElementById('canvas');
				/*
				var img = document.createElement('img');
				img.src = canvastoconvert.toDataURL();
				imageurl = canvastoconvert.toDataURL();
				img.download = 'image.png';
				document.body.appendChild(img);
				*/
				$.post("save.php", {
					data: canvas.toDataURL("image/png")
				});

				$.post("save.php", {
					data: canvas.toDataURL("image/png")
				}, function (file) {
					if (img2) {
						img2.parentNode.removeChild(img2);
					}
					img2 = document.createElement('img');
					image2url = file;
					image2url = image2url.replace(/^"(.+(?="$))"$/, '$1');
					img2.src = image2url;
					img2.style.zIndex = 100;
					placeholder.appendChild(img2);
					infocontainer.style.display = 'none';
				});
			}
		});
	};
};
