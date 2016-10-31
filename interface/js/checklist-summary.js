/**
 * ...
 * @author S Hastwell
 */

(function() {
	var sortDataBy = 'name';
	
	// define the indexes of elements within the CSV
		// user1,User1 Student,EKP000003216,7,true,1.14.82.03,Testing 26L brake valve,false,
	var ind_id = 0,
		ind_name = 1,
		ind_group = 2,
		ind_stage = 3,
		ind_isChecklist = 4,
		ind_docid = 5,
		ind_docname = 6,
		ind_isComplete = 7,
		ind_tally = 8;
		ind_stagedesc = 9;
		ind_rpl = 10;
		ind_trainerinstruction = 11;
		ind_assessor = 12;
		
	var showChecklist = function() {
		// go to the checklist screen (special case for stage 9)
		if(currentChecklist.stage == 'stage-9') screenManager.showScreen('checklist-stage9');
		else screenManager.showScreen('checklist');
	}
	
	//

	if(currentTrainee.id) $('.trainee-number').html(currentTrainee.id);
	log("Add condition (Farzaneh):  "+currentTrainee.id);
	//
	
	var updateList = function(sortOn) {
		var data = traineeListData;
		
		// clear the current table data
		$('table.checklist-list tr').each(function(index) {
			// keep the first row (titles), but remove the rest
			if(index > 0) $(this).remove();
		});
		
		/*if(!sortOn) sortOn = sortDataBy;
		else sortDataBy = sortOn;
		
		// sort the data by the defined parameter
		switch(sortOn) {
			case 'inprocess':
				log('sort by in process');
				data.sort(function(a, b) {
					return a[ind_isComplete] != 'false';
				});
				break;
			case 'completed':
				log('sort by comp ' +data.length);
				data.sort(function(a, b) {
					return a[ind_isComplete] != 'true';
				});
				break;
			case 'name':
			default:
				data.sort(function(a, b) {
					return String(a[ind_docname]).toLowerCase() > String(b[[ind_docname]]).toLowerCase();
				});
				break;
		}*/
		
		// populate the data from the array into a table
		for(var i=0; i < data.length; i++) {
			if(data[i][ind_isChecklist] != 'true') continue;
			//filter only Completed
			//if(data[i][ind_isComplete] != 'true') continue;
			if(currentGroup.id) {
				// filter by group
				if(data[i][ind_group] != currentGroup.id) continue;
			}
			if(currentStage.id) {
				// filter by stage
				if(data[i][ind_stage] != currentStage.id) continue;
			}
			
			//Add condition (Farzaneh)
			if(currentTrainee.id) {
				// filter by stage
				if(data[i][ind_id] != currentTrainee.id) continue;
			}
			//log("a1="+a+"b1:"+b);
				//Farzaneh
				var toInsert = '<tr class="id-'+data[i][ind_docid]+' stage-'+data[i][ind_stage]+'">';
				toInsert += '<td class="docid"><a class="show-checklist-id name-'+data[i][ind_docname]+'" href="#">'+data[i][ind_docid]+'</a></td>';
				toInsert += '<td class="name"><a class="show-checklist name-'+data[i][ind_docname]+'" href="#">'+data[i][ind_docname]+'</a></td>';
				toInsert += '<td class="stage"><a class="show-checklist name-'+data[i][ind_stage]+'" href="#">'+data[i][ind_stagedesc]+'</a></td>';
				if(data[i][ind_rpl] == 'true')
				{
						toInsert += '<td class="inprocess"></td>';
						toInsert += '<td class="inprocess"></td>';
						toInsert += '<td class="completed"></td>';
						toInsert += '<td class="completed"><span class="tick"><img src="../interface/css/images/tick.png" /></span></td>';
				}
				else
				{
						/*toInsert += '<td class="inprocess"></td>';
						toInsert += '<td class="inprocess">'+(data[i][ind_isComplete] == 'false' ? '<span class="tick"><img src="../interface/css/images/tick.png" /></span>' : '')+'</td>';
						toInsert += '<td class="completed">'+(data[i][ind_isComplete] == 'true' ? '<span class="tick"><img src="../interface/css/images/tick.png" /></span>' : '')+'</td>';
						toInsert += '<td class="completed"></td>';*/
						if(data[i][ind_isComplete] == 'true')
						{
							toInsert += '<td class="inprocess"></td>';
							toInsert += '<td class="inprocess"></td>';
							toInsert += '<td class="completed"><span class="tick"><img src="../interface/css/images/tick.png" /></span></td>';
							toInsert += '<td class="completed"></td>';
						}
						else
						{
							if(data[i][ind_trainerinstruction] != '' || data[i][ind_assessor]!='')
							{
								toInsert += '<td class="inprocess"></td>';
								toInsert += '<td class="inprocess"><span class="tick"><img src="../interface/css/images/tick.png" /></span></td>';
								toInsert += '<td class="completed"></td>';
								toInsert += '<td class="completed"></td>';
							}
							else
							{
								toInsert += '<td class="inprocess"><span class="tick"><img src="../interface/css/images/tick.png" /></span></td>';
								toInsert += '<td class="inprocess"></td>';
								toInsert += '<td class="completed"></td>';
								toInsert += '<td class="completed"></td>';
							}

						}
				}

				toInsert += '</tr>';

			//
			
			$('table.checklist-list').append(toInsert);
		};
		
		// set up the click handlers 
		$('table.checklist-list td.name a, table.checklist-list td.docid a').click(function(e) {
			e.preventDefault(); if($(this).hasClass('disabled')) return; 
			
			var startIndex,
				endIndex,
				classString = $(this).parent().parent().attr('class');
			
			// get the doc ID
			var docID;
			startIndex = classString.indexOf('id-');
			if(startIndex > -1) {
				endIndex = classString.indexOf(' ', startIndex);
				docID = classString.substring(startIndex+3, (endIndex == -1) ? classString.length : endIndex);
			}
			
			// get the doc stage
			var docStage;
			startIndex = classString.indexOf('stage-');
			if(startIndex > -1) {
				endIndex = classString.indexOf(' ', startIndex);
				docStage = classString.substring(startIndex+6, (endIndex == -1) ? classString.length : endIndex);
			}
			
			// get the stage name (using the ID)
			var docStageName;
			for(var s=0; s < stages.length; s++) {
				log('stages[s].id: '+stages[s].id);
				if(stages[s].id == docStage) {
					docStageName = stages[s].name;
					break;
				}
			}
			
			// get the doc name
			var docName = $(this).text();
			var t = $(this).attr('class').split('name-');
			docName = t[1];
			
			currentChecklist = {id:docID, name:docName, stage:docStage, stageName:docStageName};
			
			showChecklist();
		});
		
		var $rows = $('.checklist-list tr');
		$('#search').keyup(function() {
		    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
		    
		    $rows.show().filter(function() {
		        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
		        return !~text.indexOf(val);
		    }).hide();
		});
		
	}
	
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
	
	// update the details for the current selections (user, group, stage)
	if(currentTrainee.name) $('.current-trainee').html(currentTrainee.name);
	if(currentGroup.name) $('.current-group').html(currentGroup.name);
	if(currentStage.name) $('.current-stage').html(currentStage.name);
	
	updateList();
})();