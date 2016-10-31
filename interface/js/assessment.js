/**
 * ...
 * @author S Hastwell
 */

(function() {
	
	var assessmentXmlData;
	var xmlData;
	// update the details for the current selections (user, group, stage)
	if(currentTrainee.name) $('.current-trainee').html(currentTrainee.name);
	if(currentAssessment.id) $('.doc-id').html(currentAssessment.id);
	if(currentAssessment.name) $('.doc-name').html(currentAssessment.name);
	if(currentAssessment.stage) $('.doc-stageID').html(currentAssessment.stage);
	if(currentAssessment.stageName) $('.doc-stageName').html(currentAssessment.stageName);
	
	var retrieveAssessmentData = function() {
		
		log("Stage N: "+currentAssessment.stage+" Assessment ID "+currentAssessment.id+"Name "+currentTrainee.id);
		// get the current trainee info (from the DB, but returned as CSV)
		
		$.ajax({
			url: '../getinfo.php',
			type: 'POST',
			data: {mode: 'assessmentdetail',trainee : ''+currentTrainee.id ,  assessmentid : ''+currentAssessment.id , stageid : ''+currentAssessment.stage}
		})
		.done(function( text ) {
			log("XML from Function : "+text + "End");
			
			xmlData = $.parseXML( text );
			assessmentXmlData = $(xmlData);
			assessmentMaker();
		})
		.fail(function(jqXHR, textStatus) {
				if(textStatus == 'abort') return;
				
				log('Error loading trainee data: '+jqXHR.status );
				
		})
		
			// FOR LOCAL TESTING
			//var testxmlData = '<Assessment> <Info> <Stage>9</Stage> <AssessmentNo>6</AssessmentNo> </Info> <Header> <TraineeName>Novice to Ninja</TraineeName> <EmployeeNo>Site point</EmployeeNo> <Location>Australia</Location> <Date>12/05/2013</Date> <AssessorName>Fernando</AssessorName> <PerformanceSet> <Subject> <SubName>Train Management</SubName> <SubObjective>Given a field situation authorised line speeds, curve </SubObjective> <SubTotal>56</SubTotal> <SubRequired>48</SubRequired> <SubAchieved>75</SubAchieved> </Subject> <Subject> <SubName>Locomotive Assistant Duties</SubName> <SubObjective>Given a field situation the Trainee line speeds, curve </SubObjective> <SubTotal>56</SubTotal> <SubRequired>48</SubRequired> <SubAchieved>75</SubAchieved> </Subject> </PerformanceSet> <AssessmentResult>checked</AssessmentResult> <AssessorInfo> <AssSignature>Ishti</AssSignature><AssDate>04/08/2011</AssDate> <TraSignature>Hasanda</TraSignature><TraDate>03/07/2009</TraDate> </AssessorInfo> <MainComment>Main General Comments</MainComment> </Header> <AssessmentDetails> <AssessEntry> <TripNo>1</TripNo> <TripTime>10.45</TripTime> <TripOrigin>Victoria</TripOrigin> <TripDes>Service revenue</TripDes> <TripTDNo>123</TripTDNo> <TripMPUType>55</TripMPUType> <TripMPUNo>78</TripMPUNo> <TripWeather>Hot</TripWeather> </AssessEntry> <AssessEntry> <TripNo>2</TripNo> <TripTime>15.45</TripTime> <TripOrigin>Novay</TripOrigin> <TripDes>Service Check</TripDes> <TripTDNo>153</TripTDNo> <TripMPUType>75</TripMPUType> <TripMPUNo>44</TripMPUNo> <TripWeather>Cold</TripWeather> </AssessEntry> </AssessmentDetails> <TimeDuration> <TDEntry> <TimeNo>Head First jQuery</TimeNo> <Minutes>120</Minutes> <Signals>R</Signals> <Delays>45</Delays> <PermanentWay>High</PermanentWay> <Track>86</Track> <Faults>Error01</Faults> <Other>Other Stuff</Other> <Explanation>Sample Explanation</Explanation> </TDEntry> <TDEntry> <TimeNo>Head Second jQuery</TimeNo> <Minutes>150</Minutes> <Signals>L</Signals> <Delays>85</Delays> <PermanentWay>Low</PermanentWay> <Track>70</Track> <Faults>Error07</Faults> <Other>Other and Stuff</Other> <Explanation>Sample Explanation to be done</Explanation> </TDEntry> <ArrivalTimeA>65</ArrivalTimeA> <TimeLostB>89</TimeLostB> <TimeDriverA>Driver A</TimeDriverA> <TimeDriverB>Driver B</TimeDriverB> </TimeDuration> <Competencies> <CompetSet> <CompTitel>Train Management Competencies</CompTitel> <Comment>Competencies General Comment</Comment> <CompeEntry> <Checklist>1.14.84.40</Checklist> <Description>Sprinter Over The Road Operation</Description> <Critical>C</Critical> <ValueD>Yes</ValueD> <ValueE>No</ValueE> <ValueNYC>Yes</ValueNYC> </CompeEntry> <CompeEntry> <Checklist>1.14.64.50</Checklist> <Description>Sprinter Over The Road Operation</Description> <Critical>C</Critical> <ValueD>No</ValueD> <ValueE>No</ValueE> <ValueNYC>Yes</ValueNYC> </CompeEntry> </CompetSet> <RouteComp> <RouteComment>Route General Comment</RouteComment> <RouteEntry> <Checklist>1.14.64.50</Checklist> <Description>Sprinter Over The Road Operation</Description> <Critical>C</Critical> <ValueD>No</ValueD> <ValueE>No</ValueE> <ValueNYC>Yes</ValueNYC> </RouteEntry> </RouteComp> </Competencies> </Assessment>';
			
		//	var testxmlData = '<Assessment> <Header> <CorporateNo></CorporateNo> <HeadAssessor>Peter Hawkins</HeadAssessor> <HeaderDate>06/06/2013</HeaderDate> <Objective>The objective of this assessment is to monitor the progress of the Trainee and to ensure they have the level of skills and knowledge required to be passed as a competent Train Driver </Objective> <OverallComp>checked</OverallComp> <AssessSign>checked</AssessSign> <AssessSignDate></AssessSignDate> <AgreeAssessmentTrainee>checked</AgreeAssessmentTrainee> <MainComment></MainComment> </Header> <SubReportTable> <SubReportTitel>Train Preparation &amp; Yard Operations</SubReportTitel> <SubReportObjec>Successful completion of this assessment requires the Trainee to demonstrate competency and proficiency in the task activities and knowledge required to prepare a locomotive and complete yard operations.</SubReportObjec> <SubRepTable> </SubRepTable> <SubRepList> </SubRepList> <SubRepComment></SubRepComment> <SubRepCompetentLevel>checked</SubRepCompetentLevel> <SubRepNotCompetentLevel>unchecked</SubRepNotCompetentLevel> <SubRepAssessorSign>unchecked</SubRepAssessorSign> <SubRepTraineeSign>unchecked</SubRepTraineeSign> </SubReportTable> <SubReportTable> <SubReportTitel>Train Management (South West Corridor)</SubReportTitel> <SubReportObjec>Successful completion of this assessment requires the Trainee must demonstrate competency and proficiency in the task activities and knowledge required to manage the train.</SubReportObjec> <SubRepTable> </SubRepTable> <SubRepList> </SubRepList> <SubRepComment></SubRepComment> <SubRepCompetentLevel>checked</SubRepCompetentLevel> <SubRepNotCompetentLevel>unchecked</SubRepNotCompetentLevel> <SubRepAssessorSign>unchecked</SubRepAssessorSign> <SubRepTraineeSign>unchecked</SubRepTraineeSign> </SubReportTable> <SubReportTable> <SubReportTitel>Train Management (Western Corridor)</SubReportTitel> <SubReportObjec>Successful completion of this assessment requires the Trainee must demonstrate competency and proficiency in the task activities and knowledge required to manage the train.</SubReportObjec> <SubRepTable> </SubRepTable> <SubRepList> </SubRepList> <SubRepComment></SubRepComment> <SubRepCompetentLevel>checked</SubRepCompetentLevel> <SubRepNotCompetentLevel>unchecked</SubRepNotCompetentLevel> <SubRepAssessorSign>unchecked</SubRepAssessorSign> <SubRepTraineeSign>unchecked</SubRepTraineeSign> </SubReportTable> <SubReportTable> <SubReportTitel>Train Management (Northern Corridor)</SubReportTitel> <SubReportObjec>Successful completion of this assessment requires the Trainee must demonstrate competency and proficiency in the task activities and knowledge required to manage the train.</SubReportObjec> <SubRepTable> </SubRepTable> <SubRepList> </SubRepList> <SubRepComment></SubRepComment> <SubRepCompetentLevel>checked</SubRepCompetentLevel> <SubRepNotCompetentLevel>unchecked</SubRepNotCompetentLevel> <SubRepAssessorSign>unchecked</SubRepAssessorSign> <SubRepTraineeSign>unchecked</SubRepTraineeSign> </SubReportTable> <SubReportTable> <SubReportTitel>Train Management (Northeast Corridor - Broad Gauge)</SubReportTitel> <SubReportObjec>Successful completion of this assessment requires the Trainee must demonstrate competency and proficiency in the task activities and knowledge required to manage the train.</SubReportObjec> <SubRepTable> </SubRepTable> <SubRepList> <SubRepEntry> <Task>Use of Network Service Plan</Task> <Demonstrated>checked</Demonstrated> <Explained>unchecked</Explained> <Competent>unchecked</Competent> </SubRepEntry> <SubRepEntry> <Task>Weekly Operational notices</Task> <Demonstrated>checked</Demonstrated> <Explained>unchecked</Explained> <Competent>unchecked</Competent> </SubRepEntry> <SubRepEntry> <Task>Train documentation</Task> <Demonstrated>checked</Demonstrated> <Explained>unchecked</Explained> <Competent>unchecked</Competent> </SubRepEntry> <SubRepEntry> <Task>Safeworking authority, procedures</Task> <Demonstrated>unchecked</Demonstrated> <Explained>checked</Explained> <Competent>unchecked</Competent> </SubRepEntry> <SubRepEntry> <Task>Dangerous goods</Task> <Demonstrated>unchecked</Demonstrated> <Explained>checked</Explained> <Competent>unchecked</Competent> </SubRepEntry> <SubRepEntry> <Task>Throttle </Task> <Demonstrated>unchecked</Demonstrated> <Explained>checked</Explained> <Competent>unchecked</Competent> </SubRepEntry> <SubRepEntry> <Task>Throttle </Task> <Demonstrated>checked</Demonstrated> <Explained>unchecked</Explained> <Competent>unchecked</Competent> </SubRepEntry> </SubRepList> <SubRepComment></SubRepComment> <SubRepCompetentLevel>checked</SubRepCompetentLevel> <SubRepNotCompetentLevel>unchecked</SubRepNotCompetentLevel> <SubRepAssessorSign>unchecked</SubRepAssessorSign> <SubRepTraineeSign>unchecked</SubRepTraineeSign> </SubReportTable> <SubReportTable> <SubReportTitel>Train Management (Northeast Corridor - Standard Gauge)</SubReportTitel> <SubReportObjec>Successful completion of this assessment requires the Trainee must demonstrate competency and proficiency in the task activities and knowledge required to manage the train.</SubReportObjec> <SubRepTable> </SubRepTable> <SubRepList> </SubRepList> <SubRepComment></SubRepComment> <SubRepCompetentLevel>checked</SubRepCompetentLevel> <SubRepNotCompetentLevel>unchecked</SubRepNotCompetentLevel> <SubRepAssessorSign>unchecked</SubRepAssessorSign> <SubRepTraineeSign>unchecked</SubRepTraineeSign> </SubReportTable> <SubReportTable> <SubReportTitel>Train Management (Eastern Corridor)</SubReportTitel> <SubReportObjec>Successful completion of this assessment requires the Trainee must demonstrate competency and proficiency in the task activities and knowledge required to manage the train.</SubReportObjec> <SubRepTable> </SubRepTable> <SubRepList> </SubRepList> <SubRepComment></SubRepComment> <SubRepCompetentLevel>checked</SubRepCompetentLevel> <SubRepNotCompetentLevel>unchecked</SubRepNotCompetentLevel> <SubRepAssessorSign>unchecked</SubRepAssessorSign> <SubRepTraineeSign>unchecked</SubRepTraineeSign> </SubReportTable> <SubReportTable> <SubReportTitel>Stabling Trains &amp; Fault Finding</SubReportTitel> <SubReportObjec></SubReportObjec> <SubRepTable> <SubReportEntry> <Date>13/05/2013</Date> <Tasks></Tasks> <Assessor>peter</Assessor> <Unit></Unit> <Location></Location> </SubReportEntry> <SubReportEntry> <Date></Date> <Tasks></Tasks> <Assessor>peter</Assessor> <Unit></Unit> <Location></Location> </SubReportEntry> <SubReportEntry> <Date></Date> <Tasks></Tasks> <Assessor>peter</Assessor> <Unit></Unit> <Location></Location> </SubReportEntry> <SubReportEntry> <Date>03/06/2013</Date> <Tasks></Tasks> <Assessor>peter</Assessor> <Unit></Unit> <Location></Location> </SubReportEntry> <SubReportEntry> <Date></Date> <Tasks></Tasks> <Assessor>peter</Assessor> <Unit></Unit> <Location></Location> </SubReportEntry> </SubRepTable> <SubRepList> </SubRepList> <SubRepComment></SubRepComment> <SubRepCompetentLevel>checked</SubRepCompetentLevel> <SubRepNotCompetentLevel>unchecked</SubRepNotCompetentLevel> <SubRepAssessorSign>unchecked</SubRepAssessorSign> <SubRepTraineeSign>unchecked</SubRepTraineeSign> </SubReportTable> <SubReportTable> <SubReportTitel>Operate Yard Pilot</SubReportTitel> <SubReportObjec></SubReportObjec> <SubRepTable> </SubRepTable> <SubRepList> </SubRepList> <SubRepComment></SubRepComment> <SubRepCompetentLevel>checked</SubRepCompetentLevel> <SubRepNotCompetentLevel>unchecked</SubRepNotCompetentLevel> <SubRepAssessorSign>unchecked</SubRepAssessorSign> <SubRepTraineeSign>unchecked</SubRepTraineeSign> </SubReportTable> </Assessment>';
			
			/*'<Competencies><CompetSet><CompTitel>Train Management Competencies</CompTitel><Comment>General Comment</Comment><CompeEntry><Checklist>1.14.84.40</Checklist><Description>Sprinter Over The Road Operation</Description><Critical>C</Critical><ValueD>Yes</ValueD><ValueE>No</ValueE><ValueNYC>Yes</ValueNYC></CompeEntry><CompeEntry><Checklist>1.14.64.50</Checklist><Description>Sprinter Over The Road Operation</Description><Critical>E</Critical><ValueD>No</ValueD><ValueE>No</ValueE><ValueNYC>Yes</ValueNYC></CompeEntry></CompetSet><CompetSet><CompTitel>Management Competencies</CompTitel><Comment>General Comment 02</Comment><CompeEntry><Checklist>1.24.54.40</Checklist><Description>Over The Road Operation</Description><Critical>D</Critical><ValueD>Yes</ValueD><ValueE>No</ValueE><ValueNYC>No</ValueNYC></CompeEntry><CompeEntry><Checklist>1.14.74.50</Checklist><Description>Sprinter Over The Road Operation</Description><Critical>K</Critical><ValueD>No</ValueD><ValueE>No</ValueE><ValueNYC>Yes</ValueNYC></CompeEntry></CompetSet></Competencies>';*/
			
			//log("XML Loading start")
			//xmlData = $.parseXML(testxmlData);
			//assessmentXmlData = $(xmlData);
			//log("XML Loading Done")
			// END TESTING
			
			//currentAssessment.stage = '10';
		
			//assessmentMaker();

	}
	
	var assessmentMaker = function() {
		var assessmentHTML = '';
		var xml = assessmentXmlData;
		
		if( currentAssessment.stage != '10'){
			
			// ***** Header Table Genarator START
			if($(xml).find('HeadAssessor')){
				 
				var aTitle = $(this).find('CompTitel').text();
			     
			     
			     var tmpTbl = '<table class=" full-width table-fix1"><tr><td class="td-color">Trainee Name: </td><td>'+currentTrainee.name+'</td><td class="td-color">Employee No :</td><td> '+$(xml).find("Employeeno").text()+'</td></tr><tr><td class="td-color">Location : </td><td>'+$(xml).find("Location").text()+'</td><td class="td-color">Date : </td><td>'+$(xml).find("Date").text()+'</td></tr> <tr><td class="td-color">Assessor : </td><td colspan="3">'+$(xml).find("AssessorName").text()+'</td></tr></table>';
			     
			     assessmentHTML += tmpTbl;
			
			}
            //Header Table Genarator END
            
            
			// ****** Performance Table Genarator START
			if ($(xml).find('Subject')){
				assessmentHTML += '<h3>1.Overall Performance</h3>';
				var vTot = 0, vReq  =0 , vAch = 0;
				
					var tbl = '<table class="full-width table-fix1"><tr class="tb-header"><td>Subject</td><td colspan="3">Competencies</td></tr>';
					$(xml).find('Subject').each(function(){
						var cTitle = $(this).find('SubName').text();
				     	
				     	tbl += '<tr><td><strong>'+cTitle+'</strong></td><td><strong>Total</strong></td><td><strong>Required</strong></td><td><strong>Achieved</strong></td></tr>';
				     	tbl += '<tr><td>'+$(this).find('SubObjective').text()+'</td> <td>'+$(this).find('SubTotal').text()+'</td> <td>'+$(this).find('SubRequired').text()+'</td> <td>'+$(this).find('SubAchieved').text()+'</td></tr>';
				     	
				     	vTot = vTot + parseInt($(this).find('SubTotal').text());
				     	vReq = vReq + parseInt($(this).find('SubRequired').text());
				     	vAch = vAch + parseInt($(this).find('SubAchieved').text());
				     	
					});
					if(!vTot){ vTot = 0};
					if(!vReq){ vReq = 0};
					if(!vAch){ vAch = 0};
					if(!$(xml).find('Subject').length){
						tbl += '<tr><td colspan="4">No Records Found</td></tr>';
					}
					tbl += '<tr><td><strong>Total</strong></td> <td>'+vTot+'</td> <td>'+vReq+'</td> <td>'+vAch+'</td></tr>';
					tbl += '</table>';
					assessmentHTML = assessmentHTML +tbl ;
				
			}
			//Performance Table Genarator END
			
			// ***** Assessment Result Table Genarator START
			if ($(xml).find('AssessmentResult')){
				
				var result;
				
				if($(xml).find('AssessmentResult').text() =='checked'){ result = 'Competent'}else { result = 'Not Competent'};
				var tmp1 = '<table class="full-width table-fix1"><tr  ><td class="td-color">Assessment Result</td><td>'+result+'</td></tr></table>';
				assessmentHTML = assessmentHTML +tmp1 ;
				
			}
			//Assessment Result Table Genarator END
			
			// ***** Assessor Info  Table Genarator START
			if ($(xml).find('AssessorInfo')){
				var tmp2;
					tmp2 = '<table class="full-width table-fix1"><tr><td class="td-color">Assessor signature : </td><td><a href="#" class="checkbox '+$(xml).find('AssSignature').text()+'"></a></td><td class="td-color">Date : </td><td>'+$(xml).find('AssDate').text()+'</td></tr>';
					tmp2 += '<tr><td class="td-color">Trainee signature : </td><td><a href="#" class="checkbox '+$(xml).find('TraSignature').text()+'"></a></td><td class="td-color">Date : </td><td>'+$(xml).find('TraDate').text()+'</td></tr></table>';
					assessmentHTML = assessmentHTML +tmp2 ;
			}
			// Assessor InfoTable Genarator END
			
			// ***** General Comments  Table Genarator START
			if ($(xml).find('MainComment')){
				var tmpComment , tmp3 ;
					tmpComment = $(xml).find('MainComment').text();
					tmp3 = '<table class="full-width table-fix1"><tr class="tb-header" ><td>General Comments</td></tr><tr><td>'+tmpComment+'</td></tr></table>';
					assessmentHTML = assessmentHTML +tmp3 ;
			}
			// General Comments Genarator END
			
			// ***** Assessment Details Table Genarator START
			
			if($(xml).find('AssessEntry')){
					assessmentHTML += '<h3>Assessment Details</h3>';
				     var tmpTable = '<table class="full-width table-fix1">';
				     tmpTable += '<tr class="tb-header" ><td>Trip No.</td><td>Time</td><td>Origin/Location</td><td>Destination</td><td>T.D. No</td><td>MPU Type</td><td>MPU No.</td><td>Weather Conditions</td></tr>';
		  			 $(xml).find('AssessEntry').each(function (){
				      	 tmpTable += '<tr><td>'+$(this).find("TripNo").text()+'</td> <td>'+$(this).find("TripTime").text()+'</td> <td>'+$(this).find("TripOrigin").text()+'</td> <td>'+$(this).find("TripDes").text()+'</td><td>'+$(this).find("TripTDNo").text()+'</td><td>'+$(this).find("TripMPUType").text()+'</td><td>'+$(this).find("TripMPUNo").text()+'</td><td>'+$(this).find("TripWeather").text()+'</td></tr>';
				     });
				     //alert($(xml).find('AssessEntry').length);
				     if($(xml).find('AssessEntry').length == 0){
						tmpTable += '<tr><td colspan="8" align="center"><i>No Records Found</i></td></tr>';
					  }
				     tmpTable +='<tr><td colspan="2">MPU Type Key:</td><td colspan="2">L = Locomotive</td><td colspan="2">S = Sprinter</td><td colspan="2">V = VLocity</td></tr></table>';
				     assessmentHTML = assessmentHTML+tmpTable ;    
			}
			//Assessment Details Table Genarator END
			
			
			// ***** Time lost during running Table Genarator START
			if($(xml).find('TDEntry')){
				
					var totTime = 0, totLost = 0;
				     assessmentHTML += '<h3>Time lost during running</h3>';
				     var tmpTable = '<table class="full-width table-fix1 timeLostDuringTable"><tr class="tb-header" ><td colspan="9" style="text-align: center;">REASON</td></tr>';
				     tmpTable += '<tr class="tb-header" ><td>Trip No.</td><td>Minutes Lost(per trip)</td><td>Signals</td><td>Passenger Delays</td><td>Permanent Way Signals</td><td>Track Works</td><td>Train Faults</td><td>Other</td><td>Explanation</td></tr>';
					 $(xml).find('TDEntry').each(function (){
				      	tmpTable += '<tr><td>'+$(this).find("TimeNo").text()+'</td> <td>'+$(this).find("Minutes").text()+'</td> <td>'+$(this).find("Signals").text()+'</td> <td>'+$(this).find("Delays").text()+'</td><td>'+$(this).find("PermanentWay").text()+'</td><td>'+$(this).find("Track").text()+'</td><td>'+$(this).find("Faults").text()+'</td><td>'+$(this).find("Other").text()+'</td><td>'+$(this).find("Explanation").text()+'</td></tr>';
				      	if(parseInt ($(this).find("Minutes").text())){
				      		totTime = totTime +parseInt ($(this).find("Minutes").text());
				      	}
				      	
				      	//alert(totTime)
				      	totLost = totLost + ((parseInt($(this).find("Signals").text())) ? parseInt($(this).find("Signals").text()) : 0)
				      						+ ((parseInt($(this).find("Delays").text())) ? parseInt($(this).find("Delays").text()) : 0)
				      						+ ((parseInt($(this).find("PermanentWay").text())) ? parseInt($(this).find("PermanentWay").text()) : 0)
				      						+ ((parseInt($(this).find("Track").text())) ? parseInt($(this).find("Track").text()) : 0)
				      						+ ((parseInt($(this).find("Faults").text())) ? parseInt($(this).find("Faults").text()) : 0)
				      						+ ((parseInt($(this).find("Other").text())) ? parseInt($(this).find("Other").text()) : 0);
				      	//totLost = totLost + parseInt($(this).find("Signals").text())+ parseInt($(this).find("Delays").text())+ parseInt($(this).find("PermanentWay").text())+ parseInt($(this).find("Track").text())+ parseInt($(this).find("Faults").text())+ parseInt($(this).find("Other").text());
				     });
				     
				     if($(xml).find('TDEntry').length == 0){
						tmpTable += '<tr><td colspan="9" align="center"><i>No Records Found</i></td></tr>';
					  }
					  
					  if(!totTime){ totTime = 0};
					if(!totLost){ totLost = 0};
					
				    tmpTable += '<tr><td rowspan="2"><strong>Total</strong></td><td rowspan="2">&nbsp;</td><td colspan="3"><p align="right">Time over scheduled arrival time = <span>'+totTime+'</span> (a)</p></td><td rowspan="2"><p>Trainee Driver</p><p>Total Time lost</p></td><td colspan="3" rowspan="2"><p>=<span>'+totTime+'</span>(a) - <span>'+totLost+'</span>(b) = <span>'+(totTime-totLost)+'</span></p></td></tr><tr><td colspan="3"><p align="right">Total time lost = <span>'+totLost+'</span> (b)</p></td></tr>';
				     tmpTable +='</table>';
				     assessmentHTML = assessmentHTML+tmpTable ;   
					 
					 
			   
			}
			
			//Time lost during runningTable Genarator END
			
	
			// ***** Competencies Table Genarator START
			if($(xml).find('CompetSet')){
				
				$(xml).find('CompetSet').each(function(){
					
				//log($(this).find('CompTitel').text());
			     var cTitle = $(this).find('CompTitel').text();
			     assessmentHTML += '<h3>'+cTitle+'</h3>';
			      
			     var tmpTable = '<table class="chklist full-width table-fix1">';
			      tmpTable += '<tr class="tb-header" ><td>Workplace Checklist </td><td>Completed</td><td>RPL</td><td>Task Description</td><td>Critical</td><td>D</td><td>E</td><td>NYC</td></tr>';
			      
			      var cComment = $(this).find('Comment').text();
			      
			      $(this).find('CompeEntry').each(function (){
			      	 
			      	 tmpTable += '<tr><td>'+$(this).find("Checklist").text()+'</td><td><a href="#" class="checkbox '+$(this).find("Completed").text()+'"></a></td><td><a href="#" class="checkbox '+$(this).find("RPL").text()+'"></a></td><td>'+$(this).find("Description").text()+'</td> <td>'+$(this).find("Critical").text()+'</td> <td><a href="#" class="checkbox '+$(this).find("ValueD").text()+'"></a></td> <td><a href="#" class="checkbox '+$(this).find('ValueE').text()+'"></a></td> <td><a href="#" class="checkbox '+$(this).find('ValueNYC').text()+'"></a></td></tr>';
			      
			      });
			      if($(this).find('CompeEntry').length == 0){
						tmpTable += '<tr><td colspan="6" align="center"><i>No Records Found</i></td></tr>';
					  }
			      tmpTable +='</table>';
			      
			      assessmentHTML = assessmentHTML+tmpTable ;
			      
			      if($(this).find('Comment'))
			      	assessmentHTML += '<h3>Comments and recommendations</h3><table class="comments full-width"><tr><td>'+cComment+'</td></tr></table>';
			      	
			    });
			}
			//Competencies Table Genarator END
			
			// ***** Route Knowledge Competencies Table Genarator START
			if($(xml).find('RouteEntry').length){
				
			     assessmentHTML += '<h3>Route Knowledge Competencies</h3>';
			     var tmpTable = '<table class="full-width table-fix1">';
			     tmpTable += '<tr class="tb-header" ><td>Workplace Checklist Completed</td><td>Task Description</td><td>Critical</td><td>D</td><td>E</td><td>NYC</td></tr>';
				 $(xml).find('RouteEntry').each(function (){
			      	tmpTable += '<tr><td>'+$(this).find("Checklist").text()+'</td> <td>'+$(this).find("Description").text()+'</td> <td>'+$(this).find("Critical").text()+'</td> <td>'+$(this).find("ValueD").text()+'</td><td>'+$(this).find("ValueE").text()+'</td><td>'+$(this).find("ValueNYC").text()+'</td></tr>';
			      });
			      if($(xml).find('RouteEntry').length == 0){
						tmpTable += '<tr><td colspan="6" align="center"><i>No Records Found</i></td></tr>';
					  }
			      tmpTable +='</table>';
			      
			      assessmentHTML = assessmentHTML+tmpTable ;   
			      
			      if($(xml).find('RouteComment'))
			      	assessmentHTML += '<h3>Comments and recommendations</h3><table class="comments full-width"><tr><td>'+$(xml).find('RouteComment').text()+'</td></tr></table>';
			}
			//Route Knowledge Competencies Table Genarator END
		
		}else {
			log("Assessment 10 Printer")
			// ***** Header Table Genarator START
			if($(xml).find('HeadAssessor')){ 
				
				var cTitle = $(this).find('CompTitel').text();
			     assessmentHTML = '';
			     
			     var tpTbl = '<table class="chklist full-width table-fix1"><tr><td>Trainee : '+currentTrainee.name+'</td><td>Corporate No : '+currentTrainee.id+'</td><td>Date : '+$(xml).find("HeaderDate").text()+'</td></tr> <tr><td>Assessor : '+$(xml).find("HeadAssessor").text()+'</td><td>Corporate No : '+$(xml).find("CorporateNo").text()+'</td><td></td></tr></table>';
			     
			     assessmentHTML += tpTbl;
	
			     tpTbl = '<table class=" full-width table-fix1"><tr><td>Objective</td></tr><tr><td>'+$(xml).find("Objective").text()+'</td></tr></table>';
				
				$(xml).find('ReportTable').each(function(){
					
			     var tmpTable = '<table class=" full-width table-fix1">';
			      tmpTable +=   '<tr class="tb-header" ><td></td><td colspan="2"><p>PROFICIENCY LEVEL</p></td></tr><tr class="tb-header"><td><p>Task Activities</p></td><td><p>Competent</p></td><td><p>Not Yet Competent </p></td></tr>';
			      
			      var cComment = $(xml).find('MainComment').text();
			      
			      $(this).find('TaskAct').each(function (){
			      	var competent='', uncompetent='' ;
			      	if($(this).find("TaskCompetent").text() == 'checked'){
			      		competent = 'checked';
			      	}else { uncompetent = 'checked'; }
			      	
			      	tmpTable += '<tr><td>'+$(this).find("TaskName").text()+'</td><td><a href="#" class="checkbox '+competent+'">&nbsp;</a></td> <td><a href="#" class="checkbox '+uncompetent+'">&nbsp;</a></td></tr>';
			      
			      });
			      if($(this).find('TaskAct').length == 0){
						tmpTable += '<tr><td colspan="3" align="center"><i>No Records Found</i></td></tr>';
					  }
			      
			      tmpTable +='</table>';
			      
			      assessmentHTML = assessmentHTML+tmpTable ;
			      
			      if($(xml).find('MainComment'))
			      	assessmentHTML += '<h3>Comments </h3><table class="comments full-width"><tr><td>'+cComment+'</td></tr></table>';
			      	
			    });
			    
			}
			//Header Table Genarator END
			
			//***** Overall Competency Genarator Start
				
				assessmentHTML += '<h3>Overall Competency </h3>';
				var competent='', uncompetent='' ;
		      	if($(xml).find("OverallComp").text() == 'checked'){
		      		competent = 'checked';
		      	}else { uncompetent = 'checked'; }
				 tmpTable = '<table class="chklist full-width table-fix1">';
				tmpTable += '<tr><td><strong style="float: left;">COMPETENT </strong><a href="#" class="checkbox '+competent+'" style="float: left; margin-left: 40px;">&nbsp;</a></td><td><strong style="float: left;">NOT YET COMPETENT </strong><a href="#" style="float: left; margin-left: 40px;" class="checkbox '+uncompetent+' ">&nbsp;</a></td> </tr>';
				tmpTable += '<tr><td><strong style="float: left;">Assessor (Signature) : </strong><a href="#" style="float: left; margin-left: 40px;" class="checkbox '+$(xml).find("AssessSign").text()+'"> </a></td><td><strong>Date  : </strong>'+$(xml).find("AssessSignDate").text()+'</td></tr><tr><td colspan="2"><strong style="float: left;">Comment : </strong>' +$(xml).find("MainComment").text()+'</td></tr>';
				
				tmpTable +='</table>';
			    assessmentHTML = assessmentHTML+tmpTable ;
			    
			    tmpTable = '<table class="chklist full-width table-fix1">';
				tmpTable += '<tr><td><strong style="float: left;">I agree with the above assessment </strong></td><td><a href="#" style="float: left; margin-left: 40px;" class="checkbox '+$(xml).find("AgreeAssessmentTrainee").text()+'"> </a></td></tr>';
				
				tmpTable +='</table>';
			    assessmentHTML = assessmentHTML+tmpTable ;
				
			// Overall Competency Genarator End
			
			// ***** Subject Table OPERATIONS Genarator START
			if($(xml).find('SubReportTable')){ 
				$(xml).find('SubReportTable').each(function (){
					
					tmpTable = '<table class=" full-width table-fix1">';
					tmpTable += '<tr><td>'+$(this).find("SubReportTitel").text()+'</td></tr>';
					tmpTable += '<tr><td><p><strong>OBJECTIVE</strong></p>'+$(this).find("SubReportObjec").text()+'</td></tr>';
					tmpTable +='</table>';
					assessmentHTML = assessmentHTML+tmpTable ;
					
					assessmentHTML += '<p>Please complete a panel for each assessment conducted and list completed task by number in task/s box. Please also complete checklist as demonstrated or explained.</p>';
					
					
					  
					cComment = $(this).find('SubRepComment').text();
					  
					$(this).find('SubReportEntry').each(function (){
						
						tmpTable += '<table class=" full-width table-fix1"><tr><td>Date : '+$(this).find("Date").text()+'</td><td> Task/s : '+$(this).find("Tasks").text()+'</td> <td> Assessor : '+$(this).find("Assessor").text()+'</td><td>Motive Power Unit : '+$(this).find("Unit").text()+'</td></tr>';
						tmpTable += '<tr><td>Location/TD no. : '+$(this).find("Location").text()+'</td> <td>Origin : '+$(this).find("origin").text()+'</td><td>Destination : '+$(this).find("destination").text()+'</td></tr>';
					   	tmpTable +='</table>';
						
					  	assessmentHTML = assessmentHTML+tmpTable ;
					  });
					  
					  tmpTable = '<table class=" full-width table-fix1">';
					  tmpTable += '<tr class="tb-header"><td>Task No.</td><td>Task</td><td>Demonstrated</td><td>Explained</td><td>Not Yet Competent</td></tr>';
					  var count = 0;
					  $(this).find('SubRepEntry').each(function (){
						count++;
						tmpTable += '<tr><td>'+count+'</td><td>'+$(this).find("Task").text()+'</td><td><a href="#" class="checkbox '+$(this).find("Demonstrated").text()+'"></a></td> <td><a href="#" class="checkbox '+$(this).find("Explained").text()+'"></a></td><td><a href="#" class="checkbox '+$(this).find("Competent").text()+'"></a></td></tr>';
					  });
					  
					  if($(this).find('SubRepEntry').length == 0){
						tmpTable += '<tr><td colspan="5" align="center"><i>No Records Found</i></td></tr>';
					  }
			      
					
					  tmpTable +='</table>';
					  assessmentHTML = assessmentHTML+tmpTable ;
					 
					if($(this).find('SubRepComment')){
						assessmentHTML += '<h3>Comments </h3><p>Add any comments below. NOTE: If any item has been ticked as NOT YET COMPETENT (N/C), the trainer must add an explanation/comments here</p><table class="comments full-width"><tr><td>'+ cComment+'</td></tr></table>';
					 } 
					 
					 if($(this).find("SubRepCompetentLevel"))	{
							tmpTable = '<table class="chklist full-width table-fix1">';
							/*competent='';
							uncompetent='';
							if($(this).find("SubRepCompetentLevel").text() == 'checked'){
								competent = 'checked';
							}else { uncompetent = 'checked'; }*/
							
							tmpTable += '<tr><td><strong style="float: left;" >COMPETENT  : </strong><a href="#" style="float: left; margin-left: 40px;" class="checkbox '+$(this).find("SubRepCompetentLevel").text()+'">&nbsp;</a></td> <td><strong style="float: left;">NOT YET COMPETENT : </strong><a href="#" style="float: left; margin-left: 40px;" class="checkbox '+$(this).find("SubRepNotCompetentLevel").text()+'">&nbsp;</a></td></tr>';
							tmpTable += '<tr><td><strong style="float: left;">Assessor (Signature)  : </strong><a href="#" style="float: left; margin-left: 40px;" class="checkbox '+$(this).find("SubRepAssessorSign").text()+'">&nbsp;</a></td> <td><strong style="float: left;">Trainee/Driver (Signature) : </strong><a href="#" style="float: left; margin-left: 40px;" class="checkbox '+$(this).find("SubRepTraineeSign").text()+'">&nbsp;</a></td></tr>';
							tmpTable +='</table>';
							assessmentHTML = assessmentHTML+tmpTable ;
					}
					
					// ***** Corridor Genarator START
					/*if($(this).find('CorridorSet').length){ 
						
						$(this).find('CorridorSet').each(function(){
							
							assessmentHTML += '<h3>'+$(this).find("CorridorTitel").text()+'</h3>';
							
							tmpTable = '<table class=" full-width table-fix1">';
							tmpTable += '<tr><td>Lesson Title</td><td>'+$(this).find("CorridorLessTitel").text()+'</td></tr>';
							tmpTable += '<tr><td colspan="2"><p><strong>OBJECTIVE</strong></p>'+$(this).find("CorridorObjec").text()+'</td></tr>';
							tmpTable +='</table>';
							assessmentHTML = assessmentHTML+tmpTable ;
							
							cComment = $(this).find('Comment').text();
							
							$(this).find('CorridorTDEntry').each(function (){
								 tmpTable = '<table class=" full-width table-fix1">';
								 tmpTable += '<tr><td><strong>Date : </strong>'+$(this).find("Date").text()+'</td><td><strong> MPU : </strong>'+$(this).find("MPU").text()+'</td> <td><strong>Day/Night : </strong>'+$(this).find("DayNight").text()+'</td></tr>';
								 tmpTable += '<tr><td><strong>TD no. : </strong>'+$(this).find("TDNo").text()+'</td><td><strong>Origin : </strong>'+$(this).find("Origin").text()+'</td> <td><strong>Destination : </strong>'+$(this).find("Destination").text()+'</td></tr>';
								 tmpTable +='</table>';
								 assessmentHTML = assessmentHTML+tmpTable ;
							});
							
							tmpTable = '<table class="full-width table-fix1">';
							tmpTable += '<tr  class="tb-header"><td>Task No.</td><td>Task</td><td>Demonstrated</td><td>Explained</td><td>Not Yet Competent</td></tr>';
							count = 0;
							$(this).find('CorridorEntry').each(function (){
							count++;
							tmpTable += '<tr><td>'+count+'</td><td>'+$(this).find("Task").text()+'</td><td>'+$(this).find("Demonstrated").text()+'</td> <td>'+$(this).find("Explained").text()+'</td><td>'+$(this).find("Competent").text()+'</td></tr>';
							  });
							tmpTable +='</table>';
							assessmentHTML = assessmentHTML+tmpTable ;
							
							if($(this).find('Comment')){
								assessmentHTML += '<h3>Comments </h3><p>Add any comments below. NOTE: If any item has been ticked as NOT YET COMPETENT (N/C), the trainer must add an explanation/comments here</p><table class="comments full-width"><tr><td>'+cComment+'</td></tr></table>';
							 }
							 
							 if($(this).find("CompetentLevel"))	{
									tmpTable = '<table class="chklist full-width table-fix1">';
									competent='';
									uncompetent='';
									if($(this).find("CompetentLevel").text() == 'checked'){
										competent = 'checked';
									}else { uncompetent = 'checked'; }
									
									tmpTable += '<tr><td><strong style="float: left;">COMPETENT  : </strong><a href="#" style="float: left; margin-left: 40px;" class="checkbox '+competent+'">&nbsp;</a></td> <td><strong style="float: left;">NOT YET COMPETENT : </strong><a href="#" style="float: left; margin-left: 40px;" class="checkbox '+uncompetent+'">&nbsp;</a></td></tr>';
									tmpTable += '<tr><td>Assessor (Signature)  : '+$(this).find("AssessorSign").text()+'</td> <td>Trainee/Driver (Signature) : '+$(this).find("TraineeSign").text()+'</td></tr>';
									tmpTable +='</table>';
									assessmentHTML = assessmentHTML+tmpTable ;
							 }
					  
					  });
						
					}*/
					//Corridor Genarator END
				});
			}
			//Subject Table OPERATIONS Genarator END

		}
		
		log(assessmentHTML);
		$('.addtable').html(assessmentHTML);
		if($(xml).find('TimeDuration').length == 0){
			$('.timeLostDuringTable').css('display','none');
		}
	}
	
	retrieveAssessmentData();
	
})();