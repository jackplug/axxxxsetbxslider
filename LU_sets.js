/* Usage:
    add the following classes to the container element:
    .listing
    .horizslider
    .hs-x-lines - where x is the number of lines. x can be 1, 2, or 3 [required]
    .hs-cols-y  - where y is the number of columns. y can be any value [optional]
   Utilises/requires bxSlider - http://v3.bxslider.com/
*/
var HorizSlider = {
    options: {
        box: ['.listing'],
        defaultCols: 3
    },

    setup: function(){
        for (var i = 0, ol = this.options.box.length; i < ol; i++) {
            var $t = $(this.options.box[i]),
                that = this;

            // add wrapper
            if ($t.hasClass('horizslider')) {
                $t.wrap('<div class="HS_wrapper HS_setup"/>');

                $t.each(function(i){
                    var $i = $(this),
                        $itemOne = $i.find('.item').first();

                    $i.data('sliderItem', i)
                        .find('.cleaner').remove();

                    // preliminary setup - approximate height set during config stage
                    if ($i.hasClass('hs-1-line')) { // 3 per box
                        $i.parent().height( $itemOne.outerHeight(true) );

                    } else if ($i.hasClass('hs-2-lines')) { // 6 per box
                        $i.parent().height( $itemOne.outerHeight(true) * 2 );

                    } else if ($i.hasClass('hs-3-lines')) { //9 per box
                        $i.parent().height( $itemOne.outerHeight(true) * 3 );

                    }

                    that.itemSetup($i);
                });

                $t.parents('.HS_setup').removeClass('HS_setup');

            }

        }
    },

    itemSetup: function(el) {
        var $items = el.find('.item'),
            cols   = this.options.defaultCols,
            elClassNames = el.prop('class');

        if (elClassNames.indexOf('hs-cols-') > -1) {
            cols = parseInt(elClassNames.split('hs-cols-')[1]);
        }

        // set wrapper heights
        if (el.hasClass('hs-1-line')) { // 3 per box
            this.itemSet($items, 1 * cols);
            el.parent().height( this.maxheight($items) );

        } else if (el.hasClass('hs-2-lines')) { // 6 per box
            this.itemSet($items, 2 * cols);
            el.parent().height( this.maxheight($items.parents('.HS_set')) );

        } else if (el.hasClass('hs-3-lines')) { //9 per box
            this.itemSet($items, 3 * cols);
            el.parent().height( this.maxheight($items.parents('.HS_set')) );
        }

        var elChildrenLen = el.children().length;

        if (elChildrenLen > 1) {
            el.parent().wrap('<div class="bxSlider-extrawrapper"/>');
            var $paging = $('<div id="paging_' + el.data('sliderItem') + '" class="sliderpager"/>');
            if (elChildrenLen >= 10) {
                $paging.addClass('paging-text');
            }

            $paging.prependTo(el.parents('.bxSlider-extrawrapper'));

            var $pn = $('<div id="paging_prevNext_' + el.data('sliderItem') + '" class="prevNext-bxSlider"/>');

            $pn.append('<a href="#" id="bxPrevSel_' + el.data('sliderItem') + '" class="prev-bxSlider">P<span></span></a>');
            $pn.append('<a href="#" id="bxNextSel_' + el.data('sliderItem') + '" class="next-bxSlider">N<span></span></a>');
                
            $pn.prependTo(el.parents('.bxSlider-extrawrapper'))

            if (elChildrenLen < 10) {
                var itemsslider = el.bxSlider({
                    mode: 'horizontal',
                    auto: false,
                    controls: false,
                    pager: true,
                    pagerSelector: '#paging_' + el.data('sliderItem')
                });
            } else {
                var itemsslider = el.bxSlider({
                    mode: 'horizontal',
                    auto: false,
                    controls: false,
                    pager: true,
                    pagerType: 'short',
                    pagerSelector: '#paging_' + el.data('sliderItem')
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


            // set some padding on the previous heading element so that heading will not clash with slider controls
            var $prevItem = el.parents('.bxSlider-extrawrapper').prev();
            $prevItem.css('padding-right', $prevItem.width() - $('#paging_' + el.data('sliderItem')).position().left + 5 + 'px');
        }

    },

    itemSet: function(el, n){
        for(var i = 0, il = el.length; i < il; i += n) {
            el.slice(i, i + n).wrapAll('<div class="HS_set box"></div>');
        }
    },


    // helpers
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