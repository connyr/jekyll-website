//  /**
//  * This demo was prepared for you by Petr Tichy - Ihatetomatoes.net
//  * Want to see more similar demos and tutorials?
//  * Help by spreading the word about Ihatetomatoes blog.
//  * Facebook - https://www.facebook.com/ihatetomatoesblog
//  * Twitter - https://twitter.com/ihatetomatoes
//  * Google+ - https://plus.google.com/u/0/109859280204979591787/about
//  * Article URL: http://ihatetomatoes.net/simple-parallax-scrolling-tutorial/
//  */

// ( function( $ ) {
	
// 	// Setup variables
// 	$window = $(window);
// 	$slide = $('.home-slide');
// 	$body = $('body');
	
//     //FadeIn all sections   
// 	$body.imagesLoaded( function() {
// 		setTimeout(function() {
		      
// 		      // Resize sections
// 		      adjustWindow();
		      
// 		      // Fade in sections
// 			  $body.removeClass('loading').addClass('loaded');
			  
// 		}, 800);
// 	});
	
// 	function adjustWindow(){
		
// 		// Init Skrollr
		
		
// 		// Get window size
// 	    winH = $window.height();
	    
// 	    // Keep minimum height 550
// 	    if(winH <= 550) {
// 			winH = 550;
// 		} 
	    
// 	    // Resize our slides
// 	    $slide.height(winH);
	    
// 	    // Refresh Skrollr after resizing our sections
	    
	    
// 	}
		
// } )( jQuery );


/**
 * Parallax Scrolling Tutorial
 * For Smashing Magazine
 * July 2011
 *   
 * Author: Richard Shepherd
 * 		   www.richardshepherd.com
 * 		   @richardshepherd   
 */

// On your marks, get set...
$(document).ready(function(){

	// Cache the Window object
	$window = $(window);

	// Cache the Y offset and the speed of each sprite
	$('[data-type]').each(function() {	
		$(this).data('offsetY', parseInt($(this).attr('data-offsetY')));
		$(this).data('Xposition', $(this).attr('data-Xposition'));
		$(this).data('speed', $(this).attr('data-speed'));
	});

	// For each element that has a data-type attribute
	$('section[data-type="background"]').each(function(){


		// Store some variables based on where we are
		var $self = $(this),
			offsetCoords = $self.offset(),
			topOffset = offsetCoords.top;

		// When the window is scrolled...
	    $(window).scroll(function() {

			// If this section is in view
			if ( ($window.scrollTop() + $window.height()) > (topOffset) &&
				 ( (topOffset + $self.height()) > $window.scrollTop() ) ) {

				// Scroll the background at var speed
				// the yPos is a negative value because we're scrolling it UP!								
				var yPos = -($window.scrollTop() / $self.data('speed')); 

				// If this element has a Y offset then add it on
				if ($self.data('offsetY')) {
					yPos += $self.data('offsetY');
				}

				// Put together our final background position
				var coords = '50% '+ yPos + 'px';

				// Move the background
				$self.css({ backgroundPosition: coords });

				// Check for other sprites in this section	
				$('[data-type="sprite"]', $self).each(function() {

					// Cache the sprite
					var $sprite = $(this);

					// Use the same calculation to work out how far to scroll the sprite
					var yPos = -($window.scrollTop() / $sprite.data('speed'));					
					var coords = $sprite.data('Xposition') + ' ' + (yPos + $sprite.data('offsetY')) + 'px';

					$sprite.css({ backgroundPosition: coords });													

				}); // sprites

				// Check for any Videos that need scrolling
				$('[data-type="video"]', $self).each(function() {

					// Cache the video
					var $video = $(this);

					// There's some repetition going on here, so 
					// feel free to tidy this section up. 
					var yPos = -($window.scrollTop() / $video.data('speed'));					
					var coords = (yPos + $video.data('offsetY')) + 'px';

					$video.css({ top: coords });													

				}); // video	

			}; // in view

		}); // window scroll

	});	// each data-type

}); // document ready