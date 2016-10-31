var $structure,
	currentTrainee = {},
	currentGroup = {},
	currentStage = {},
	currentChecklist = {},
	currentAssessment = {};
	
// define the groups and stages
var groups = [];
var stages = [];
	

var loadStructure = function() {
	// load the XML structure (loaded as text and parsed, so treated the same in IE & FF)
	$.ajax({
		url: 'xml/structure.xml',
		cache: false,
		dataType: 'text'
	})
	.done(function( data ) {
		log('XML structure loaded');
		$structure = $($.parseXML(data));
		
		init();
	})
	.fail(function() {
		log('error loading structure XML');
	})
};

var updateInterface = function(param) {
	if(!param) param = screenManager.currentScreenData;
	
	if(!param) return;
	
	// check whether we should see the menu items
	if(!course.loggedIn) {
		$('.main-menu-container, .sec-menu-container').addClass('hidden');
	} else if($('.main-menu-container').hasClass('hidden')) {
		$('.main-menu-container, .sec-menu-container').removeClass('hidden');
	}
	
	// check which section we're in, and highlight the appropriate menu item
	var sectionID = screenManager.currentScreenData.parent().attr('id');
	$('.main-menu-container #'+sectionID).addClass('current');
	$('.main-menu-container a').not('.main-menu-container #'+sectionID).removeClass('current');
	
	// update the section/screen title
	var sectionTitle = screenManager.currentScreenData.parent().children('title');
	if(screenManager.currentScreenData.children('title').length > 0) {
		// the screen's title overrides the section's one
		sectionTitle = screenManager.currentScreenData.children('title');
	}
	if(sectionTitle.text().length > 0) $('.section-title').html('<h1>'+sectionTitle.text()+'</h1>').removeClass('hidden');
	else $('.section-title').addClass('hidden');
	
	// check whether interface buttons should be enabled
	$('#logout-btn').enabled(course.loggedIn);
	if(param.attr('showLogoutBtn') == 'false' || !course.loggedIn) $('#logout-btn').addClass('hidden').enabled(false);
	else if($('#logout-btn').hasClass('hidden')) $('#logout-btn').removeClass('hidden');
	
	$('#menu-btn').enabled(param.attr('id') != 'mainmenu');
	if(param.attr('showMenuBtn') == 'false') $('#menu-btn').addClass('hidden').enabled(false);
	else if($('#menu-btn').hasClass('hidden')) $('#menu-btn').removeClass('hidden');
};

var updateDialog = function(dialog, ui) {
	if (window.PIE) {
		var dialogPanel = dialog.parent();
		
		// make sure the dialog's components have the PIE class
		utils.applyPIEToDialog(dialogPanel);
		
		// update the depth of the overlay (so it's below the PIE fix in IE8)
		$('.ui-widget-overlay').css('z-index', '999');
	}
};

var applyDialog = function(context) {
	$('.dialog', context).each(function() {
		$(this).dialog({
			dialogClass: 'dialog-revealed ui-tooltip pie',
			autoOpen: false,
			width: $(this).attr('width') ? $(this).attr('width') : 450,
			modal: true,
			closeOnEscape: true,
			draggable: true,
			resizable: false,
			buttons: { 
				"Close": function() {
					$(this).dialog("close");
				}
			}
		});
		
		$(this).bind("dialogopen", function(event, ui) {
			updateDialog($(this), ui);
		});
		
		$(this).bind("dialogclose", function(event, ui) {
			var dialogPanel = $(this).parent();
		});
	});
}

var applyGenericClick = function(context) {
	// look for some class-defined actions
	$('.standard-button', context)
		.click(function(e) {
			if(!$(this).hasClass('allow-default') && !$(this).hasClass('disabled')) e.preventDefault(); 
			if($(this).hasClass('disabled')) return; 
			
			var startIndex,
				endIndex,
				classString = $(this).attr('class');
			
			// changing screen
			startIndex = classString.indexOf('goto-');
			if(startIndex > -1) {
				endIndex = classString.indexOf(' ', startIndex);
				var screenId = classString.substring(startIndex+5, (endIndex == -1) ? classString.length : endIndex);
				
				screenManager.showScreen(screenId);
			}
			
			// showing a dialog
			startIndex = classString.indexOf('dialog-');
			if(startIndex > -1) {
				endIndex = classString.indexOf(' ', startIndex);
				var dialogId = classString.substring(startIndex+7, (endIndex == -1) ? classString.length : endIndex);
				
				$('#'+dialogId).dialog('open');
			}
			
			// hiding screen elements
			startIndex = classString.indexOf('hideElement-');
			if(startIndex > -1) {
				endIndex = classString.indexOf(' ', startIndex);
				var hideClass = classString.substring(startIndex+5, (endIndex == -1) ? classString.length : endIndex);
				
				$('.'+hideClass).fadeOut();
			}
			
			// showing screen elements (independent of click-reveals, which can only have 1 shown)
			startIndex = classString.indexOf('showElement-');
			if(startIndex > -1) {
				endIndex = classString.indexOf(' ', startIndex);
				var showClass = classString.substring(startIndex+5, (endIndex == -1) ? classString.length : endIndex);
				
				$('.'+showClass).removeClass('hidden').fadeIn();
			}
			
			// add a class to the clicked button
			startIndex = classString.indexOf('addClass-');
			if(startIndex > -1) {
				endIndex = classString.indexOf(' ', startIndex);
				var addClass = classString.substring(startIndex+9, (endIndex == -1) ? classString.length : endIndex);
				
				if(!$(this).hasClass(addClass)) $(this).addClass(addClass);
			}
			
			// disable elements
			startIndex = classString.indexOf('disable-');
			if(startIndex > -1) {
				endIndex = classString.indexOf(' ', startIndex);
				var disableClass = classString.substring(startIndex+8, (endIndex == -1) ? classString.length : endIndex);
				
				$('.'+disableClass).enabled(false);
			}
			
			// enable elements
			startIndex = classString.indexOf('enable-');
			if(startIndex > -1) {
				endIndex = classString.indexOf(' ', startIndex);
				var enableClass = classString.substring(startIndex+7, (endIndex == -1) ? classString.length : endIndex);
				
				$('.'+enableClass).enabled(true);
			}
		});
}

var applyClickReveal = function(context) {
	$('.reveal', context).addClass('hidden');	
	$('.click-reveal', context)
		.click(function(e) {
			e.preventDefault(); if($(this).hasClass('disabled')) return; 
			
			// get the ID of the selected element
			var clickID = $(this).attr('id');
			
			// mark this element as having been clicked
			$(this).addClass('clicked');
			
			if(!$(this).hasClass('allow-multiple')) {
				// hide all reveal content 
				$('.reveal', context).addClass('hidden');
				
				$('.click-reveal', context).not($(this)).removeClass('selected').enabled(true);
				
				// disable the selected element
				if(!$(this).hasClass('open-dialog')) $(this).enabled(true);
			} else if($(this).hasClass('selected')) {
				// need to un-select this element
				$(this).removeClass('selected');
				
				if(clickID) {
					// hide any element with the class 'reveal-{clickID}'
					$('.reveal-'+clickID, context).addClass('hidden');
				}
				
				return;
			}
			
			if($(this).hasClass('show-tick') && $('.tick', $(this)).length == 0) {
				// add a tick
				$(this).append('<div class="tick"><span class="hidden">Tick</span></div>');
			}
			
			// mark the current element as selected
			$(this).addClass('selected');
			
			if(clickID) {
				// show any element with the class 'reveal-{clickID}'
				$('.reveal-'+clickID, context).removeClass('hidden').addClass('shown');
			}
			
			if($(this).hasClass('open-dialog')) {
				$('.dialog.reveal-'+clickID).dialog('open');
			}
			
			if(screenManager.currentScreenData.attr('disableNext') == 'true') {
				// check whether all click-reveals have been clicked
				if($('.click-reveal', context).not('.clicked').length == 0) {
					screenManager.currentScreenData.setValue('disableNext', 'false');
					screenManager.currentScreenData.attr('disableNext', 'false');
					
					// enable the Next button and show the prompt
					utils.updateNavigation(true);
				}
			}
		})
		.removeClass('selected');
};

var hideElement = function(element) {
	element.removeClass('visible');
	
	if(element.hasClass('fade')) element.fadeOut();
	else element.addClass('hidden');
}

var showElement = function(element) {
	element.removeClass('hidden').addClass('visible');
	
	if(element.hasClass('fade')) element.fadeIn(1500);
}

var init = function() {
	// apply hover states to any standard buttons in the interface
	utils.applyStates();
	
	var initialScreen = $structure.find('data').attr('initialScreen');
	if(!initialScreen) initialScreen = 'login';
	
	// show the first screen
	screenManager.showScreen(initialScreen);
};

var onScreenChange = function(event, param) {
	log('screen change: '+(param ? param.attr('id') : '?'));
	if($('.debug .screen-id')) $('.debug .screen-id').html((param ? param.attr('id') : '?'));
	
	// apply any dialogs
	applyDialog($('.screen-content'));
	
	// apply a generic click handler
	applyGenericClick($('.screen-content'));
	
	// apply any click/reveal functionality
	applyClickReveal($('.screen-content'));
	
	updateInterface(param);
};

// Starting point
(function () {
	log('version: '+config.version);
	
	$('#navigation-container a').not('.logout').click(function(e) {
		e.preventDefault(); if($(this).hasClass('disabled')) return; 
		
		// get the ID of the target screen
		var scnID = $(this).attr('href').split('#').pop();
		screenManager.showScreen(scnID);
	});
	
	$('.logout').click(function(e) {
		e.preventDefault(); if($(this).hasClass('disabled')) return; 
		
		// TBD - log out the user
		course.loggedIn = false;
		/*
		var afterLogoutID = $structure.find('data').attr('afterLogout');
		if(afterLogoutID) screenManager.showScreen(afterLogoutID);
		*/
		
		// for now, just redirect to the login page
		//window.location = 'index.php';
		console.log("Logout");
		window.location = 'logout.php';
	
		// clear the history
		screenManager.clearHistory();
	});
	
	// listen to the screen change event
	events.bind(events.SCREEN_CHANGE, onScreenChange);
	
	// bind some dialog actions
	$('.dialog').bind("dialogopen", function(event, ui) {
		// stop any audio
		//$('audio, video').pause();
		
		updateDialog($(this), ui);
	});
	
	$('.dialog').bind("dialogclose", function(event, ui) {
		if (window.PIE) {
			var dialogPanel = $(this).parent();
			
			// may be needed to reset the state of some elements...
		}
	});
	
	loadStructure();
	
	utils.applyPIE();
}) ();

