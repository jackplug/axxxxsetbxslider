// Horizontal slider specifically for sets of objects
// uses bxSlider
var HorizSlider = {
    options: {
        box: ['.horizslider'],
        itemHeight: '233px',
        pTop: 0
    },

    setup: function(){
        for (var c = 0, ol = this.options.box.length; c < ol; c++) {
            var $t = $(this.options.box[c]),
                that = this;

            // add wrapper
            $t.wrap('<div class="HS_wrapper HS_setup" id="HS_id_' + c + '"/>');

            $t.each(function(i){
                var $i = $(this),
                    $items = $i.find('.box-set-item').css('height', that.options.itemHeight),
                    $itemOne = $items.first();

                if ($i.css('padding-top') && parseInt($i.css('padding-top')) > 0) {
                    that.options.pTop = parseInt($i.css('padding-top'));
                }

                $i.data('sliderItem', i)
                    .find('.cleaner').remove();

                // preliminary setup - approximate height set during config stage
                if ($i.hasClass('hs-1-line')) { // 3 per box
                    $i.parent().height( $itemOne.outerHeight(true) + that.options.pTop);

                } else if ($i.hasClass('hs-2-lines')) { // 6 per box
                    $i.parent().height( ($itemOne.outerHeight(true) * 2) + that.options.pTop );

                } else if ($i.hasClass('hs-3-lines')) { //9 per box
                    $i.parent().height( ($itemOne.outerHeight(true) * 3) + that.options.pTop );
                }

                that.itemSetup($i, 'HS_id_' + c);
            });

            $t.parents('.HS_setup').removeClass('HS_setup');

        }
    },

    itemSetup: function(el, elId) {
        var $items = el.find('.box-set-item'),
            boxHeight = 0;

        // set wrapper heights
        if (el.hasClass('hs-1-line')) { // 3 per box
            this.itemSet($items, 3);
            //boxHeight = this.maxheight($items) + this.options.pTop;
            boxHeight = this.options.itemHeight + this.options.pTop;
            el.parent().height( boxHeight );

        } else if (el.hasClass('hs-2-lines')) { // 6 per box
            this.itemSet($items, 6);
            //boxHeight = this.maxheight($items.parents('.HS_set')) + this.options.pTop;
            if ($items.length > 3) {
                boxHeight = (parseInt(this.options.itemHeight) * 2) + this.options.pTop;
                el.parent().height( boxHeight );
            } else {
                boxHeight = this.options.itemHeight + this.options.pTop;
                el.parent().height( boxHeight );
            }

        } else if (el.hasClass('hs-3-lines')) { //9 per box
            this.itemSet($items, 9);
            //boxHeight = this.maxheight($items.parents('.HS_set')) + this.options.pTop;
            if ($items.length > 6) {
                boxHeight = (parseInt(this.options.itemHeight) * 3) + this.options.pTop;
                el.parent().height( boxHeight );
            } else {
                if ($items.length > 3) {
                    boxHeight = (parseInt(this.options.itemHeight) * 2) + this.options.pTop;
                    el.parent().height( boxHeight );
                } else {
                    boxHeight = this.options.itemHeight + this.options.pTop;
                    el.parent().height( boxHeight );
                }
            }
        }

        var elChildrenLen = el.children().length;

        el.parent().wrap('<div class="bxSlider-extrawrapper"/>');
        
        if (elChildrenLen > 1) {
            var $pn = $('<div id="paging_prevNext_' + el.data('sliderItem') + '" class="alt-prevNext-bxSlider" data-for="' + elId + '"/>');

            $pn.append('<a href="#" id="bxPrevSel_' + el.data('sliderItem') + '" class="prev-bxSlider">P<span></span></a>');
            $pn.append('<a href="#" id="bxNextSel_' + el.data('sliderItem') + '" class="next-bxSlider">N<span></span></a>');

            //$pn.prependTo(el.parents('.bxSlider-extrawrapper'));
            var elOffset = el.offset(),
                pnTop = elOffset.top + (boxHeight / 2),
                pnLeft = elOffset.left;

            $pn.css({
                top: pnTop + 'px'
            });

            $pn.prependTo('body');

            this.setPNLeftPosition(pnLeft, elId);

            $(window).resize(function(){ HorizSlider.setPNLeftPosition(); });
        }

        if (elChildrenLen > 1) {
            var itemsslider = el.bxSlider({
                mode: 'horizontal',
                auto: false,
                controls: false
            });
        }

        // configure the prev/next elements
        $('#bxPrevSel_' + el.data('sliderItem')).click(function(){
            itemsslider.goToPreviousSlide();
            return false;
        });

        $('#bxNextSel_' + el.data('sliderItem')).click(function(){
            itemsslider.goToNextSlide();
            return false;
        });

    },

    itemSet: function(el, n){
        for(var i = 0, il = el.length; i < il; i += n) {
            el.slice(i, i + n).wrapAll('<div class="HS_set box"></div>');
        }
    },


    // helpers
    setPNLeftPosition: function(pnLeft, elId) {
        if (typeof elId !== 'undefined') {
            $('.alt-prevNext-bxSlider[data-for=' + elId + ']').css('left', pnLeft + 'px');
            return;
        }

        for (var i = 0, ol = this.options.box.length; i < ol; i++) {
            var $t = $(this.options.box[i]);

            $t.each(function(){
                var $el = $t.parents('.HS_wrapper'),
                    pnLeft = $el.offset().left;
                $('.alt-prevNext-bxSlider[data-for=' + $el.prop('id') + ']').css('left', pnLeft + 'px');
            });
        }
    },

    maxheight: function(el) {
        var mh = 0, oh = 0;

        el.each(function(){
            oh = $(this).outerHeight();

            if (oh > mh) {
                mh = oh;
            }
        });

        return mh;

    }
};


$(function(){
    HorizSlider.setup();
});
