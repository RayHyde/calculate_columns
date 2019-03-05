$(document).ready(function () {
    let decimals, colWidth$, newColWidth, newGutterWidth, ff;

    const vals = {};

    const $wrap = $('.wrap'),
        $form = $('form'),
        $pre = $('#code pre'),
        $pre2 = $('#code2 pre');


    const getVals = () => {
        vals.totalWidth = parseInt($('#totalWidth').val());
        vals.cols = parseInt($('#cols').val());
        vals.gutters = vals.cols - 1;
        vals.gutterWidth = parseInt($('#gutterWidth').val());
        vals.type = $('input[type=radio]:checked').val();
    }

    const clearAll = () => {
        $('.result').add($wrap.find('li')).remove();
        $wrap.find('.message').removeClass('show').html('');
    }

    const doAll = () => {
        clearAll();
        getVals();
        const lis = vals.cols + vals.gutters;

        // set all texts to px or % where applicable
        $('.type').html(vals.type);

        if (vals.type == 'px') {
            vals.colWidth = parseInt(vals.totalWidth - (vals.gutters * vals.gutterWidth)) / vals.cols;
            colWidth$ = vals.colWidth + '';
            if (colWidth$.indexOf('.') !== -1) {
                decimals = 1;
            } else {
                decimals = 0;
            }
        } else {
            vals.colWidth = parseInt(100 - (vals.gutters * vals.gutterWidth)) / vals.cols;
            colWidth$ = vals.colWidth + '';
        }
        vals.calculatedWidth = (vals.cols * vals.colWidth) + (vals.gutters * vals.gutterWidth);

        // set all block elements to wrapper width
        $('.setWidth').css('width', vals.totalWidth);
        //		$('.bottomDiv').css('margin-left', (totalWidth / 2)*-1);

        // build the table
        for (let i = 0; i < lis; i++) {
            $('.wrap ul').append('<li/>');
        }
        $wrap.find('li:nth-child(even)').addClass('gutter');
        $wrap.find('li:nth-child(2)').append('<div class="result">' + vals.gutterWidth + vals.type + '</div>');

        if (vals.type == 'px') {
            $wrap.find('li').css('width', vals.colWidth + 'px');
            $wrap.find('.gutter').css('width', vals.gutterWidth + 'px');
        } else {
            $wrap.find('ul').css('width', '100%');
            $wrap.find('li').css('width', vals.colWidth + '%');
            $wrap.find('.gutter').css('width', vals.gutterWidth + '%');
        }

        $wrap.append('<div class="result">Calculated width: ' + vals.calculatedWidth + vals.type + '</div>');
        $wrap.find('li:first-child').append('<div class="result">' + vals.colWidth + vals.type + '</div>');
        if (decimals == 1) {
            $wrap.find('li:first-child .result').addClass('error');
            $wrap.find('.message').addClass('show').html('Your columns have widths with decimals. Better play around with the gutter width...');
        }
        $pre.text('.wrap {\n\twidth: ' + vals.totalWidth + 'px;\n}\nul.columns {\n\tlist-style: none;\n\tmargin: 0 0 0 -' + vals.gutterWidth + vals.type + ';\n\tpadding: 0;\n\twidth: ' + vals.colWidth + vals.type + ';\n}\nul.columns li {\n\tfloat: left;\n\tmargin: 0 0 0 ' + vals.gutterWidth + vals.type + ';\n\tpadding: 0;\n}');

        $pre2.text('<div class="wrap">\n\t<ul class="columns">\n');
        for (var i = 0; i < vals.cols; i++) {
            ff = $pre2.text();
            ff += '\t\t<li></li>\n';
            $pre2.text(ff);
        }
        ff = $pre2.text();
        ff += '\t</ul>\n</div>';
        $pre2.text(ff);

    }

    doAll();

    $('input[type=text]').on('change', function () {
        ff = $(this).val();
        $(this).prev('input').val(ff);
        doAll();
        return false;
    });

    $('input[type=radio]').on('change', function () {
        //get the numbers of the curren situation...
        newGutterWidth = ($wrap.find('.gutter').width() / vals.totalWidth) * 100;
        newColWidth = ($wrap.find('li').eq(0).width() / vals.totalWidth) * 100;
        if (vals.type == '%') {
            newGutterWidth = (newGutterWidth / 100) * vals.totalWidth;
            newColWidth = (newColWidth / 100) * totalWidth;
        }
        doAll();
        //todo
        // ... and use them to convert to px or percentage
        if (vals.type == '%') {
            $wrap.find('li').css('width', newColWidth + vals.type);
            $wrap.find('.gutter').css('width', newGutterWidth + vals.type);

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
            $wrap.find('li').css('width', newColWidth + vals.type);
            $wrap.find('.gutter').css('width', newGutterWidth + vals.type);
        }
        $('#gutterWidth').val(newGutterWidth);
        $('.gutter .result').html(newGutterWidth + vals.type);
        $wrap.find('li:first-child .result').html(newColWidth + vals.type);

        return false;
    });

    const change = (element, increment) => {
        const $el = $(element),
            elValue = parseInt($el.val(), 10),
            incAmount = increment || 1,
            newValue = elValue + incAmount;

        if ((newValue) > -1) {
            $el.val(newValue);
        }
    }

    $('#cols, #gutterWidth, #totalWidth').keydown(function (e) {
        const keyCode = e.keyCode || e.which,
            arrow = {
                left: 37,
                up: 38,
                right: 39,
                down: 40
            };

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

        $(this).prev('input').val($(this).val());
        doAll();
        return false;
    });

});
