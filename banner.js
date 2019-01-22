/* newBanner
 * - Add a banner to a Blackboard classic content page
 * - Banner specified by ??
 * - Extra tweaks include
 *   - turn off display of the page title by Blackboard
 *   - add some HTML to display on over the image
 
 
 * data format - in a content item called Banner
 * - banner image specified by??
 * - turn page title off by
            Title: off | on (default)
 * - text to display either straight text
            Banner Title: some text
     or HTML
          <div id="Banner Title">...</div>
 */
 
 /***** TODO
  * 1. Hide title hard coded  **DONE**
  * 2. Add some text over image hard coded  **DONE**
  * 3. Read whether title hidden from banner item
  * 3. Read text over image from Banner item
  * 4. Read image from banner item (may need to go early)
  * 5. Double check positioning of text
  * 6. Allow text to be placed elsewhere in the image
  ****/

// TEMPLATES  TODO

// Define the wrapper around the card interface

function newBanner($){
	/* define variables based on Bb page type */
	/* used to identify important components in html */
	var tweak_bb_active_url_pattern = "listContent.jsp";
	window.tweak_bb = { display_view: (location.href.indexOf(tweak_bb_active_url_pattern) > 0 ), 
          page_id: "#content_listContainer",
	      row_element: "li" };
	      
	 if (location.href.indexOf("listContent.jsp") > 0) {
         $(".gutweak").parents("li").hide(); 
         // hide the title bar - but only when not editing
         $("#pageTitleBar").hide();
	 }

    
    // and just hide the banner for now
    $("#banner").hide(); // not working
    
    // Add hard coded text
    // - will need to add another image with a div as first thin in pageTitleDiv
    
    var text= `
    <style>
    /* Container holding the image and the text */
.container {
  position: relative;
  text-align: center;
  color: white;
}

/* Bottom left text */
.bottom-left {
  position: absolute;
  bottom: 8px;
  left: 16px;
}

/* Top left text */
.top-left {
  position: absolute;
  top: 8px;
  left: 16px;
}

/* Top right text */
.top-right {
  position: absolute;
  top: 8px;
  right: 16px;
}

/* Bottom right text */
.bottom-right {
  position: absolute;
  bottom: 1em;
  right: 3em;
}

/* Centered text */
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}</style>
    <div class="my_banner_container">
  <img src="https://bblearn-blaed.griffith.edu.au/bbcswebdav/pid-4313769-dt-content-rid-47523913_1/xid-47523913_1" alt="Snow" style="width:100%;">
  <div class="bottom-right"><h3 style="color:white;font-size:3em;background-color:coral">Bachelor of Creative Industries</h3></div>
</div>
    `;
    $("#pageTitleDiv").prepend(text);
    
    // TODO: use this to get the banner item
    //var cardInterface = jQuery(tweak_bb.page_id +" > "+tweak_bb.row_element//).find(".item h3").filter(':contains("Card Interface")').eq(0);
 	
 	//if ( cardInterface.length === 0){
 	  //  return false;
 	//}
    /* Get the titles and descriptions of the items on the page */
	//var items = getCardItems($);
	
	/* generate the cards interface for the tiems */
	//addCardInterface(items);
}

/***
 * Extract an array of items from the page that have been specified as part 
 * of the card interface
 */

function getCardItems($) {
	// Find all the items that containg Card Image: ??
	var cards = jQuery(tweak_bb.page_id + " > " +tweak_bb.row_element).children(".details").children('.vtbegenerated').filter(":contains('Card Image:')");
	var items=[];
	
	// Loop through each card and construct the items array with card data
	cards.each( function(idx){
        // Parse the description and remove the Card Image data	    
	    var description = $(this).html(),picUrl;
	    m = description.match(/[Cc]ard [Ii]mage *: *([^\s<]*)/ );
	    if (m) {
    	    picUrl=m[1];
	        description = description.replace( m[0], "");
	    }
	    
	    // Check to see if an image with title "Card Image" has been inserted
	    var inlineImage = $(this).find('img').attr('title', 'Card Image');
	    if (inlineImage.length) {
	        picUrl=inlineImage[0].src;
	        //console.log("item html" + inlineImage[0].outerHTML);
	        description = description.replace(inlineImage[0].outerHTML,"");
	        // Bb also adds stuff when images inserted, remove it from 
	        // description to be placed into card
	        var bb = $.parseHTML(description);
	        // This will find the class
	        stringToRemove = $(description).find('.contextMenuContainer').parent().clone().html();
	        
	        description = description.replace( stringToRemove, '');
	    }
	    
	    // Parse the date for commencing
	    var month,date,m = description.match(/[Cc]ard [Dd]ate *: *([A-Za-z]*) ([0-9]*)/);
	    if (m) {
    	    month=m[1];
    	    date=m[2];
    	    description = description.replace(m[0],"");
	    }
	    
	    // See if there's a different label for date
	    m = description.match(/[Cc]ard [Dd]ate [Ll]abel *: ([^<]*)/);
	    var dateLabel='Commencing';
	    if (m) {
	        dateLabel=m[1];
	        description = description.replace( m[0], "");
	    }
	    
	    // See if the Course Label should be changed
	    var label="Module";
	    m = description.match(/[Cc]ard [Ll]abel *: *([^<]*)/ );
	    if (m) {
	        label=m[1];
	        description = description.replace( m[0], "");
	    }
	    
	    // need to get back to the header which is up one div, a sibling, then span
	    var header = $(this).parent().siblings(".item").find("span")[2];
	    var title = $(header).html(),link;
	    link = $(header).parent('a').attr('href');
	    
	    // Hide the contentItem  TODO Only do this if display page
	    var tweak_bb_active_url_pattern = "listContent.jsp";
	    if (location.href.indexOf(tweak_bb_active_url_pattern) > 0 ) { 
	        $(this).parent().parent().hide();
	        //console.log( "content item " + contentItem.html());
	    }
	    // save the item for later
	    var item = {title:title, picUrl:picUrl, description:description,
	        link:link,month:month,date:date,label:label,dateLabel:dateLabel};
	    items.push(item);
	});
	
	return items;
}

/****
 * addCardInterface( items )
 * - Given an array of items to translate into cards add the HTML etc
 *   to generate the card interface
 * - Add the card interface to any item that has a title including
 *     "Card Interface:" with an optional title
 * 
 */
 
 function addCardInterface( items ) {

    // Define which template to use 
    var template = HORIZONTAL;
 	
 	// get the content item with h3 heading containing Card Interface
 	var cardInterface = jQuery(tweak_bb.page_id +" > "+tweak_bb.row_element).find(".item h3").filter(':contains("Card Interface")').eq(0);
 	
 	if ( cardInterface.length === 0){
        console.log("Card: Can't find item with heading 'Card Interface' in which to insert card interface");
        return false;
    } else {
        // parse title to change template, if necessary
        //var cardInterfaceTitle=$(cardInterface + "span:last");
        var cardInterfaceTitle=cardInterface.html();
        
        var m = cardInterfaceTitle.match(/Card Interface *([^<]*) *<\/span>/ );
	    if (m) {
	        templateChoice=m[1];
	        m = templateChoice.match(/[Vv]ertical/ );
	        if (m) {
	            template = VERTICAL;
	        } else if ( templateChoice.match(/[Hh]orizontal/ ) ) {
	            template = HORIZONTAL;
	        }
	    } // if no match, stay with default
        
        /*console.log( "Card interface html " + cardInterface.html());
        console.log( "titla object " + cardInterfaceTitle + "title is " + cardInterfaceTitle.html()); */
    }
    // make the h3 for the Card Interface item disappear
    // (Can't hide the parent as then you can't edit via Bb)
    cardInterface.hide();
 	// Get the content area in which to insert the HTML
 	var firstItem = cardInterface.parent().siblings(".details");//.children('.vtbegenerated');
    
 	// Use the card HTML template and the data in items to generate
 	// HTML for each card
    var cards = "" ;
    var moduleNum = 1;
    items.forEach( function(idx) {
	    var cardHtml=cardHtmlTemplate[template];
	    // Only show module number if there's a label
	    if ( idx.label!=='') {
	        cardHtml = cardHtml.replace('{MODULE_NUM}',moduleNum);
	    } else {
	        cardHtml = cardHtml.replace('{MODULE_NUM}','');
	    }
	    cardHtml = cardHtml.replace('{LABEL}',idx.label);
	    cardHtml = cardHtml.replace(/{PIC_URL}/g, idx.picUrl);
	    cardHtml = cardHtml.replace('{TITLE}', idx.title);
	    // Get rid of some crud Bb inserts into the HTML
	    description = idx.description.replace(/<p/, '<p class="pb-2"');
	    description = description.replace(/<a/, '<a class="underline"');
	    cardHtml = cardHtml.replace('{DESCRIPTION}', description);
	    // Does the card link to another content item?
	    if ( idx.link ) {
	        // add the link
	        cardHtml = cardHtml.replace('{LINK_ITEM}', linkItemHtmlTemplate[template] );
	    } else {
	        // remove the link, as there isn't one
	        cardHtml = cardHtml.replace('{LINK_ITEM}', '');
	        cardHtml = cardHtml.replace(/<a href="{LINK}">/g,'');
	        cardHtml = cardHtml.replace('</a>','');
	        // remove the shadow/border effect
	        cardHtml = cardHtml.replace('hover:outline-none','');
	        cardHtml = cardHtml.replace('hover:shadow-outline', '');
	        // don't count it as a module
	        cardHtml = cardHtml.replace(idx.label + ' ' + moduleNum, '');
	        moduleNum--;
	    }
	    cardHtml = cardHtml.replace(/{LINK}/g, idx.link);
	    
	    // if there's a date, insert it
	    if ( idx.month ) {
	        cardHtml = cardHtml.replace('{DATE}', dateHtmlTemplate[template] );
	        cardHtml = cardHtml.replace(/{MONTH}/g, idx.month);
	        cardHtml = cardHtml.replace(/{DATE}/g, idx.date);
	        cardHtml = cardHtml.replace(/{DATE_LABEL}/g, idx.dateLabel);
	    } else {
	        cardHtml = cardHtml.replace('{DATE}', '');
	    }
	    cards = cards.concat(cardHtml);
	    moduleNum++;
	});
	
	// STick the cards into the complete card HTML
	var interfaceHtml = interfaceHtmlTemplate[template];
	interfaceHtml = interfaceHtml.replace('{CARDS}',cards);
	// Insert the HTML to the selected item(s)
	//return false;
	$(firstItem).append( interfaceHtml);
}
