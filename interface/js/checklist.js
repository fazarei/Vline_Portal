/**
 * ...
 * @author S Hastwell
 */

(function() {
	//ConductedTrainer-0, TrainerSignature-1, Date-2, DayOrNight-3, WeatherCondition-4, Location-5, From-6, To-7, TrainLength-8, Tonnage-9, NoOfVehicles-10
	var ind_conductedTrainer = 0,
		ind_trainerSignature = 1,
		ind_data = 2,
		ind_dayOrNight = 3,
		ind_weatherCondition = 4,
		ind_location = 5,
		ind_from = 6,
		ind_to = 7,
		ind_trainLength = 8,
		ind_tonnage = 9,
		ind_noOfVehicles = 10;
		
	//Instructed,Task,ValueA,ValueB,ValueC,ValueD,ValueE,ValueF
	var ind_instructed = 0,
		ind_task = 1,
		ind_value1 = 2,
		ind_value2 = 3,
		ind_value3 = 4,
		ind_value4 = 5,
		ind_value5 = 6,
		ind_value6 = 7;
	
	// checklist Data Holder
	var checklistHeaderData = '';
	var checklistData = '';
	
	
	// update the details for the current selections (user, group, stage)
	if(currentTrainee.name) $('.current-trainee').html(currentTrainee.name);
	//if(currentTrainee.id) $('.trainee-number').html(currentTrainee.id);
	if(currentChecklist.id) $('.doc-id').html(currentChecklist.id);
	if(currentChecklist.name) $('.doc-name').html(currentChecklist.name);
	if(currentChecklist.stage) $('.doc-stage').html(currentChecklist.stage);
	if(currentChecklist.stageName) $('.doc-stageName').html(currentChecklist.stageName);
	
	
	
	var retrieveChecklistData = function() {
		//alert("Test");
		//alert("start : "+currentChecklist.id+"  "+currentTrainee.id );
		// get the current trainee info (from the DB, but returned as CSV)
		$.ajax({
			url: '../getinfo.php',
			type: 'POST',
			data: {mode: 'checklistdata', trainee : ''+currentTrainee.id , checklistid : ''+currentChecklist.id }
		})
		.done(function( text ) {
			log(text);
			//alert(text);
			checklistHeaderData = $.csv.toArrays(text);
			
			
			log("Test Print : "+checklistHeaderData[2][1]);
			checklistHeaderPlot();

		})
		.fail(function(jqXHR, textStatus) {
				if(textStatus == 'abort') return;
				
				log('Error loading trainee data: '+jqXHR.status );
				
				// FOR LOCAL TESTING
				var testData = ''
					+ 'ConductedTrainer1,TrainerSignature1,Date1,DayOrNight1,WeatherCondition1,Location1,From1,To1,TrainLength1,Tonnage1,NoOfVehicles1\r\n'
					+ 'ConductedTrainer2,TrainerSignature2,Date2,DayOrNight2,WeatherCondition2,Location2,From2,To2,TrainLength2,Tonnage2,NoOfVehicles2\r\n'
					+ 'ConductedTrainer3,TrainerSignature3,Date3,DayOrNight3,WeatherCondition3,Location3,From3,To3,TrainLength3,Tonnage3,NoOfVehicles3\r\n';
					+ 'EmpNumber00,Objective,,,,,,,,,';
				checklistHeaderData = $.csv.toArrays(testData);
				// END TESTING
		})
			
		//alert(checklistHeaderData);
		
		// get the current trainee info (from the DB, but returned as CSV)
		$.ajax({
			url: '../getinfo.php',
			type: 'POST',
			data: {mode: 'checklisttask', trainee : ''+currentTrainee.id , checklistid : ''+currentChecklist.id }
		})
		.done(function( text ) {
			log(text);
			
			checklistData = $.csv.toArrays(text);
			
			
			
			checklistTaskPlot();
			
		})
		.fail(function(jqXHR, textStatus) {
			if(textStatus == 'abort') return;
			
			log('Error loading trainee data: '+jqXHR.status );
			
			// FOR LOCAL TESTING
			var testData = ''
				+ 'checked,Task,ValueA,ValueB,ValueC,ValueD,ValueE,ValueF\r\n'
				+ 'Instructed,Task,ValueA,ValueB,ValueC,checked,ValueE,ValueF\r\n'
				+ 'Instructed,Task,ValueA,ValueB,ValueC,checked,checked,ValueF\r\n'
				+ 'checked,Task,ValueA,ValueB,checked,ValueD,ValueE,ValueF\r\n'
				+ 'checked,Task,ValueA,ValueB,ValueC,ValueD,ValueE,checked\r\n'
				+ 'checked,Task,ValueA,ValueB,ValueC,checked,ValueE,ValueF';
			
			checklistData = $.csv.toArrays(testData)
			
			//checklistInfoPlot();
			// END TESTING
		})
		//FOR LOCAL TESTING
		/*var testData1 = ''
					+ 'ConductedTrainer1,TrainerSignature1,Date1,DayOrNight1,WeatherCondition1,Location1,From1,To1,TrainLength1,Tonnage1,NoOfVehicles1\r\n'
					+ 'ConductedTrainer2,TrainerSignature2,Date2,DayOrNight2,WeatherCondition2,Location2,From2,To2,TrainLength2,Tonnage2,NoOfVehicles2\r\n'
					+ 'ConductedTrainer3,TrainerSignature3,Date3,DayOrNight3,WeatherCondition3,Location3,From3,To3,TrainLength3,Tonnage3,NoOfVehicles3\r\n'
					+ 'EmpNumber00,Objective,Corridor down,Corridor up,Trainee name,12-03-10,Trainer name,Trainer checked,13-03-10,,';
				
			checklistHeaderData = $.csv.toArrays(testData1);
			
			checklistHeaderPlot();
			var testData2 = ''
				+ 'checked,Task,ValueA,ValueB,ValueC,ValueD,ValueE,ValueF\r\n'
				+ 'Instructed,Task,ValueA,ValueB,ValueC,checked,ValueE,ValueF\r\n'
				+ 'Instructed,Task,ValueA,ValueB,ValueC,checked,checked,ValueF\r\n'
				+ 'checked,Task,ValueA,ValueB,checked,ValueD,ValueE,ValueF\r\n'
				+ 'checked,Task,ValueA,ValueB,ValueC,ValueD,ValueE,checked\r\n'
				+ 'checked,Task,ValueA,ValueB,ValueC,checked,ValueE,ValueF';
			
			checklistData = $.csv.toArrays(testData2);
			checklistTaskPlot();
		*/
		    //checklistInfoPlot();

	}
	
	
	var checklistHeaderPlot = function() {
		
		var headerData = checklistHeaderData ;
		
		
		//alert("Data : "+(headerData.length));
		
			//INSTRUCTION Header Section
			$('.instruction-trainer').html(headerData[0][ind_conductedTrainer]);
			$('.instruction-date').html(headerData[0][ind_data]);
			$('.instruction-daynight').html(headerData[0][ind_dayOrNight]);
			$('.instruction-weather').html(headerData[0][ind_weatherCondition]);
			$('.instruction-loco').html(headerData[0][ind_location]);
			$('.instruction-from').html(headerData[0][ind_from]);
			$('.instruction-to').html(headerData[0][ind_to]);
			$('.instruction-unit').html(headerData[0][ind_trainLength]);
			$('.instruction-tonnage').html(headerData[0][ind_tonnage]);
			$('.instruction-vehicles').html(headerData[0][ind_noOfVehicles]);
			
			//GUIDED PRACTICE Header Section 
			$('.guided-trainer').html(headerData[1][ind_conductedTrainer]);
			$('.guided-date').html(headerData[1][ind_data]);
			$('.guided-daynight').html(headerData[1][ind_dayOrNight]);
			$('.guided-weather').html(headerData[1][ind_weatherCondition]);
			$('.guided-loco').html(headerData[1][ind_location]);
			$('.guided-from').html(headerData[1][ind_from]);
			$('.guided-to').html(headerData[1][ind_to]);
			$('.guided-unit').html(headerData[1][ind_trainLength]);
			$('.guided-tonnage').html(headerData[1][ind_tonnage]);
			$('.guided-vehicles').html(headerData[1][ind_noOfVehicles]);
			
			//UNGUIDED PRACTICE Header Section
			$('.unguided-trainer').html(headerData[2][ind_conductedTrainer]);
			$('.unguided-date').html(headerData[2][ind_data]);
			$('.unguided-daynight').html(headerData[2][ind_dayOrNight]);
			$('.unguided-weather').html(headerData[2][ind_weatherCondition]);
			$('.unguided-loco').html(headerData[2][ind_location]);
			$('.unguided-from').html(headerData[2][ind_from]);
			$('.unguided-to').html(headerData[2][ind_to]);
			$('.unguided-unit').html(headerData[2][ind_trainLength]);
			$('.unguided-tonnage').html(headerData[2][ind_tonnage]);
			$('.unguided-vehicles').html(headerData[2][ind_noOfVehicles]);
			$('.unguided-preformed').html(headerData[2][(ind_noOfVehicles+1)]);//unguided preformed
			//Checklist Header Objec and Emp Nuber 
			//$('.trainee-number').html();
			$('.doc-objective').html(headerData[3][1]);
			$('.doc-loco-type').html(headerData[3][0]);
			
			//Extra info data
			$('.corri-down').html(headerData[3][2]);
			$('.corri-up').html(headerData[3][3]);
			//Farzaneh
			$('.trainee-number').html(headerData[3][9]);
			
			//Checklist Footer info
			if(headerData[3][4]=="true"){
				$('.receive-trainee-sign a').addClass("checked");
			}else{
				$('.receive-trainee-sign a').removeClass("checked");
			}
			if(headerData[3][6]=="true"){
				$('.receive-trainer-sign a').addClass("checked");
			}else{
				$('.receive-trainer-sign a').removeClass("checked");
			}
			//$('.receive-trainee-sign').html(headerData[3][4]);
			$('.receive-trainee-date').html(headerData[3][5]);
			$('.receive-trainer-name').html(headerData[3][8]);
			//$('.receive-trainer-sign').html(headerData[3][6]);
			$('.receive-trainer-date').html(headerData[3][7]);
			
	}
	
	var checklistTaskPlot = function() {	
		var data = checklistData ;
		// populate the data from the array into a table
		for(var i=0; i < data.length; i++) {
		
			var toInsert = '<tr>';
			toInsert += '<td class="instructed"><a href="#" class="checkbox blocked '+data[i][ind_instructed]+'"></td>';
			toInsert += '<td class="task">'+data[i][ind_task]+'</td>';
			toInsert += '<td class="guide_practice"><a href="#" class="checkbox blocked '+data[i][ind_value1]+'"></a></td>';
			toInsert += '<td class="guide_practice"><a href="#" class="checkbox blocked '+data[i][ind_value2]+'"></a></td>';
			toInsert += '<td class="guide_practice"><a href="#" class="checkbox blocked '+data[i][ind_value3]+'"></a></td>';
			toInsert += '<td class="unguide_practice"><a href="#" class="checkbox blocked '+data[i][ind_value4]+'"></a></td>';
			toInsert += '<td class="unguide_practice"><a href="#" class="checkbox blocked '+data[i][ind_value5]+'"></a></td>';
			toInsert += '<td class="unguide_practice"><a href="#" class="checkbox blocked '+data[i][ind_value6]+'"></a></td>';
			toInsert += '</tr>';
			
			$('table.checklist-table').append(toInsert);
				
		}

	}


  retrieveChecklistData();
	
})();