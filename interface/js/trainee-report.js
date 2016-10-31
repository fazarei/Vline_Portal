/**
 * ...
 * @author S Hastwell
 */

(function() {
	var sortDataBy = 'name';
		
	// define the indexes of elements within the CSV

	var ind_id = 0,
		ind_name = 1,
		ind_group = 2,
		ind_stage = 3,
		ind_isChecklist = 4,
		ind_docid = 5,
		ind_docname = 6,
		ind_isComplete = 7,
		ind_tally = 8,
		ind_empNumb = 9;
		ind_numcomp = 13;
		
	var showChecklistsFor = function(userID, userName, empN) {
		// set the current trainee (who we're looking at)
		currentTrainee = {id:userID, name:userName, empNumber:empN};
		
		// go to the checklist summary screen
		screenManager.showScreen('checklistSummary');
	}
		
	var showAssessmentsFor = function(userID, userName, empN) {
		// set the current trainee (who we're looking at)
		currentTrainee = {id:userID, name:userName, empNumber:empN};
		
		// go to the assessment summary screen
		screenManager.showScreen('assessmentSummary');
	}
	
	var refreshTraineeData = function() {
		// get the current trainee info (from the DB, but returned as CSV)
		$.ajax({
			url: '../getinfo.php',
			type: 'POST',
			data: {mode: 'traineelistgroup'}
		})
		.done(function( text ) {
			log(text);
			
			traineeListData = $.csv.toArrays(text);
			
			updateList();
		})
		.fail(function(jqXHR, textStatus) {
			if(textStatus == 'abort') return;
			
			log('Error loading trainee data: '+jqXHR.status );
			
			// FOR LOCAL TESTING
			var testData = ''
				+ 'ishti2,Ishti2 Latif,group2,stage1,false,ass_1,assment 1,false\r\n'
				+ 'peter,Peter Hawkins,group1,stage2,false,ass_2,assessmentX,true\r\n'
				+ 'ishti,Ishti Latif,group1,stage2,true,chk_1,checklistY,false\r\n'
				+ 'ishti,Ishti Latif,group1,stage2,true,chk_2,checklistY2,false\r\n'
				+ 'ishti,Ishti Latif,group1,stage3,true,chk_3,checklistY3,true\r\n'
				+ 'ishti2,Ishti2 Latif,group2,stage2,false,ass_3,assY,true';
			traineeListData = $.csv.toArrays(testData)
			updateList();
			// END TESTING
		})




	}
	
	var updateList = function(sortOn) {
		var data = getTraineeListGroup;
		log("traineeListData : "+data);
		var chkassData = checklistAndAssessmentsData ; 
		
		var stageIDFilter = currentStage.id;
		//alert ("Current Stage : "+stageIDFilter);
		// TO_DO: get the totals from somewhere...
		
		var totalChecklists = 289;
		var totalAssessments = 13; 
		
		// clear the current table data
		$('table.trainee-list tr').each(function(index) {
			// keep the first row (titles), but remove the rest
			if(index > 0) $(this).remove();
		});

		
		// populate the data from the array into a table
		for(var i=0; i < data.length; i++) {
			var row = null,
				tableRow = null;
			//
			if(currentGroup.id) {
				// filter by group
				log('group: '+data[i][ind_group]+' - filter: '+currentGroup.id +" is " +(data[i][ind_group] == currentGroup.id) );
				if(data[i][ind_group] != currentGroup.id) continue;
			}
			
			if(currentStage.id) {
				// filter by stage
				log('stage: '+data[i][ind_stage]+' - filter: '+currentStage.id+" is " +(data[i][ind_stage] == currentStage.id ));
				if(data[i][ind_stage] != currentStage.id ) continue;
			}
			
			// check whether this entry is for an existing row
			for(var j=0; j < i; j++) {
					row = j;
					
					// find the row in the table for this entry
					$('table.trainee-list tr').each(function(index) {
						if($(this).attr('class') == data[i][ind_id]) tableRow = index;
					});
			}
			
			if(row == null || tableRow == null) {
				var toInsert = '<tr class="'+data[i][ind_id]+'" data-empNum="'+data[i][ind_empNumb]+'" >';
				toInsert += '<td class="name">'+data[i][ind_name]+'</td>';
				toInsert += '<td class="checklist"><a href="#" class="show-checklists" ><span class="checkVal">'+data[i][ind_docname]+'</span><span>'+'/'+totalChecklists+'</span></a></td>';
				toInsert += '<td class="assessment"><a href="#" class="show-assessments" ><span class="assVal">'+data[i][ind_isChecklist]+'</span><span>'+'/'+totalAssessments+'</span></a></td>';
				toInsert += '</tr>';
				
				$('table.trainee-list').append(toInsert);
			} 
		};
		
		// set up the click handlers 
		$('table.trainee-list td.checklist a').click(function(e) {
			e.preventDefault(); if($(this).hasClass('disabled')) return; 
			
			// get the user id
			var userID = $(this).parent().parent().attr('class');
			var empNumber = $(this).parent().parent().attr('data-userid');
			var userName = $(this).parent().parent().find('.name').text();
			//alert(empNumber);
			showChecklistsFor(userID, userName);
		});
		
		$('table.trainee-list td.assessment a').click(function(e) {
			e.preventDefault(); if($(this).hasClass('disabled')) return; 
			
			// get the user id
			var userID = $(this).parent().parent().attr('class');
			var userName = $(this).parent().parent().find('.name').text();
			
			showAssessmentsFor(userID, userName);
		});
		
		// disable any '0' value (as there's no list to show)
		$('table.trainee-list td a').each(function(index) {
			if($(this).text() == '0') $(this).enabled(false);
		});
		
		// update the text showing the current filters
		if(currentGroup.id || currentStage.id) {
			var filterText = '';
			if(currentGroup.id) filterText = '<b>Group:</b> '+currentGroup.name + '<span class="separator">&nbsp;</span>';
			if(currentStage.id) filterText += '<b>Stage:</b> '+currentStage.name;
			$('.current-filters').html(filterText);
			$('.current-filters').show();
		} else {
			$('.current-filters').hide();
		}

		var $rows = $('.trainee-list tr');
		$('#search').keyup(function() {
		    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
		    
		    $rows.show().filter(function() {
		        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
		        return !~text.indexOf(val);
		    }).hide();
		});

		$('.loding-anim').remove();
	}
	
	// set the change handlers for the 2 selects
	$('.select-group, .select-stage').change(function(e) {
		// enable the apply button
		$('.apply').enabled(true);
	});
	
	// set up the apply button's handler
	$('.apply').click(function(e) {
		e.preventDefault(); if($(this).hasClass('disabled')) return; 
		
		var groupName = $('.select-group option:selected').text();
		if($('.select-group').val() == '') groupName = 'Unspecified';
		var stageName = $('.select-stage option:selected').text();
		if($('.select-stage').val() == '') stageName = 'Unspecified';
		
		currentGroup = {id:$('.select-group').val(), name:groupName};
		
		currentStage = {id:$('.select-stage').val().substring(5,6), name:stageName};
		
		// disable the apply button
		$('.apply').enabled(false);
		
		updateList();
	});
	
	$('.sort').click(function(e) {
		e.preventDefault(); 
		if($(this).hasClass('disabled') || !traineeListData) return; 
		
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
			
			updateList(sortParam);
		}
	});
	
	// the apply button starts off disabled (until the selects change)
	$('.apply').enabled(false);
	
	if(groups.length == 0) {
		if(!groupArrays) {
			// temp
			log('using fake groups');
			var fakeResponse = 'group1,Group 1\r\ngroup2,Group 2\r\ngroup3,Group 3\r\ngroup4,Group 4';
			groupArrays = $.csv.toArrays(fakeResponse);
		}
		
		// populate the array and the select
		groups = [];
		for(var i = 0; i < groupArrays.length; i++) {
			var groupID = groupArrays[i][0];
			var groupName = groupArrays[i][1];
			
			groups.push({id:groupID, name:groupName});
			
			$('.select-group').append('<option value="'+groupID+'">'+groupName+'</option>');
		}
	} else {
		// populate the select
		for(var i = 0; i < groups.length; i++) {
			var groupID = groups[i].id;
			var groupName = groups[i].name;
			
			$('.select-group').append('<option value="'+groupID+'">'+groupName+'</option>');
		}
	}
	
	if(stages.length == 0) {
		if(!stageArrays) {
			// temp
			log('using fake stages');
			var fakeResponse = '1,stage1,Stage 1\r\n2,stage2,Stage 2\r\n3,stage3,Stage 3\r\n4,stage4,Stage 4';
			stageArrays = $.csv.toArrays(fakeResponse);
		}
		
		// populate the array and the select
		stages = [];
		for(var i = 0; i < stageArrays.length; i++) {
			var stageID = stageArrays[i][1];
			var stageName = stageArrays[i][2];
			
			stages.push({id:stageID, name:stageName});
			
			$('.select-stage').append('<option value="'+stageID+'">'+stageName+'</option>');
		}
	} else {
		// populate the select
		for(var i = 0; i < stages.length; i++) {
			var stageID = stages[i].id;
			var stageName = stages[i].name;
			
			$('.select-stage').append('<option value="'+stageID+'">'+stageName+'</option>');
		}
	}
	
	// update the filter values (if they'd been set previously)
	if(currentGroup.id) $('.select-group').val(currentGroup.id);
	if(currentStage.id) $('.select-stage').val(currentStage.id);
	
	if(traineeListData) {
		// use the data already obtained
		log('using trainee data from main.php');
		updateList();
	} else {
		log('getting the trainee data via ajax');
		refreshTraineeData();
	}
	
	
	
})();