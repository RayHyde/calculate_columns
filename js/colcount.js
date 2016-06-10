$(document).ready(function () {
	var totalWidth, cols, gutters, gutterWidth, decimals, calculatedWidth, type, colWidth, colWidth$, newColWidth, newGutterWidth,
		$wrap = $('.wrap'),
		$form = $('form');
	
	var $pre = $('#code pre');
	var $pre2 = $('#code2 pre');
	
	function getVals() {
		totalWidth = parseInt($('#totalWidth').val());
		cols = parseInt($('#cols').val());
		gutters = cols - 1;
		gutterWidth = parseInt($('#gutterWidth').val());
		type = $('input[type=radio]:checked').val();
	}

	function clearAll() {
		$('.result').add($wrap.find('li')).remove();
		$wrap.find('.message').removeClass('show').html('');
	}

	function doAll() {
		clearAll();
		getVals();
		var lis = cols + gutters;

		// set all texts to px or % where applicable
		$('.type').html(type);

		if (type == 'px') {
			colWidth = parseInt(totalWidth - (gutters * gutterWidth)) / cols;
			colWidth$ = colWidth + '';
			if (colWidth$.indexOf(".") !== -1) {
				decimals = 1;
			} else {
				decimals = 0;
			}
		} else {
			colWidth = parseInt(100 - (gutters * gutterWidth)) / cols;
			colWidth$ = colWidth + '';
		}
		calculatedWidth = (cols * colWidth) + (gutters * gutterWidth);

		// set all block elements to wrapper width
		$('.setWidth').css('width', totalWidth);
//		$('.bottomDiv').css('margin-left', (totalWidth / 2)*-1);

		// build the table
		for (var i = 0; i < lis; i++) {
			$('.wrap ul').append('<li/>');
		}
		$wrap.find('li:nth-child(even)').addClass('gutter');
		$wrap.find('li:nth-child(2)').append('<div class="result">' + gutterWidth + type + '</div>');

		if (type == 'px') {
			$wrap.find('li').css('width', colWidth + 'px');
			$wrap.find('.gutter').css('width', gutterWidth + 'px');
		} else {
			$wrap.find('ul').css('width', '100%');
			$wrap.find('li').css('width', colWidth + '%');
			$wrap.find('.gutter').css('width', gutterWidth + '%');
		}

		$wrap.append('<div class="result">Calculated width: ' + calculatedWidth + type + '</div>');
		$wrap.find('li:first-child').append('<div class="result">' + colWidth + type + '</div>');
		if (decimals == 1) {
			$wrap.find('li:first-child .result').addClass('error');
			$wrap.find('.message').addClass('show').html('Your columns have widths with decimals. Better play around with the gutter width...');
		}
		$pre.text('.wrap {\n\twidth: '+totalWidth+'px;\n}\nul.columns {\n\tlist-style: none;\n\tmargin: 0 0 0 -'+gutterWidth+type+';\n\tpadding: 0;\n\twidth: '+colWidth+type+';\n}\nul.columns li {\n\tfloat: left;\n\tmargin: 0 0 0 '+gutterWidth+type+';\n\tpadding: 0;\n}' );
		
		$pre2.text('<div class="wrap">\n\t<ul class="columns">\n');
		for ( var i=0; i< cols;i++ ) {
			
			var ff = $pre2.text();
			ff +=  '\t\t<li></li>\n';
			$pre2.text(ff);
		}
		var ff = $pre2.text();
		ff +=  '\t</ul>\n</div>';
		$pre2.text(ff);
		
	}

	doAll();

	$('input[type=text]').on('change', function () {
		var ff = $(this).val();
		$(this).prev('input').val(ff);
		doAll();
		return false;
	});
	
	function copyToClipboard(text) {
		window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
	}

	$('pre').on('click', function() {
		var text = $(this).text();
//		copyToClipboard(text);
	});
	
	$('input[type=radio]').on('change', function () {
		//get the numbers of the curren situation...
		newGutterWidth = ($wrap.find('.gutter').width() / totalWidth) * 100;
		newColWidth = ($wrap.find('li').eq(0).width() / totalWidth) * 100;
		if (type == '%') {
			newGutterWidth = (newGutterWidth / 100) * totalWidth;
			newColWidth = (newColWidth / 100) * totalWidth;
		}
		doAll();
		//todo
		// ... and use them to convert to px or percentage
		if (type == '%') {
			$wrap.find('li').css('width', newColWidth + type);
			$wrap.find('.gutter').css('width', newGutterWidth + type);

			//round off to one decimal before showing the in the text
			newGutterWidth = (Math.ceil(newGutterWidth * 10) / 10).toFixed(1);
			newColWidth = (Math.ceil(newColWidth * 10) / 10).toFixed(1);
		} else {
			newGutterWidth = (Math.ceil(newGutterWidth * 10) / 10).toFixed();
			//			newColWidth = (Math.ceil( newColWidth * 10 ) / 10).toFixed();
			newColWidth = newColWidth + '';
			if (newColWidth.indexOf(".") !== -1) {
				decimals = 1;
			} else {
				decimals = 0;
			}
			if (decimals == 1) {
				$wrap.find('li:first-child .result').addClass('error');
				$wrap.find('.message').addClass('show').html('Your columns have widths with decimals. Better play around with the gutter width...');
			} else {
				$wrap.find('li:first-child .result').removeClass('error');
				$wrap.find('.message').remove();
			}
			$wrap.find('li').css('width', newColWidth + type);
			$wrap.find('.gutter').css('width', newGutterWidth + type);
		}
		$('#gutterWidth').val(newGutterWidth);
		$('.gutter .result').html(newGutterWidth + type);
		$wrap.find('li:first-child .result').html(newColWidth + type);

		return false;
	});

	function change(element, increment) {
    var $el = $(element),
        elValue = parseInt($el.val(), 10),
        incAmount = increment || 1, 
        newValue = elValue + incAmount;
 
    if ((newValue) > -1) {
        $el.val(newValue);
    }
	}

	$('#cols, #gutterWidth, #totalWidth').keydown(function (e) {
			var keyCode = e.keyCode || e.which,
					arrow = { left: 37, up: 38, right: 39, down: 40 };

			switch (keyCode) {
					case arrow.up:
							change(this, 1);
							break;
					case arrow.down:
							change(this, -1);
							break;
					case arrow.right:
							change(this, 1);
							break;
					case arrow.left:
							change(this, -1);
							break;
				default:
					return;
			}

			var ff = $(this).val();
			$(this).prev('input').val(ff);
			doAll();
			return false;
	});

});