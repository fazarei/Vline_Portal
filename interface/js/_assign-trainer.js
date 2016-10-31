/**
 * ...
 * @author S Hastwell
 */

(function() {
	var toggleRoleCheckbox = function(cb) {
		if(cb.hasClass('checked')) cb.removeClass('checked');
		else cb.addClass('checked');
		
		// get the user ID for the checkbox
		var parentTR = cb.parent().parent();
		var userID = parentTR.attr('class');
		var userName = parentTR.find('td.name').text();
		var role = cb.parent().attr('class');
		
		// update the trainer data
		var updated = false;
		for(var i=0; i < trainerAssessorListData.length; i++) {
			var tData = trainerAssessorListData[i];
			
			if(tData[0] == userID && (tData[3] == role || tData[3] == role+'-not')) {
				// update this entry
				if(cb.hasClass('checked')) {
					tData[3] = role;
				} else {
					// clear the role (but don't remove as we want it to stay in the list)
					tData[3] = role+'-not';
				}
				
				updated = true;
				
				break;
			}
			
		}
		
		if(!updated) {
			// there wasn't an existing entry, so we have to create one
			trainerAssessorListData.push([userID, userName, '', role])
		}
	}
	
	var refreshAssessorList = function() {
		// get the current trainer/assessor info (from the DB, but returned as CSV)
		$.ajax({
				url: '../getinfo.php',
				type: 'POST',
				data: {mode: 'trainerassessor'}
			})
			.done(function( text ) {
				trainerAssessorListData = $.csv.toArrays(text);
				
				updateList(trainerAssessorListData);
			})
			.fail(function(jqXHR, textStatus) {
				if(textStatus == 'abort') return;
				
				log('Error loading trainer/assessor CSV: '+jqXHR.status );
			})
	}
		
	var updateList = function(data, sortOn) {
		// clear the current table data
		$('table.trainer-list tr').each(function(index) {
			// keep the first row (titles), but remove the rest
			if(index > 0) $(this).remove();
		});
		
		// sort the data by the defined parameter
		switch(sortOn) {
			case 'trainer':
				data.sort(function(a, b) {
					return a[3] != 'trainer';
				});
				break;
			case 'assessor':
				data.sort(function(a, b) {
					return a[3] != 'assessor';
				});
				break;
			case 'name':
			default:
				data.sort(function(a, b) {
					return String(a[1]).toLowerCase() > String(b[1]).toLowerCase();
				});
				break;
		}
		
		// populate the data from the array into a table
		for(var i=0; i < data.length; i++) {
			var row = null;
			
			// check whether this entry is for an existing row
			$('table.trainer-list td.name').each(function(index) {
				if($(this).text() == data[i][1]) {
					// set the modifying index to this entry (+1 as we skipped over the title row)
					row = index + 1;
				}
			});
			
			if(!row) {
				var toInsert = '<tr class="'+data[i][0]+'">';
				toInsert += '<td class="name">'+data[i][1]+'</td>';
				toInsert += '<td class="trainer"><a class="checkbox'+(data[i][3] == 'trainer' ? ' checked' : '')+'" href="#">&nbsp;</a></td>';
				toInsert += '<td class="assessor"><a class="checkbox'+(data[i][3] == 'assessor' ? ' checked' : '')+'" href="#">&nbsp;</a></td>';
				toInsert += '</tr>';
				
				$('table.trainer-list').append(toInsert);
			} else {
				$('table.trainer-list tr').eq(row).find('td.'+data[i][3]+' a').addClass('checked');
			}
		};
		
		$('.checkbox').click(function(e) {
			e.preventDefault(); if($(this).hasClass('disabled')) return; 
			
			toggleRoleCheckbox($(this));
		});
	}
	
	var updateAndShowUserList = function(data) {
		// clear the current table data
		$('table.user-list tr').each(function(index) {
			// keep the first row (titles), but remove the rest
			if(index > 0) $(this).remove();
		});
		
		// sort the data alphabetically
		data.sort(function(a, b) {
			return String(a[1]).toLowerCase() > String(b[1]).toLowerCase();
		});
		
		// populate the data from the array into a table
		for(var i=0; i < data.length; i++) {
			var toInsert = '<tr class="'+data[i][0]+'">';
			toInsert += '<td class="name">'+data[i][1]+'</td>';
			toInsert += '<td class="add"><a class="checkbox" href="#">&nbsp;</a></td>';
			toInsert += '</tr>';
				
			$('table.user-list').append(toInsert);
		};
		
		$('.add .checkbox').click(function(e) {
			e.preventDefault(); if($(this).hasClass('disabled')) return; 
			
			if($(this).hasClass('checked')) $(this).removeClass('checked');
			else $(this).addClass('checked');
		});
		
		// show the dialog
		$('.user-list-dialog').dialog('open');
	}
	
	$('.user-list-dialog').dialog({
		autoOpen: false,
		width: $('.user-list-dialog').attr('width') ? $('.user-list-dialog').attr('width') : 450,
		modal: true,
		closeOnEscape: true,
		draggable: false,
		resizable: false,
		buttons: { 
			"Cancel": function() {
				$(this).dialog("close");
			},
			"Submit": function() {
				// TODO: add the selected users to the list
				log('Add users to list');
				$(this).find('.user-list tr').each(function(index) {
					// skip the first row (titles)
					if(index == 0) return;
					
					// get the user ID (stored in the tr's class)
					var userID = $(this).attr('class');
					var userName = $(this).find('td.name').text();
					
					if($(this).find('td.add a').hasClass('checked')) {
						// add this user to the trainer data
						trainerAssessorListData.push([userID, userName, '', 'trainer-not'])
						
						// add this user to the table
						var toInsert = '<tr class="'+userID+'">';
						toInsert += '<td class="name">'+userName+'</td>';
						toInsert += '<td class="trainer"><a class="checkbox" href="#">&nbsp;</a></td>';
						toInsert += '<td class="assessor"><a class="checkbox" href="#">&nbsp;</a></td>';
						toInsert += '</tr>';
							
						$('table.trainer-list tr.titles').after(toInsert);
						
						$('tr.'+userID+' .checkbox').click(function(e) {
							e.preventDefault(); if($(this).hasClass('disabled')) return; 
							
							toggleRoleCheckbox($(this));
						});
					}
				});
				
				$(this).dialog("close");
			}
		}
	});
	
	$('.user-list-empty-dialog').dialog({
		autoOpen: false,
		width: $('.user-list-empty-dialog').attr('width') ? $('.user-list-empty-dialog').attr('width') : 450,
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
	
	$('.submit-successful-dialog').dialog({
		autoOpen: false,
		width: $('.submit-successful-dialog').attr('width') ? $('.submit-successful-dialog').attr('width') : 450,
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
	
	$('.submit-error-dialog').dialog({
		autoOpen: false,
		width: $('.submit-error-dialog').attr('width') ? $('.submit-error-dialog').attr('width') : 450,
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
	
	$('.sort').click(function(e) {
		e.preventDefault(); 
		if($(this).hasClass('disabled') || !trainerAssessorListData) return; 
		
		// add 'active' class, and remove from the other options
		$('.sort.active').removeClass('active');
		$(this).addClass('active');
		
		// get the parameter to sort by
		var startIndex,
			endIndex,
			classString = $(this).attr('class');
			
		startIndex = classString.indexOf('sort-by-');
		if(startIndex > -1) {
			endIndex = classString.indexOf(' ', startIndex);
			var sortParam = classString.substring(startIndex+8, (endIndex == -1) ? classString.length : endIndex);
			
			updateList(trainerAssessorListData, sortParam);
		}
	});
	
	$('.submit').click(function(e) {
		e.preventDefault(); 
		if($(this).hasClass('disabled') || !trainerAssessorListData) return; 
		
		// send the current state of the table to the DB
		var newCSV = '';
		$('table.trainer-list tr').each(function(index) {
			// skip the first row (titles)
			if(index == 0) return;
			
			// get the user ID (stored in the tr's class)
			var userID = $(this).attr('class');
			
			// add entries to CSV
			if($(this).find('td.trainer a').hasClass('checked')) newCSV += userID+',trainer\r\n';
			if($(this).find('td.assessor a').hasClass('checked')) newCSV += userID+',assessor\r\n';
		});
		
		// send the data
		$.ajax({
			url: '../getinfo.php',
			type: 'POST',
			data: {mode: 'settrainerassessor', data: newCSV}
		})
		.done(function( text ) {
			log('submit response: '+text);
			
			if(text == 'Insert Error') {
				// show an error dialog
				$('.submit-error-dialog').dialog('open');
			} else {
				// show a confirmation dialog
				$('.submit-successful-dialog').dialog('open');
			}
		})
		.fail(function(jqXHR, textStatus) {
			if(textStatus == 'abort') return;
			
			log('Error setting new roles: '+jqXHR.status );
		})
	});
	
	$('.add-users').click(function(e) {
		e.preventDefault(); 
		if($(this).hasClass('disabled') || !trainerAssessorListData) return;
		
		// get a list of the current users (so we can exclude them from the list that is returned)
		var currentIDs = '';
		$('table.trainer-list tr').each(function(index) {
			// skip the first row (titles)
			if(index == 0) return;
			
			// get the user ID (stored in the tr's class)
			var userID = $(this).attr('class');
			
			if(currentIDs != '') currentIDs += ',';
			currentIDs += userID;
		});
		
		// send the request
		$.ajax({
			url: '../getinfo.php',
			type: 'POST',
			data: {mode: 'users', excludes: currentIDs}
		})
		.done(function( text ) {
			var userData = $.csv.toArrays(text);
			
			if(userData.length > 0) {
				// display a dialog with the user list and selection checkboxes
				updateAndShowUserList(userData);
			} else {
				$('.user-list-empty-dialog').dialog('open');
			}
			
			log('get users response: '+text);
		})
		.fail(function(jqXHR, textStatus) {
			if(textStatus == 'abort') return;
			
			log('Error loading user list from EKP: '+jqXHR.status );
		})
	});
	
	/*
	// FOR LOCAL TESTING
	var testData = 'ishti,Ishti Latif,92377117,trainer\r\npeter,Peter Hawkins,92377117,assessor\r\naishti,aIshti Latif,92377117,assessor\r\nbishti,bIshti Latif,92377117,assessor\r\ndishti,dIshti Latif,92377117,trainer\r\nishti,Ishti Latif,92377117,assessor';
	trainerAssessorListData = $.csv.toArrays(testData)
	updateList(trainerAssessorListData);
	// END TESTING
	*/
	
	if(trainerAssessorListData) {
		log('using trainer/assessor list from main.php');
		updateList(trainerAssessorListData);
	} else {
		refreshAssessorList();
	}
	
  // custom css expression for a case-insensitive contains()
  jQuery.expr[':'].Contains = function(a,i,m){
      return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
  };

  function listFilter(header, list) { // header is any element, list is an unordered list
    // create and add the filter form to the header
    var form = $("<form>").attr({"class":"filterform","action":"#"}),
        input = $("<input>").attr({"class":"filterinput","type":"text"});
    $(form).append(input).appendTo(header);

    $(input)
      .change( function () {
        var filter = $(this).val();
        if(filter) {
          // this finds all links in a list that contain the input,
          // and hide the ones not containing the input while showing the ones that do
          $(list).find(".name:not(:Contains(" + filter + "))").parent().slideUp();
          $(list).find(".name:Contains(" + filter + ")").parent().slideDown();
        } else {
          $(list).find("tr").slideDown();
        }
        return false;
      })
    .keyup( function () {
        // fire the above change event after every letter
        $(this).change();
        //console.log("asd");
    });
  }

  //ondomready
   listFilter($("#filterholder"), $("#userlist"));
 
	
})();