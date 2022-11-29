/**
 * Layers Pro JS
 *
 * This file contains all theme JS functions.
 */
jQuery(function($){


	/**
	 * Search
	 */
	$(document).on( 'click', '.search-close', function(){

		$('.search-interface-overlay')
			.removeClass('search-interface-play-in')
			.addClass('search-interface-play-out');

		return false;

	});
	$(document).on( 'click', '.header-search > a, .menui-item-layers-search > a', function(){

		var $search_field = $('#layers-modal-search-field');

		$('.search-interface-overlay')
			.removeClass('search-interface-play-out')
			.addClass('search-interface-play-in');

		setTimeout(function() {
			$search_field
				.focus()
				.layers_pro_set_cursor_postion( $search_field.val().length );
		}, 600 );

		return false;
	});

    /**
	 * Allow animation if x-animation is found
     */
    // For all the animations on page animate as soon as the
    // scrolling reaches 25% above the widget
    /**
     * X - Scroll Animations.
     */
    var bodyEl = $('body');
    var footerEl = $('#footer');

    if ( bodyEl.hasClass('layers-animate') ) {
        var sectionsToAnimate = [
            "#wrapper-content > .widget",
            ".title-container .title",
            "#post-list .post",
            ".sidebar",
            "#wrapper-content :not(\".swiper-container\") .grid > article:not('.layers-masonry-column')"
        ];

        // Special header animation

        // Header site to fade in with downward direction
        $(".header-site").addClass("do-animate delay-200 animated-1s layers-default-fade-in-down");

        // Header block container to fade in upward direction
        $(".header-block.container").addClass("do-animate delay-200 animated-1s layers-default-fade-in-up");

        $(sectionsToAnimate.join(",")).not(".do-animate").addClass("do-animate translucent animated-1s layers-default-fade-in-up");
        footerEl.addClass("animated-1s");

        $('.do-animate').waypoint({
            offset 	: '75%',
            handler	: layersAnimationHandler('layers-default', false)
        });
        footerEl.waypoint({
            offset 	: '90%',
            handler	: layersAnimationHandler('layers-default', false)
        });

        // As we are using delay-200 for header and footer lets remove
		// the class of opacity from body for more smooth animations
        setTimeout(function(){
            bodyEl.removeClass('opacity-0');
		}, 200);
	}

    // For all the animations on page animate as soon as the
    // scrolling reaches 25% above the widget
    $('.do-animate').waypoint({
        handler: layersAnimationHandler('x', false),
        offset: '75%'
    });

});

/**
 * Helper function that initialsizes our Carousel. It expects that there
 * is a row of our standard Layers post list HTML that it will convert
 *
 * @param  string widget_id         Widgets id selector eg #widget_66
 * @param  object settings     Settings object
 * @return Swiper                   Swiper object
 */
function layers_pro_init_post_carousel( widget_id, settings ) {

	// Debigging disable.
	// return;

	// Get the all important row that will will contain our carousel.
	var carousel_row = jQuery( widget_id ).find( '.post-carousel-row' );
	var carousel_row_grid = carousel_row.find('.grid');

	/**
	 * Prepare a cloned Mimic row that we will grab our sizing from - which allows for responsive resizing.
	 */

	// Create a holder to hold the cloned elements that we will subsequently mimic in our carousel.
	var mimic_row = jQuery( '<div class="layers-pro-post-carousel-mimic-row"><div class="grid">' );
	var mimic_row_grid = mimic_row.find( '.grid' );

	jQuery( widget_id ).prepend( mimic_row );

	// Hide this mimic row until it's needed - it will be shown, DOM measurments taken from it, then hidden again before it's rendered.
	// mimic_row.hide();

	// Copy the classes from the row so the CSS (especially responsive) make it behave in the same way.
	mimic_row.addClass( carousel_row.attr('class') );

	// Clone one of the article elements that we will mimic (clone many during debugging stage).
	mimic_row_grid.prepend( jQuery( widget_id ).find( '.grid' ).children(':lt(6)').clone() );

	// Empty the articles so they don't tax the browsers performance.
	mimic_row_grid.children().html('').prepend('<div style="background:black">&nbsp;</div>');

	/**
	 * Prepare the actual Carousel elemnts.
	 */

	// Wrap the elemnts in the necessary holders required for Swiper.
	carousel_row_grid.children().not('.swiper-pagination, .arrows').wrapAll('<div class="swiper-wrapper">');
	carousel_row_grid.children().wrapAll('<div class="swiper-container">');

	// Get the final element that will become our carousel.
	carousel_element = carousel_row_grid.find('.swiper-container');

	// Setup the slides/columns.
	carousel_element.find('.column, .column-flush')
		// Remove framewrok classes from the column that will disrupt the carousel display.
		.removeClass('column column-flush span-1 span-2 span-3 span-4 span-5 span-6 span-7 span-8 span-9 span-10 span-11 span-12')
		// Add the swiper-slide class that Swiper needs.
		.addClass('swiper-slide');


	/**
	 * Start getting and settings properties.
	 */

	// Use the mimic row to get measurements from from our CSS.
	var space_between = layers_pro_post_carousel_calculate_space_between( carousel_row, mimic_row );
	var per_row = layers_pro_post_carousel_calculate_per_row( carousel_row, mimic_row );

	// Set the padding of the wrapper to start.
	carousel_row.css( { 'padding-left' : layers_pro_post_carousel_calculate_holder_spacing( carousel_row, mimic_row ), 'padding-right' : layers_pro_post_carousel_calculate_holder_spacing( carousel_row, mimic_row ) } );

	// Merge defaults with the settings passed.
	settings = jQuery.extend( {
		mode                :'horizontal',
		calculateHeight     : true,
		wrapperClass        : 'swiper-wrapper',
		slideClass          : 'swiper-slide',
		spaceBetween        : space_between,
		slidesPerView       : per_row,
		loop                : true,
		paginationClickable : true,
	}, settings );

	carousel_row.addClass('post-carousel-row-swiper');

	// Init the Carousel.
	var post_swiper = carousel_element.swiper( settings );

	/*
	post_swiper.enableKeyboardControl();

	jQuery( widget_id ).find('.arrows a').on( 'click' , function(e){
		e.preventDefault();

		// "Hi Mom"
		$that = jQuery(this);

		if( $that.hasClass( 'swiper-pagination-switch' ) ){ // Anchors
			post_swiper.swipeTo( $that.index() );
		} else if( $that.hasClass( 'l-left-arrow' ) ){ // Previous
			post_swiper.swipePrev();
		} else if( $that.hasClass( 'l-right-arrow' ) ){ // Next
		// 	post_swiper.swipeNext();
		}

		return false;
	});
	*/

	// Setup resize event so the carousel is constantly mimicing our mimic row - and auto heighting it's columns.
	jQuery(window).resize(function(){
		layers_pro_post_carousel_resize( post_swiper, carousel_row, mimic_row );
	});
	layers_pro_post_carousel_resize( post_swiper, carousel_row, mimic_row );

	// Return the slider incase it is needed further.
	return post_swiper;
}

function layers_pro_post_carousel_resize( post_swiper, carousel_row, mimic_row ) {

	// Get.
	var space_between = layers_pro_post_carousel_calculate_space_between( carousel_row, mimic_row );
	var per_row = layers_pro_post_carousel_calculate_per_row( carousel_row, mimic_row );
	var holder_padding = layers_pro_post_carousel_calculate_holder_spacing( carousel_row, mimic_row );

	// Set.
	carousel_row.css( { 'padding-left' : holder_padding, 'padding-right' : holder_padding } );
	post_swiper.params.spaceBetween = space_between;
	post_swiper.params.slidesPerView = per_row;
	post_swiper.update();

	// Also auto height match the rows.
	layers_pro_post_carousel_match_heights( post_swiper );
}

/**
 * Helper function that looks at our mimic row and culculates
 * how many columns it is displaying per row - so the Carousel
 * can mimic our CSS frameworks column behaviour.
 */
function layers_pro_post_carousel_calculate_per_row( carousel_row, mimic_row ){

	// Cache elements.
	var column_element = mimic_row.find('.column, .column-flush').eq(0);

	// Flash show the element so it holds size in the DOM
	mimic_row.show();

	// Calculate columns per_row.
	var per_row = parseInt( Math.round( mimic_row.width() / column_element.width() ) );

	// Hide the element soon as the calculations are done.
	mimic_row.hide();

	return per_row;
}

/**
 * Helper function, similar to above, looks at our mimic
 * row and calculates the space-between at any given time.
 */
function layers_pro_post_carousel_calculate_space_between( carousel_row, mimic_row ){

	// Cache elements.
	var column_element = mimic_row.find('.column, .column-flush').eq(0);

	// Flash show the element so it holds size in the DOM
	mimic_row.show();

	// Calculate the margin-right.
	var space_between = parseInt( column_element.css('margin-left') ) + parseInt( column_element.css('margin-right') );

	// Hide the element soon as the calculations are done.
	mimic_row.hide();

	return space_between;
}

/**
 * Helper function, similar to above, looks at our mimic
 * row and calculates the holder-spacing at any given time.
 */
function layers_pro_post_carousel_calculate_holder_spacing( carousel_row, mimic_row ){

	// Cache elements.
	var column_element = mimic_row.find('.column, .column-flush').eq(0);

	// Flash show the element so it holds size in the DOM
	mimic_row.show();

	// Get Values.
	var holder_padding = 0;
	holder_padding += parseInt( column_element.css('margin-left') ); // Get columns left-margin.
	holder_padding += ( parseInt( mimic_row.css('padding-left') ) ) / 2; // Get holder padding.

	// Hide the element soon as the calculations are done.
	mimic_row.hide();

	return holder_padding;
}

/**
 * Helper function that calculates the highest column
 * and makes sure all other rows match it's height.
 */
function layers_pro_post_carousel_match_heights( post_swiper, match_height ){

	// Reset the container and thumbnail-body height, if it has been set on the previous resize iteration.
	// Transition must be set to 0s so the postions can be measured immediately and not after animations
    post_swiper.container.css({ height: '' });
    post_swiper.container.find('.thumbnail-body').css( 'height', '' );
    post_swiper.container.find('.thumbnail-body .button').css( { 'margin-top': '', transition: '0s,0s' } );

    // Don't do any height matching if there is only one slide showing - this happens on Mobile.
    if ( post_swiper.params.slidesPerView <= 1 ) return;

    // Find the highest slide, and set the Swiper container to that height.
    var height = 0;
	post_swiper.slides.each(function( key, slide ){
    	var slide_height = jQuery(slide).outerHeight();
        if( height < slide_height ) height = slide_height;
    });
    post_swiper.container.css({ height: height+'px' });

    // Then go through each slide and stretch the thumbnail-body to fill in the empty space.
    post_swiper.slides.each( function( key, slide ) {

		// Skip auto-heighting of 'Display: Overlay' blocks.
    	if ( jQuery(slide).hasClass('with-overlay') ) return true;

        var thumb_height = 0;
        var padding_top = 0;
        var padding_bottom = 0;
        var slide_height = jQuery(slide).height();

        if ( jQuery(slide).find( '.thumbnail-media' ).length ) {
        	thumb_height = jQuery(slide).find( '.thumbnail-media' ).outerHeight();
        }

        if ( jQuery(slide).find( '.thumbnail-body' ).length ) {
        	padding_top = jQuery(slide).find( '.thumbnail-body' ).css( 'padding-top' );
			padding_bottom = jQuery(slide).find( '.thumbnail-body' ).css( 'padding-top' );

			var $body_height = parseInt(slide_height) - parseInt(thumb_height) - parseInt(padding_top) - parseInt(padding_bottom)

			jQuery(slide).find( '.thumbnail-body' ).height( $body_height );

        }
    });

}

// Set cursor position
jQuery.fn.layers_pro_set_cursor_postion = function(pos) {
	this.each(function(index, elem) {
		if (elem.setSelectionRange) {
			elem.setSelectionRange(pos, pos);
		}
		else if (elem.createTextRange) {
			var range = elem.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	});
	return this;
};

function layersCheckMobile(){
	var isMobile = false; //initiate as false

	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
		isMobile = true;
	}

	return isMobile;
}

/**
 * Animation handler for most of the animation regarding
 * do-animate
 */
(function($ , $window) {
    $window.layersAnimationHandler = function (replacementClass, addDefaultAnimation) {
        // Using closure for more dynamic functions
        return function () {
            // Get the element
            var element = $(this.element);
            // Split all the class names as array
            var classList = element.attr("class").split(/\s+/);

            var hasAnimation = false;
            // The standard procedure is we x-ify the animation class name and remove the x
            // as soon as the offset limit is reached
            $.each(classList, function (i, cls) {
                if (cls.match("^" + replacementClass + "-")) {
                    element.removeClass(cls);
                    element.addClass(cls.replace(replacementClass + '-', ''));
                    hasAnimation = true;
                }
            });

            if (!hasAnimation && addDefaultAnimation) {
                element.addClass('fade-in-up');
            }
            // Animation only occurs once, so as soon as animation is
            // done remove the waypoint monitor and do-animate class
            // from element to prevent multiple event binding
            element.removeClass('do-animate');
            this.destroy();
        }
    };
})(jQuery, window);