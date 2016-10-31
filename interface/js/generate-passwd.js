/**
 * ...
 * @author S Hastwell
 */

(function() {
	
	var IsValidEmail = function(email) {
		var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return regex.test(email);
	}
	
	var isValidUserID = function(userid) {
		var regex = /^[a-zA-Z0-9_]{6,18}$/;
		return regex.test(userid);
	}
	
	var generatePassword = function(userID, email, isTrainer, isAssessor) {
		log('userID: '+userID);
		
		// let the user know we're waiting on a password
		var displayText = 'Generating password ...';
		if($('.password-display td').length > 0) $('.password-display td').html(displayText);
		else $('table.password').append('<tr class="password-display"><td>'+displayText+'</td></tr>');
		
		$('.password-display').hide().fadeIn(200);
		
		// send the request
		$.ajax({
			url: '../getinfo.php',
			type: 'POST',
			data: {mode: 'generatepasswd', userid: userID, email:email, trainer:isTrainer, assessor:isAssessor }
		})
		.done(function( text ) {
			log('generated password: '+text);
			
			// display the password on screen
			displayText = 'Temporary password: <span class="highlight">'+text+'</span>';
			if(text == 'No Record Found' || text.indexOf('HTTP Status') > -1) displayText = 'Failed to generate a password.<br/>Try again later.';
			
			// display the password on screen
			$('.password-display td').html(displayText);
		})
		.fail(function(jqXHR, textStatus) {
			if(textStatus == 'abort') return;
			
			log('Error generating a password on the server: '+jqXHR.status );
			
			// display the password on screen
			displayText = 'Failed to generate a password.<br/>Try again later.';
			$('.password-display td').html(displayText);
		})
	}
	
	$('td.email input').change(function(e) {
		if($(this).is(':checked')) $('#email').removeAttr('disabled');
		else $('#email').attr('disabled', 'disabled');
	});
	
	$('#usrname').focus(function(e) {
		// show the guide
		$('.guide').removeClass('hidden');
	})
		.focusout(function(e) {
			// hide the guide
			$('.guide').addClass('hidden');
		})
		.keydown(function() {
			// hide any previous password, as it no longer applies
			if($('.password-display').length > 0) $('.password-display').fadeOut(200);
		});
	
	$('.password-button').click(function(e) {
		e.preventDefault(); if($(this).hasClass('disabled')) return; 
		
		// first validate the user name
		if(!isValidUserID($('#usrname').val())) {
			$('.invalid-userid').dialog('open');
			return;
		}
		
		if($('td.email input').is(':checked')) {
			// validate the email address
			if(!IsValidEmail($('#email').val())) {
				$('.invalid-email').dialog('open');
				return;
			}
		}
		//alert (($('.isTrainer').is(':checked') ? '7' :'0')+($('.isAssessor').is(':checked') ? '4' : '0' ));
		// generate a password based on the user ID
		generatePassword($('#usrname').val(), ($('td.email input').is(':checked') ?$('#email').val() : ''),($('.isTrainer').is(':checked') ? '7' :'0'), ($('.isAssessor').is(':checked') ? '4' : '0' ));
	});
	
	$('.invalid-userid').dialog({
		autoOpen: false,
		width: $('.invalid-userid').attr('width') ? $('.invalid-userid').attr('width') : 450,
		modal: true,
		closeOnEscape: true,
		draggable: false,
		resizable: false,
		buttons: { 
			"OK": function() {
				$(this).dialog("close");
			}
		}
	});
	
	$('.invalid-email').dialog({
		autoOpen: false,
		width: $('.invalid-email').attr('width') ? $('.invalid-email').attr('width') : 450,
		modal: true,
		closeOnEscape: true,
		draggable: false,
		resizable: false,
		buttons: { 
			"OK": function() {
				$(this).dialog("close");
			}
		}
	});
})();