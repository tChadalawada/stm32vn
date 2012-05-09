/*!
 * jQuery Collapse-O-Matic v1.3.0
 * http://www.twinpictures.de/collapse-o-matic/
 *
 * Copyright 2012, Twinpictures
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, blend, trade,
 * bake, hack, scramble, difiburlate, digest and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

jQuery(document).ready(function() {
	
	//force collapse
    jQuery('.force_content_collapse').each(function(index) {
	    jQuery(this).css('display', 'none');
    });
	
    //inital collapse
    jQuery('.collapseomatic:not(.colomat-close)').each(function(index) {
	    var thisid = jQuery(this).attr('id');
	    jQuery('#target-'+thisid).css('display', 'none');
    });
    
	//Display the collapse wrapper... use to reverse the show-all on no JavaScript degredation.
	jQuery('.content_collapse_wrapper').each(function(index) {
		jQuery(this).css('display', 'inline');
	});
	
    jQuery('.collapseomatic').hover(function () {
            jQuery(this).addClass("colomat-hover");
        },
        function () {
            jQuery(this).removeClass("colomat-hover");
        }
    );
    
    jQuery('.collapseomatic').click(function() {
		//alert('phones ringin dude');
		var id = jQuery(this).attr('id');
		if(id.indexOf('bot-') != '-1'){
			id = id.substr(4);
			jQuery('#'+id).toggleClass('colomat-close');
		}
		else{
			jQuery(this).toggleClass('colomat-close');
		}
		//check if the title needs to be swapped out
		if(jQuery("#swap-"+id).length > 0){
			var orightml = jQuery(this).html();
			var swaphtml = jQuery("#swap-"+id).html();
			jQuery(this).html(swaphtml);
			jQuery("#swap-"+id).html(orightml);
			
			//is cufon involved? if so, do that thing
			if(swaphtml.indexOf("<cufon") != -1){
				var trigelem = jQuery(this).get(0).tagName;
				Cufon.replace(trigelem);
			}
		}
		
		jQuery('#target-'+id).slideToggle('fast', function() {
			// Animation complete.
		});
        
        //deal with grouped items if needed
        if(jQuery(this).attr('rel') !== undefined){
            var rel = jQuery(this).attr('rel');
			if(rel.indexOf('-highlander') != '-1'){
				closeOtherMembers(rel, id);
			}
			else{
				closeOtherGroups(rel);
			}   
        }
    });
    
    function closeOtherGroups(rel){
        jQuery('.collapseomatic[rel!="' + rel +'"]').each(function(index) {
            //add close class if open
            if(jQuery(this).hasClass('colomat-close') && jQuery(this).attr('rel') !== undefined){                
                jQuery(this).removeClass('colomat-close');
                var id = jQuery(this).attr('id');
                jQuery('#target-'+id).slideToggle('fast', function() {
                    // Animation complete.
                });
				
				//check if there are nested children that need to be collapsed
				var child = jQuery('#target-'+id).children('span.collapseomatic');
				child.each(function(index) {
					jQuery(this).removeClass('colomat-close');
					var thisid = jQuery(this).attr('id');
					jQuery('#target-'+thisid).slideToggle('fast', function() {
						// Animation complete.
					});
					
					//check if there are nested grand children that need to be collapsed
					var grandchild = jQuery('#target-'+thisid).children('span.collapseomatic');
					grandchild.each(function(index) {
						jQuery(this).removeClass('colomat-close');
						var thatid = jQuery(this).attr('id');
						jQuery('#target-'+thatid).slideToggle('fast', function() {
							// Animation complete.
						});
						
						//check if there are nested great grand children that need to be collapsed
						var greatgrandchild = jQuery('#target-'+thatid).children('span.collapseomatic');
						greatgrandchild.each(function(index) {
							jQuery(this).removeClass('colomat-close');
							var theotherid = jQuery(this).attr('id');
							jQuery('#target-'+theotherid).slideToggle('fast', function() {
								// Animation complete.
							});
						})
					})
				})
            }
        });
    }
    
    function closeOtherMembers(rel, id){
        jQuery('.collapseomatic[rel="' + rel +'"]').each(function(index) {
            //add close class if open
            if(jQuery(this).attr('id') != id && jQuery(this).hasClass('colomat-close') && jQuery(this).attr('rel') !== undefined){
				//collapse the element
                jQuery(this).removeClass('colomat-close');
                var thisid = jQuery(this).attr('id');
                jQuery('#target-'+thisid).slideToggle('fast', function() {
                    // Animation complete.
                });
				
				//check if there are nested children that need to be collapsed
				var child = jQuery('#target-'+id).children('span.collapseomatic');
				child.each(function(index) {
					jQuery(this).removeClass('colomat-close');
					var thisid = jQuery(this).attr('id');
					jQuery('#target-'+thisid).slideToggle('fast', function() {
						// Animation complete.
					});
					
					//check if there are nested grand children that need to be collapsed
					var grandchild = jQuery('#target-'+thisid).children('span.collapseomatic');
					grandchild.each(function(index) {
						jQuery(this).removeClass('colomat-close');
						var thatid = jQuery(this).attr('id');
						jQuery('#target-'+thatid).slideToggle('fast', function() {
							// Animation complete.
						});
						
						//check if there are nested great grand children that need to be collapsed
						var greatgrandchild = jQuery('#target-'+thatid).children('span.collapseomatic');
						greatgrandchild.each(function(index) {
							jQuery(this).removeClass('colomat-close');
							var theotherid = jQuery(this).attr('id');
							jQuery('#target-'+theotherid).slideToggle('fast', function() {
								// Animation complete.
							});
						})
					})
				})
            }
        });
    }
    
    var myFile = document.location.toString();
    if (myFile.match('#')) { // the URL contains an anchor
        // click the navigation item corresponding to the anchor
        var myAnchor = '#' + myFile.split('#')[1];
        jQuery(myAnchor).click();
    }
    
    jQuery('.expandall').click(function() {
		if(jQuery(this).attr('rel') !== undefined){
			var rel = jQuery(this).attr('rel');
			jQuery('.collapseomatic[rel="' + rel +'"].collapseomatic:not(.colomat-close)').each(function(index) {
					jQuery(this).addClass('colomat-close');
					var thisid = jQuery(this).attr('id');
					
					if(jQuery("#swap-"+thisid).length > 0){
						var orightml = jQuery(this).html();
						var swaphtml = jQuery("#swap-"+thisid).html();
						jQuery(this).html(swaphtml);
						jQuery("#swap-"+thisid).html(orightml);
						
						//is cufon involved? if so, do that thing
						if(swaphtml.indexOf("<cufon") != -1){
							var trigelem = jQuery(this).get(0).tagName;
							Cufon.replace(trigelem);
						}
					}
				
					jQuery('#target-'+thisid).slideToggle('fast', function() {
						// Animation complete.
					});
			});
	    }
		else{
			jQuery('.collapseomatic:not(.colomat-close)').each(function(index) {
				jQuery(this).addClass('colomat-close');
				var thisid = jQuery(this).attr('id');
				
				if(jQuery("#swap-"+thisid).length > 0){
					var orightml = jQuery(this).html();
					var swaphtml = jQuery("#swap-"+thisid).html();
					jQuery(this).html(swaphtml);
					jQuery("#swap-"+thisid).html(orightml);
					
					//is cufon involved? if so, do that thing
					if(swaphtml.indexOf("<cufon") != -1){
						var trigelem = jQuery(this).get(0).tagName;
						Cufon.replace(trigelem);
					}
				}
					
				jQuery('#target-'+thisid).slideToggle('fast', function() {
				// Animation complete.
				});
			});
		}
    });
    
    jQuery('.collapseall').click(function() {
		if(jQuery(this).attr('rel') !== undefined){
			var rel = jQuery(this).attr('rel');
			jQuery('.collapseomatic[rel="' + rel +'"].collapseomatic.colomat-close').each(function(index) {
				jQuery(this).removeClass('colomat-close');
				var thisid = jQuery(this).attr('id');
				
				if(jQuery("#swap-"+thisid).length > 0){
					var orightml = jQuery(this).html();
					var swaphtml = jQuery("#swap-"+thisid).html();
					jQuery(this).html(swaphtml);
					jQuery("#swap-"+thisid).html(orightml);
					
					//is cufon involved? if so, do that thing
					if(swaphtml.indexOf("<cufon") != -1){
						var trigelem = jQuery(this).get(0).tagName;
						Cufon.replace(trigelem);
					}
				}
				
				jQuery('#target-'+thisid).slideToggle('fast', function() {
					// Animation complete.
				});
			});
		}
		else{
			jQuery('.collapseomatic.colomat-close').each(function(index) {	                 
				jQuery(this).removeClass('colomat-close');
				var thisid = jQuery(this).attr('id');
				
				if(jQuery("#swap-"+thisid).length > 0){
					var orightml = jQuery(this).html();
					var swaphtml = jQuery("#swap-"+thisid).html();
					jQuery(this).html(swaphtml);
					jQuery("#swap-"+thisid).html(orightml);
					
					//is cufon involved? if so, do that thing
					if(swaphtml.indexOf("<cufon") != -1){
						var trigelem = jQuery(this).get(0).tagName;
						Cufon.replace(trigelem);
					}
				}
				
				jQuery('#target-'+thisid).slideToggle('fast', function() {
				// Animation complete.
				});
			});
		}
    });
});