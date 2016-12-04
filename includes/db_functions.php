<?php

include('config.inc.php'); 
include('common_functions.php');
$connectionInfo = mysql_connect($GLOBALS['DB_Host'], $GLOBALS['DB_User'], $GLOBALS['DB_Pwd']);

if (!$connectionInfo || !mysql_select_db($GLOBALS['DB_Name'], $connectionInfo)) {
    print "VLine App Admin Site ERROR0x90091 ";
	writeLog (date('H:i:s')." - MySQL Error: " . mysql_error());
	exit;
}
mysql_query("SET CHARACTER SET 'utf8'", $connectionInfo);

function getTraineeInfo($user="",$pass="",$email="") {

	$traineeinfo="";
	
	$appendsql="";
	
	if($email!="")
		$appendsql=" email='$email' ";
	else if($user!="" && $pass!="")
		$appendsql=" currentpid='$user' AND password='$pass' ";
	else if($user!="" )
		$appendsql=" currentpid='$user' ";
	else
		return $traineeinfo;
		
	$sql="SELECT currentpid,CONCAT(givenname,' ',familyname) as fullname,password,employeeno FROM users WHERE level1id='VLine'  AND $appendsql ORDER BY fullname,employeeno ";
	
	writeLog (date('H:i:s')." - $sql");
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$traineeinfo.=$row["currentPID"].",".$row["fullname"].",".$row["password"].",".$row["employeeno"]."\r\n";
		}
	}
		
	return $traineeinfo;
}

function getTrainerAssessorInfo() {

	$trainer_assessor_info="";
				
	$sql="SELECT app_trainer_assessor.userid,CONCAT(givenname,' ',familyname) as fullname,password,role FROM app_trainer_assessor INNER JOIN users ON app_trainer_assessor.userid=users.currentpid order by fullname,role";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$trainer_assessor_info.=$row["userid"].",".$row["fullname"].",".$row["password"].",".$row["role"]."\r\n";
		}
		
	}

	 writeLog (date('H:i:s')." - $sql");	
	return $trainer_assessor_info;
}


function getUsers($excludes="",$userid="") {

	$users="";
	$excludedusers="";
	$appendsql="";
	
	if($excludes!=""){
		$excludedusers=" AND currentpid NOT IN ('".str_replace(",","','",$excludes)."') ";
	}
	
	if($userid!=""){
		$appendsql=" AND currentpid IN ('".str_replace(",","','",$excludes)."') ";
	}
				
	$sql="SELECT currentpid,CONCAT(givenname,' ',familyname) as fullname FROM users WHERE level1id='VLine'  $appendsql $excludedusers ORDER BY fullname ";
	
	//print($sql);
	 writeLog (date('H:i:s')." - $sql");
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$users.=$row["currentpid"].",".$row["fullname"]."\r\n";
		}
		
	}
	
	//print($users);
	
	return $users;
}

function setTrainerAssessor($data) {
	
	$response="Insert Error";
	
	
	if ($data != "") {
	 	$delsql="DELETE FROM app_trainer_assessor";
        	mysql_query($delsql, $GLOBALS['connectionInfo']);
	
		$trainer_assessor = explode("\r\n", $data);
		
		$sql="INSERT IGNORE INTO app_trainer_assessor(userid,role) VALUES";
		//print_r($trainer_assessor);
		for($i=0;$i<sizeof($trainer_assessor);$i++){
			if($trainer_assessor[$i]!="")
				$sql.="('".str_replace(",","','",$trainer_assessor[$i])."'),";
		}
		
		$sql=substr($sql,0,strlen($sql)-1);
		
		//print($sql);
		 writeLog (date('H:i:s')." - $sql");
		
		if(mysql_query($sql,$GLOBALS['connectionInfo']))
			$response="Data Inserted";
	} else {
		$response="Data Cleared";
	}

	return $response;
	
}

function getStages() {

    $stages="";
				
	$sql="SELECT SUBSTRING(learningid, 6) as Id,CONCAT('Stage',' ',SUBSTRING(learningid, 6)) as stagename,title FROM learningObject WHERE learningtype='C' and learningid REGEXP 'stage[1,3,5,7,9,10]' order by CAST(SUBSTRING(learningid, 6) AS UNSIGNED) ";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$stages.=$row["Id"].",".$row["stagename"].",\"".$row["title"]."\"\r\n";
		}
		
	}

	 writeLog (date('H:i:s')." - $sql");	
	return $stages;

}

function getGroups() {

    $groups="";
				
	$sql="SELECT group_id,group_name FROM user_group order by group_id ";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$groups.=$row["group_id"].",\"".$row["group_name"]."\"\r\n";
		}
		
	}

	 writeLog (date('H:i:s')." - $sql");	
	return $groups;

}

function getChecklistIndex($stageid="") {

	$checklistindex="";
	$appendsql="";

	if($stageid!=""){
		$appendsql=" WHERE stageid=$stageid ";
	}

	$sql="SELECT Id,stageid,checknum,name FROM app_checklistindex $appendsql ORDER BY stageid,Id ";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$checklistindex.=$row["Id"].",".$row["stageid"].",".$row["checknum"].",\"".$row["name"]."\"\r\n";
		}
		
	}

	 writeLog (date('H:i:s')." - $sql");	
	return $checklistindex;
}

function getAssesslistIndex($stageid="") {

	$asesslistindex="";
	$appendsql="";

	if($stageid!=""){
		$appendsql=" WHERE stageid=$stageid ";
	}

	$sql="SELECT Id,stageid,title FROM app_assessmentindex $appendsql ORDER BY stageid,Id ";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$asesslistindex.=$row["Id"].",".$row["stageid"].",\"".$row["title"]."\"\r\n";
		}
		
	}

	 writeLog (date('H:i:s')." - $sql");	
	return $asesslistindex;
}

function getTraineeList($stageid="",$trainee="",$checknum="") {

	$traineelist="";
	
	$appendsql="";

	if($stageid!=""){
		$appendsql.=" WHERE app_checklistindex.stageid=$stageid ";
	}
	
	if($trainee!=""){
		$appendsql.=" AND  ac.trainee='$trainee' ";
	}
	
	if($checknum!=""){
		$appendsql.=" AND  ac.checknum='$checknum' ";
	}

	/*$sql="select ac.trainee,CONCAT(givenname,' ',familyname) as fullname,group_id,stageid,'true' as ischecklist,ac.checknum,ac.name,(CASE WHEN tasktraineesig='true' AND tasktrainersig='true' THEN 'true' ELSE 'false' END) as iscomplete,employeeno from app_checklist ac inner join users on users.currentpid=ac.trainee left  join user_group_membership on ac.trainee=user_group_membership.userid inner join app_checklistindex on ac.checknum=app_checklistindex.checknum $appendsql ";

	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
			while($row = mysql_fetch_array($result)) {
				$traineelist.=$row["trainee"].",".$row["fullname"].",".$row["group_id"].",".$row["stageid"].",".$row["ischecklist"].",".$row["checknum"].",\"".$row["name"]."\",".$row["iscomplete"].",".$row["employeeno"]."\r\n";
			}
		}*/
		
		//9 july should return
	//Farzaneh 9 july 2014

		$sql="select ac.trainee,CONCAT(givenname,' ',familyname) as fullname,group_id,stageid,'true' as ischecklist,ac.checknum,ac.name,(CASE WHEN tasktraineesig='true' AND tasktrainersig='true' THEN 'true' ELSE 'false' END) as iscomplete,employeeno,app_stage.description,rpl,ac.trainerinstruction,ac.assessor from app_checklist ac inner join users on users.currentpid=ac.trainee left  join user_group_membership on ac.trainee=user_group_membership.userid inner join app_checklistindex on ac.checknum=app_checklistindex.checknum INNER JOIN app_stage ON stageid = app_stage.Id $appendsql ORDER BY fullname,stageid,ac.checknum,ac.name ";


	//Change 16 AUG 2015
	/*$sql="";
	if($trainee!="")
	{
		$sql="select ac.trainee,CONCAT(givenname,' ',familyname) as fullname,group_id,stageid,'true' as ischecklist,ac.checknum,ac.name,(CASE WHEN tasktraineesig='true' AND tasktrainersig='true' THEN 'true' ELSE 'false' END) as iscomplete,employeeno,app_stage.description,rpl,'false' as notstart from app_checklist ac inner join users on users.currentpid=ac.trainee left  join user_group_membership on ac.trainee=user_group_membership.userid inner join app_checklistindex on ac.checknum=app_checklistindex.checknum INNER JOIN app_stage ON stageid = app_stage.Id $appendsql 
		UNION
		select 'exam.tester' as trainee,'' as fullname,'' as group_id,stageid,'true' as ischecklist,checknum,'' as name,'false' as iscomplete,'' as employeeno,app_stage.description,'false' as rpl,'true' as notstart  from app_checklistindex INNER JOIN app_stage ON stageid = app_stage.Id where checknum not in (select checknum from app_checklist where trainee='exam.tester') ORDER BY stageid,checknum,name";
	}
	else
	{
		$sql="select ac.trainee,CONCAT(givenname,' ',familyname) as fullname,group_id,stageid,'true' as ischecklist,ac.checknum,ac.name,(CASE WHEN tasktraineesig='true' AND tasktrainersig='true' THEN 'true' ELSE 'false' END) as iscomplete,employeeno,app_stage.description,rpl,'false' as notstart from app_checklist ac inner join users on users.currentpid=ac.trainee left  join user_group_membership on ac.trainee=user_group_membership.userid inner join app_checklistindex on ac.checknum=app_checklistindex.checknum INNER JOIN app_stage ON stageid = app_stage.Id $appendsql ORDER BY stageid,checknum,name";
	}*/
		//Farzaneh
		if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
				while($row = mysql_fetch_array($result)) {
					$traineelist.=$row["trainee"].",".$row["fullname"].",".$row["group_id"].",".$row["stageid"].",".$row["ischecklist"].",".$row["checknum"].",\"".$row["name"]."\",".$row["iscomplete"].",".$row["employeeno"].","."Stage ".$row["stageid"]." - ".$row["description"].",".$row["rpl"].",".$row["trainerinstruction"].",".$row["assessor"]."\r\n";
				}
			}

	//Finish
	 writeLog (date('H:i:s')." - $sql");	
	if($stageid!=""){
		$appendsql=" WHERE app_assessmentindex.stageid=$stageid ";
	}
	
	$sql="select app_assessmentindex.Id, app_assessment.trainee,CONCAT(givenname,' ',familyname) as fullname,group_id,app_assessment.stageid,'false' as ischecklist,app_assessmentindex.title,(CASE WHEN result IS NOT NULL AND result!='' AND assessorsig='true' AND traineesig='true' THEN 'true' ELSE 'false' END) as iscomplete from app_assessment inner join users on users.currentpid=app_assessment.trainee left join user_group_membership on app_assessment.trainee=user_group_membership.userid inner join app_assessmentindex on app_assessment.name=app_assessmentindex.title AND app_assessment.stageId=app_assessmentindex.stageid $appendsql ORDER BY fullname,ABS( app_assessment.stageid ),app_assessmentindex.title ";

	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
			while($row = mysql_fetch_array($result)) {
				$traineelist.=$row["trainee"].",".$row["fullname"].",".$row["group_id"].",".$row["stageid"].",".$row["ischecklist"].",".$row["Id"].",\"".$row["title"]."\",".$row["iscomplete"]."\r\n";
			}
		}
	
 writeLog (date('H:i:s')." - $sql");	
	return $traineelist;
}

function getTraineeListGroup($stageid="",$trainee="",$checknum="") {

	$traineelist="";
	
	$appendsql="";

	if($stageid!=""){
		$appendsql.=" WHERE app_checklistindex.stageid=$stageid ";
	}
	
	if($trainee!=""){
		$appendsql.=" AND  ac.trainee='$trainee' ";
	}
	
	if($checknum!=""){
		$appendsql.=" AND  ac.checknum='$checknum' ";
	}

	/*$sql="select ac.trainee,CONCAT(givenname,' ',familyname) as fullname,group_id,stageid,'true' as ischecklist,ac.checknum,ac.name,(CASE WHEN tasktraineesig='true' AND tasktrainersig='true' THEN 'true' ELSE 'false' END) as iscomplete,employeeno from app_checklist ac inner join users on users.currentpid=ac.trainee left  join user_group_membership on ac.trainee=user_group_membership.userid inner join app_checklistindex on ac.checknum=app_checklistindex.checknum $appendsql ";

	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
			while($row = mysql_fetch_array($result)) {
				$traineelist.=$row["trainee"].",".$row["fullname"].",".$row["group_id"].",".$row["stageid"].",".$row["ischecklist"].",".$row["checknum"].",\"".$row["name"]."\",".$row["iscomplete"].",".$row["employeeno"]."\r\n";
			}
		}*/
		
		//9 july should return
	//Farzaneh 9 july 2014
		$sql="SELECT trainee,CONCAT(givenname,' ',familyname) as fullname,'' group_id,'' as stageid,(SELECT COUNT(result) FROM app_assessment WHERE app_assessment.trainee = app_checklist.trainee AND result = 'true' GROUP BY app_assessment.trainee) as ischecklist,checknum,sum(CASE WHEN tasktraineesig='true' AND tasktrainersig='true' THEN '1' ELSE 0 END) as name,'' as iscomplete,'' as employeeno,'' as description,'' as rpl,'' as trainerinstruction,'' as assessor,'' as numcomplete FROM `app_checklist` inner join users on users.currentpid=app_checklist.trainee 
		GROUP BY trainee order by trainee ";
	
	//Change 16 AUG 2015
	/*$sql="";
	if($trainee!="")
	{
		$sql="select ac.trainee,CONCAT(givenname,' ',familyname) as fullname,group_id,stageid,'true' as ischecklist,ac.checknum,ac.name,(CASE WHEN tasktraineesig='true' AND tasktrainersig='true' THEN 'true' ELSE 'false' END) as iscomplete,employeeno,app_stage.description,rpl,'false' as notstart from app_checklist ac inner join users on users.currentpid=ac.trainee left  join user_group_membership on ac.trainee=user_group_membership.userid inner join app_checklistindex on ac.checknum=app_checklistindex.checknum INNER JOIN app_stage ON stageid = app_stage.Id $appendsql 
		UNION
		select 'exam.tester' as trainee,'' as fullname,'' as group_id,stageid,'true' as ischecklist,checknum,'' as name,'false' as iscomplete,'' as employeeno,app_stage.description,'false' as rpl,'true' as notstart  from app_checklistindex INNER JOIN app_stage ON stageid = app_stage.Id where checknum not in (select checknum from app_checklist where trainee='exam.tester') ORDER BY stageid,checknum,name";
	}
	else
	{
		$sql="select ac.trainee,CONCAT(givenname,' ',familyname) as fullname,group_id,stageid,'true' as ischecklist,ac.checknum,ac.name,(CASE WHEN tasktraineesig='true' AND tasktrainersig='true' THEN 'true' ELSE 'false' END) as iscomplete,employeeno,app_stage.description,rpl,'false' as notstart from app_checklist ac inner join users on users.currentpid=ac.trainee left  join user_group_membership on ac.trainee=user_group_membership.userid inner join app_checklistindex on ac.checknum=app_checklistindex.checknum INNER JOIN app_stage ON stageid = app_stage.Id $appendsql ORDER BY stageid,checknum,name";
	}*/
		//Farzaneh
		if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
				while($row = mysql_fetch_array($result)) {
					$traineelist.=$row["trainee"].",".$row["fullname"].",".$row["group_id"].",".$row["stageid"].",".$row["ischecklist"].",".$row["checknum"].",\"".$row["name"]."\",".$row["iscomplete"].",".$row["employeeno"].","."Stage ".$row["stageid"]." - ".$row["description"].",".$row["rpl"].",".$row["trainerinstruction"].",".$row["assessor"]."\r\n";
				}
			}

	//Finish
	 writeLog (date('H:i:s')." - $sql");	
	if($stageid!=""){
		$appendsql=" WHERE app_assessmentindex.stageid=$stageid ";
	}
	
	$sql="select app_assessmentindex.Id, app_assessment.trainee,CONCAT(givenname,' ',familyname) as fullname,group_id,app_assessment.stageid,'false' as ischecklist,app_assessmentindex.title,(CASE WHEN result IS NOT NULL AND result!='' AND assessorsig='true' AND traineesig='true' THEN 'true' ELSE 'false' END) as iscomplete from app_assessment inner join users on users.currentpid=app_assessment.trainee left join user_group_membership on app_assessment.trainee=user_group_membership.userid inner join app_assessmentindex on app_assessment.name=app_assessmentindex.title AND app_assessment.stageId=app_assessmentindex.stageid $appendsql ORDER BY fullname,stageid,app_assessmentindex.title ";

	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
			while($row = mysql_fetch_array($result)) {
				$traineelist.=$row["trainee"].",".$row["fullname"].",".$row["group_id"].",".$row["stageid"].",".$row["ischecklist"].",".$row["Id"].",\"".$row["title"]."\",".$row["iscomplete"]."\r\n";
			}
		}
	
 writeLog (date('H:i:s')." - $sql");	
	return $traineelist;
}

function insertCSV($trainee,$tblname,$data) {

	 writeLog (date('H:i:s')." - $data");

   $data=str_replace("\r\n"," ",$data); 
   $data=str_replace("'","''",$data);
       
   $response="Insert Error";
      
   
   if($tblname!="auditlog" && $tblname!="trainer_assessor"){
		$delsql="delete from app_".$tblname." WHERE trainee='$trainee'";
   
	    if(mysql_query($delsql,$GLOBALS['connectionInfo']))
			$response="Data deleted";
	}
	
	
	
   $sql="INSERT INTO app_".$tblname." VALUES ";
   
   $valstr=explode("\n",$data);
   
   $tmpstr="";
   
   for($i=0;$i<sizeof($valstr);$i++){
   
	/*	if(substr($valstr[$i], -3)=="N/A" && $tblname=="checklist"){
			$tmpstr=$valstr[$i];
			continue;
		}
		
		if($tmpstr!="")
			$valstr[$i]=$tmpstr.$valstr[$i];
	*/		
		$sql.="('".str_replace("|","','",$valstr[$i]."'),");
		
		$tmpstr="";

   }
	$sql=str_replace(",('')","",$sql);
   
   $sql=substr($sql,0,strlen($sql)-1);
     
   $sql=str_replace("'null'","NULL",$sql);
   
     

   if(mysql_query($sql,$GLOBALS['connectionInfo']))
		$response="Data Inserted";
  
  	 //Temporary 10 OCT 2015
	if($tblname=="checklist")
	{
		$sqlnsch="SELECT * FROM app_checklistindex where checknum not in (select checknum from app_checklist where trainee='".$trainee."')";
		if($resultnsch=mysql_query($sqlnsch,$GLOBALS['connectionInfo']))
		{
			while($rownsch = mysql_fetch_array($resultnsch)) 
			{
			
				$sqlcheckname="select name from app_checklist where checknum='".$rownsch[2]."' LIMIT 1";
				$resultcheckname=mysql_query($sqlcheckname,$GLOBALS['connectionInfo']);
				$rowcheckname = mysql_fetch_array($resultcheckname);
				
				 $sqlnschinsert="INSERT INTO app_checklist (checknum,name,trainee) VALUES ('".$rownsch[2]."','".$rowcheckname[0]."','".$trainee."')";
				 mysql_query($sqlnschinsert,$GLOBALS['connectionInfo']);
			}
		}
	}
	
	 writeLog (date('H:i:s')." - $sql"); 
	
  return $response;
  // return $sql;
}

function verifyUser($userid="",$pass="") {

	$userinfo="Invalid user ID or password";

	$sql="SELECT currentpid,CONCAT(givenname,' ',familyname) as fullname FROM users WHERE level1id='VLine'  AND currentpid='$userid' AND password='$pass'";

	 writeLog (date('H:i:s')." - $sql");	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		if($row = mysql_fetch_array($result)) {
			 $userinfo=$row["currentPID"].",".$row["fullname"];
			
			//Fernando start
				//Session start
				//session_set_cookie_params(0);
				//session_start();
				//set user id to session
				//session_register($userid);
				
				$_SESSION['user'] = $userid;
	
			//Fernando end
		}
	}
		
	return $userinfo;
}

function getTotalChklistAssesslist($stageid="") {
	$totalchklistassesslist="";
	
	$appendsql="";

	if($stageid!=""){
		$appendsql=" AND SUBSTRING(lo.learningid, 6)=$stageid ";
	}
	
	$sql="SELECT  SUBSTRING(lo.learningid, 6) as Id, (select count(app_checklistindex.checknum) from app_checklistindex WHERE app_checklistindex.stageid=SUBSTRING(lo.learningid, 6)) as totalchecklist, (select count(app_assessmentindex.title) from app_assessmentindex WHERE app_assessmentindex.stageid=SUBSTRING(lo.learningid, 6)) as totalassesslist FROM learningObject lo WHERE lo.learningtype='C' and lo.learningid REGEXP 'stage[1,3,5,7,9,10]' AND lo.learningid <> 'Stage9Pit2' AND lo.learningid <> 'Stage9_pits' order by CAST(SUBSTRING(lo.learningid, 6) AS UNSIGNED)  $appendsql ";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$totalchklistassesslist.=$row['Id'].",".$row['totalchecklist'].",".$row['totalassesslist']."\r\n";
		}
	}
 writeLog (date('H:i:s')." - $sql");	
	return $totalchklistassesslist;
}

function getChklistData($trainee,$checklistid) {
	$chklistdata="";
			
	$sql=" SELECT trainerinstruction,instrainersig,insdate,insdayornight,insweather,locomotivetype,insfrom,insto,insmpu,insnovehicle FROM app_checklist WHERE trainee='$trainee' AND checknum='$checklistid' ";
 writeLog (date('H:i:s')." - $sql");	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$chklistdata.=$row['trainerinstruction'].",".$row['instrainersig'].",".$row['insdate'].",".$row['insdayornight'].",".$row['insweather'].",".$row['locomotivetype'].",".$row['insfrom'].",".$row['insto'].",".$row['insmpu'].",,".$row['insnovehicle']."\r\n";
		}
	}

 writeLog (date('H:i:s')." - $sql");
	
	$sql=" SELECT trainerguide,gtrainersig,gdate,gdayornight,gweather,locomotivetype,gfrom,gto,gmpu,gnovehicle FROM app_checklist WHERE trainee='$trainee' AND checknum='$checklistid' ";
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$chklistdata.=$row['trainerguide'].",".$row['gtrainersig'].",".$row['gdate'].",".$row['gdayornight'].",".$row['gweather'].",".$row['locomotivetype'].",".$row['gfrom'].",".$row['gto'].",".$row['gmpu'].",,".$row['gnovehicle']."\r\n";
		}
	}
	
	//echo $sql;

	 writeLog (date('H:i:s')." - $sql");
	
	$sql=" SELECT trainerunguide,ungtrainersig,ungdate,ungdayornight,ungweather,locomotivetype,ungfrom,ungto,ungmpu,ungnovehicle,ungperform FROM app_checklist WHERE trainee='$trainee' AND checknum='$checklistid' ";
 writeLog (date('H:i:s')." - $sql");	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$chklistdata.=$row['trainerunguide'].",".$row['ungtrainersig'].",".$row['ungdate'].",".$row['ungdayornight'].",".$row['ungweather'].",".$row['locomotivetype'].",".$row['ungfrom'].",".$row['ungto'].",".$row['ungmpu'].",,".$row['ungnovehicle'].",".$row['ungperform']."\r\n";
		}
	}
	
		//EmpNumber00,Objective,Corridor down,Corridor up,Trainee name,12-03-10,Trainer name,Trainer checked,13-03-10,,'
	$sql=" SELECT locomotivetype,objective,corridorup,corridordown,tasktraineesig,tasktraineedate,tasktrainersig,tasktrainerdate,trainer FROM app_checklist WHERE trainee='$trainee' AND checknum='$checklistid' ";
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$chklistdata.=$row['locomotivetype'].",\"".$row['objective']."\",".$row['corridorup'].",".$row['corridordown'].",".$row['tasktraineesig'].",".$row['tasktraineedate'].",".$row['tasktrainersig'].",".$row['tasktrainerdate'].",".$row['trainer'].",,\r\n";
		}
	}
	
	//echo $sql;
 writeLog (date('H:i:s')." - $sql");	
	return $chklistdata;
}

function getChklistTask($trainee,$checklistid) {
	$chklisttask="";
			
	$sql=" SELECT  (CASE WHEN instructed='true' THEN 'checked' ELSE 'unchecked' END),name,(CASE WHEN gna='true' THEN 'checked' ELSE 'unchecked' END),(CASE WHEN gd='true' THEN 'checked' ELSE 'unchecked' END),(CASE WHEN ge='true' THEN 'checked' ELSE 'unchecked' END),(CASE WHEN unna='true' THEN 'checked' ELSE 'unchecked' END),(CASE WHEN und='true' THEN 'checked' ELSE 'unchecked' END),(CASE WHEN une='true' THEN 'checked' ELSE 'unchecked' END) FROM app_checklisttask WHERE trainee='$trainee' AND checknum='$checklistid' ";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
		
			
		
			$chklisttask.=$row[0].",\"".$row['name']."\",".$row[2].",".$row[3].",".$row[4].",".$row[5].",".$row[6].",".$row[7]."\r\n";
		}
	}
	
	//echo $sql;
 writeLog (date('H:i:s')." - $sql");	
	return $chklisttask;
}

function getAssessmentDetail($trainee,$assessmentid,$stageid) {

	$assessmentdetail="<Assessment>\r\n";
	
	$appendsql="";
	$timevisible="true";
	
	if($stageid!=""){
		$appendsql=" AND stageId=$stageid ";
	}
//(select CONCAT(givenname,' ',familyname) as fullname from users where userid=assessor) AS fullname
	/*$sql="SELECT assessor,trainer,Id,location,date,(CASE WHEN result='true' THEN 'checked' ELSE 'unchecked' END) as assessresult,(CASE WHEN assessorsig='true' THEN 'checked' ELSE 'unchecked' END) as assessorsign,assessordate,(CASE WHEN traineesig='true' THEN 'checked' ELSE 'unchecked' END) as traineesign,traineedate,comment,timeoverschedule,timelost,objective,CONCAT(givenname,' ',familyname) as fullname,timevisible FROM app_assessment INNER JOIN users ON app_assessment.assessor=users.currentpid WHERE trainee='$trainee' AND Id='$assessmentid' $appendsql ";*/
	$sql="SELECT assessor, trainer, Id, location, date, (CASE WHEN result='true' THEN 'checked' ELSE 'unchecked' END) as assessresult,(CASE WHEN assessorsig='true' THEN 'checked' ELSE 'unchecked' END) as assessorsign, assessordate, (CASE WHEN traineesig='true' THEN 'checked' ELSE 'unchecked' END) as traineesign, traineedate, COMMENT , timeoverschedule, timelost, objective, (select CONCAT(givenname,' ',familyname) as fullname from users where userid=assessor) AS fullname, timevisible FROM app_assessment WHERE trainee =  '$trainee' AND Id =  '$assessmentid' $appendsql";

	$assessmentdetail.="<Header>\r\n";
	$headersectionend="";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		
		while($row = mysql_fetch_array($result)) {
				
			$assessmentdetail.="<Location><![CDATA[".$row['location']."]]></Location>\r\n
			<Date><![CDATA[".$row['date']."]]></Date>\r\n
			<AssessorName><![CDATA[".$row['fullname']."]]></AssessorName>\r\n";
			
			$headersectionend.="<AssessmentResult><![CDATA[".$row['assessresult']."]]></AssessmentResult>\r\n
			<AssessorInfo>
				<AssSignature><![CDATA[".$row['assessorsign']."]]></AssSignature><AssDate><![CDATA[".$row['assessordate']."]]></AssDate>\r\n
				<TraSignature><![CDATA[".$row['traineesign']."]]></TraSignature><TraDate><![CDATA[".$row['traineedate']."]]></TraDate>\r\n
			</AssessorInfo>\r\n
			<MainComment><![CDATA[".$row['COMMENT']."]]></MainComment>\r\n";
			
			if($row['timevisible']=="false")
				$timevisible="false";
	
		}
			
	}
	//Number of checklist for each subject
	//(SELECT count(subjectId) FROM app_subjectchecklist WHERE subjectId=sl.subjectId)
	$sql="SELECT sl.subjectId,sl.title,sl.objective,'' as total,requirednum as critical,achieved from app_subjectlist sl LEFT OUTER JOIN  app_subject ON sl.subjectId=app_subject.Id AND trainee='$trainee' WHERE  sl.assessmentid='$assessmentid' ";
		
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		$assessmentdetail.="<PerformanceSet>\r\n";
		
		while($row = mysql_fetch_array($result)) {
				
			$assessmentdetail.="<Subject>\r\n
				<SubName><![CDATA[".$row['title']."]]></SubName>\r\n
				<SubObjective><![CDATA[".$row['objective']."]]></SubObjective>\r\n
				<SubTotal><![CDATA[".$row['total']."]]></SubTotal>\r\n
				<SubRequired><![CDATA[".$row['critical']."]]></SubRequired>\r\n
				<SubAchieved><![CDATA[".$row['achieved']."]]></SubAchieved>\r\n
			</Subject>\r\n";
		
	
		}
		
		$assessmentdetail.="</PerformanceSet>\r\n";
		
	}
	
	$assessmentdetail.=$headersectionend;
	$assessmentdetail.="</Header>\r\n";
	
	$sql="SELECT tripno,time,location,destination,tdNo,mputype,mpuno,weather FROM app_assessmentdetail WHERE trainee='$trainee' AND app_assessmentdetail.assessmentid='$assessmentid' ORDER BY tripno";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
	   $assessmentdetail.="<AssessmentDetails>\r\n";
	
		while($row = mysql_fetch_array($result)) {
			$assessmentdetail.="<AssessEntry>\r\n
				<TripNo><![CDATA[".$row['tripno']."]]></TripNo>\r\n
				<TripTime><![CDATA[".$row['time']."]]></TripTime>\r\n
				<TripOrigin><![CDATA[".$row['location']."]]></TripOrigin>\r\n
				<TripDes><![CDATA[".$row['destination']."]]></TripDes>\r\n
				<TripTDNo><![CDATA[".$row['tdNo']."]]></TripTDNo>\r\n
				<TripMPUType><![CDATA[".$row['mputype']."]]></TripMPUType>\r\n
				<TripMPUNo><![CDATA[".$row['mpuno']."]]></TripMPUNo>\r\n
				<TripWeather><![CDATA[".$row['weather']."]]></TripWeather>\r\n
			</AssessEntry>\r\n";
		}
		$assessmentdetail.="</AssessmentDetails>\r\n";
	}
	
	if($timevisible){
	
		$sql="SELECT tripno,minutelost,signals,passengerdelay,permanentway,trackwork,trainfault,other,explanation FROM app_timelost WHERE trainee='$trainee' AND app_timelost.assessmentid='$assessmentid' ";
		
		if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
			$assessmentdetail.="<TimeDuration>\r\n";
			while($row = mysql_fetch_array($result)) {
				$assessmentdetail.="<TDEntry>\r\n
					<TimeNo><![CDATA[".$row['tripno']."]]></TimeNo>\r\n
					<Minutes><![CDATA[".$row['minutelost']."]]></Minutes>\r\n
					<Signals><![CDATA[".$row['signals']."]]></Signals>\r\n
					<Delays><![CDATA[".$row['passengerdelay']."]]></Delays>\r\n
					<PermanentWay><![CDATA[".$row['permanentway']."]]></PermanentWay>\r\n
					<Track><![CDATA[".$row['trackwork']."]]></Track>\r\n
					<Faults><![CDATA[".$row['trainfault']."]]></Faults>\r\n
					<Other><![CDATA[".$row['other']."]]></Other>\r\n
					<Explanation><![CDATA[".$row['explanation']."]]></Explanation>\r\n
				</TDEntry>\r\n";
		
			}
			$assessmentdetail.="</TimeDuration>\r\n";
		}
	}
	
	$assessmentdetail.="<Competencies>\r\n";

	//Here we show all the checklist that assign to subject in assessment page (assessment.js)
	//Vline asked this feature only for stage 3 assessment. So, we just select if assessment=1 (satage 3 assessment) 
	//Remember in future you have to join it with subject and write app_subject.assessmentId='$assessmentId' (If we want this feature for all assessment)
	//currently I did that because they just want to see stage 3 assessment and most of the trainee don't have proper data in subject table. If I do join with subject table my select is empty 
	//if($assessmentid==1)
	//{
		$sql="SELECT app_subjectchecklist.checknum,(CASE WHEN app_checklist.rpl='true' THEN 'checked' ELSE 'unchecked' END) as rpl,app_checklist.name,app_subjectchecklist.critical,(CASE WHEN app_subjectchecklist.explained='true' THEN 'checked' ELSE 'unchecked' END) as explained,(CASE WHEN app_subjectchecklist.demonstration='true' THEN 'checked' ELSE 'unchecked' END) as demonstration,(CASE WHEN app_subjectchecklist.nyc='true' THEN 'checked' ELSE 'unchecked' END) as nyc,(CASE WHEN app_checklist.tasktrainersig='true' and app_checklist.	
		tasktraineesig='true' THEN 'checked' ELSE 'unchecked' END) as completed
		from app_subjectchecklist 
		inner join app_checklist ON app_checklist.checknum=app_subjectchecklist.checknum and app_checklist.trainee=app_subjectchecklist.trainee 
		inner join app_subjectlist ON app_subjectchecklist.subjectId=app_subjectlist.subjectId
		inner join app_assessment ON app_subjectlist.assessmentId=app_assessment.Id and app_assessment.trainee=app_subjectchecklist.trainee
		 WHERE app_assessment.Id='$assessmentid' AND app_subjectchecklist.trainee='$trainee'
		 group by app_subjectchecklist.checknum,app_subjectchecklist.subjectId";

		if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		$assessmentdetail.="<CompetSet>\r\n";
		$oldtitle="";
		while($row = mysql_fetch_array($result)) 
		{
		//Currently I don't join my select with subject table. So I can't show title and comment
		/*if($row['title']!=$oldtitle) {
					$assessmentdetail.="<CompTitel><![CDATA[".$row['title']."]]></CompTitel>\r\n
									<Comment><![CDATA[".$row['comment']."]]></Comment>\r\n";
					$oldtitle=$row['title'];
				}*/
				
				$assessmentdetail.="<CompeEntry>\r\n
					<Checklist><![CDATA[".$row['checknum']."]]></Checklist>\r\n
					<Completed><![CDATA[".$row['completed']."]]></Completed>\r\n
					<RPL><![CDATA[".$row['rpl']."]]></RPL>\r\n
					<Description><![CDATA[".$row['name']."]]></Description>\r\n
					<Critical><![CDATA[".$row['critical']."]]></Critical>\r\n
					<ValueD><![CDATA[".$row['demonstration']."]]></ValueD>\r\n
					<ValueE><![CDATA[".$row['explained']."]]></ValueE>\r\n
					<ValueNYC><![CDATA[".$row['nyc']."]]></ValueNYC>\r\n
				</CompeEntry>\r\n";
		}
		$assessmentdetail.="</CompetSet>\r\n";
		}
	//}

	$assessmentdetail.="</Competencies>\r\n";
	
	$assessmentdetail.="</Assessment>\r\n";
	
	//echo $assessmentdetail;
	
	return $assessmentdetail;
}

function getAssessment10Detail($trainee,$assessmentid,$stageid) {

	$assessment10detail="<Assessment>\r\n";
	
	$appendsql="";
	
	if($stageid!=""){
		$appendsql=" AND stageId=$stageid ";
	}
	
	/*$sql="SELECT assessor,trainer,Id,date,(CASE WHEN result='true' THEN 'checked' ELSE 'unchecked' END) as assessresult,(CASE WHEN assessorsig='true' THEN 'checked' ELSE 'unchecked' END) as assessorsign,assessordate,(CASE WHEN traineesig='true' THEN 'checked' ELSE 'unchecked' END) as traineesign,traineedate,comment,objective,CONCAT(givenname,' ',familyname) as fullname,users.employeeno FROM app_assessment INNER JOIN users ON app_assessment.assessor=users.currentpid WHERE trainee='$trainee' AND Id='$assessmentid' $appendsql ";*/
	
	/*$sql="SELECT assessor,trainer,Id,date,(CASE WHEN result='true' THEN 'checked' ELSE 'unchecked' END) as assessresult,(CASE WHEN assessorsig='true' THEN 'checked' ELSE 'unchecked' END) as assessorsign,assessordate,(CASE WHEN traineesig='true' THEN 'checked' ELSE 'unchecked' END) as traineesign,traineedate,comment,objective,assessor as fullname,users.employeeno FROM app_assessment WHERE trainee='$trainee' AND Id='$assessmentid' $appendsql ";*/
	
	$sql="SELECT assessor,trainer,Id,date,(CASE WHEN result='true' THEN 'checked' ELSE 'unchecked' END) as assessresult,(CASE WHEN assessorsig='true' THEN 'checked' ELSE 'unchecked' END) as assessorsign,assessordate,(CASE WHEN traineesig='true' THEN 'checked' ELSE 'unchecked' END) as traineesign,traineedate,comment,objective,(select CONCAT(givenname,' ',familyname) as fullname from users where userid=assessor) AS fullname, users.employeeno FROM app_assessment left outer JOIN users ON app_assessment.assessor=users.userid WHERE trainee='$trainee' AND Id='$assessmentid' $appendsql ";
	
	$assessment10detail.="<Header>\r\n";
	$headersectionend="";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		
		while($row = mysql_fetch_array($result)) {
				
			$assessment10detail.="<CorporateNo><![CDATA[".$row['employeeno']."]]></CorporateNo>\r\n
		<HeadAssessor><![CDATA[".$row['fullname']."]]></HeadAssessor>\r\n
		<HeaderDate><![CDATA[".$row['date']."]]></HeaderDate>\r\n
		<Objective><![CDATA[".$row['objective']."]]></Objective>\r\n";
			
			$headersectionend.="<OverallComp><![CDATA[".$row['assessresult']."]]></OverallComp>\r\n
		<AssessSign><![CDATA[".$row['assessorsign']."]]></AssessSign>\r\n
		<AssessSignDate><![CDATA[".$row['assessordate']."]]></AssessSignDate>\r\n
		<AgreeAssessmentTrainee><![CDATA[".$row['traineesign']."]]></AgreeAssessmentTrainee>\r\n
		<MainComment><![CDATA[".$row['comment']."]]></MainComment>\r\n";
	
		}
		
	}
	
	$sql="SELECT taskactivity,(CASE WHEN c='true' THEN 'checked' ELSE 'unchecked' END) as competent,(CASE WHEN nyc='true' THEN 'checked' ELSE 'unchecked' END) as notcompetent from app_competencymaster LEFT OUTER JOIN  app_competency ON app_competencymaster.Id=app_competency.Id AND trainee='$trainee' WHERE  app_competencymaster.assessmentid='$assessmentid' order by app_competencymaster.Id ";
		
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		$assessment10detail.="<ReportTable>\r\n";
		
		while($row = mysql_fetch_array($result)) {
				
			$assessment10detail.="<TaskAct>\r\n
				<TaskName><![CDATA[".$row['taskactivity']."]]></TaskName>\r\n
				<TaskCompetent><![CDATA[".$row['competent']."]]></TaskCompetent>\r\n
				<TaskNotCompetent><![CDATA[".$row['notcompetent']."]]></TaskNotCompetent>\r\n
			</TaskAct>\r\n";
	
		}
		
		$assessment10detail.="</ReportTable>\r\n";
		
	}
	
	$assessment10detail.=$headersectionend;
	$assessment10detail.="</Header>\r\n";
	

	$sql="SELECT app_competencymaster.Id,app_competencymaster.taskactivity,objective, (CASE WHEN app_competencymaster.corridor='' THEN 'false' ELSE 'true' END) as notcorridor,comment,(CASE WHEN c='true' THEN 'checked' ELSE 'unchecked' END) as competent,(CASE WHEN nyc='true' THEN 'checked' ELSE 'unchecked' END) as notcompetent, (CASE WHEN assessorsig='true' THEN 'checked' ELSE 'unchecked' END) as assessorsign, (CASE WHEN traineesig='true' THEN 'checked' ELSE 'unchecked' END) as traineesign from app_competencymaster INNER JOIN  app_competency ON app_competencymaster.Id=app_competency.Id AND trainee='$trainee' WHERE  app_competencymaster.assessmentid='$assessmentid' order by app_competencymaster.Id";
	
	
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
	 
		
		while($row = mysql_fetch_array($result)) {
			  $assessment10detail.="<SubReportTable>\r\n
				<SubReportTitel><![CDATA[".$row['taskactivity']."]]></SubReportTitel>
				<SubReportObjec><![CDATA[".$row['objective']."]]></SubReportObjec>
			  <SubRepTable>\r\n";
				$assessment10detail.=getSubentry($row['Id'],$trainee,$row['notcorridor']);
				 $assessment10detail.="</SubRepTable>\r\n<SubRepList>\r\n";
				$assessment10detail.=getTaskentry($row['Id'],$trainee,$row['notcorridor']);
			
			  $assessment10detail.="</SubRepList>\r\n
			  <SubRepComment><![CDATA[".$row['comment']."]]></SubRepComment>
			<SubRepCompetentLevel><![CDATA[".$row['competent']."]]></SubRepCompetentLevel>
			<SubRepNotCompetentLevel><![CDATA[".$row['notcompetent']."]]></SubRepNotCompetentLevel>
			<SubRepAssessorSign><![CDATA[".$row['assessorsign']."]]></SubRepAssessorSign>
			<SubRepTraineeSign><![CDATA[".$row['traineesign']."]]></SubRepTraineeSign>
			</SubReportTable>\r\n";
		}
		
	}
	$assessment10detail.="</Assessment>\r\n";
	
	//echo $assessment10detail;
	
	return $assessment10detail;
}



function getAuditLog() {
	$auditlog="";
	
	$sql="SELECT userid,SUBSTRING(datetime,1,10) as dt,SUBSTRING(datetime,12,8) as tm,action,tablename,query FROM app_auditlog";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
		
				$auditlog.=$row['userid'].",".$row['dt'].",".$row['tm'].",".$row['action'].",".$row['tablename']."\r\n";
		}
	}
	return $auditlog;
}

function getSubentry($competencyid,$trainee,$notcorridor) {

	$subentry="";
	
	$sql="SELECT tablenumber,motivepower,assessor,task,date,mpu,dayornight,tdno,origin,destination,CONCAT(givenname,' ',familyname) as fullname FROM app_competencytaskdesc INNER JOIN users ON app_competencytaskdesc.assessor=users.currentpid WHERE competencyId='$competencyid' and trainee='$trainee' order by competencyId,tablenumber";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
				//$mpu=($notcorridor=="true") ? $row['motivepower'] : $row['mpu'];
				$mpu = "".$row['motivepower']."".$row['mpu']."";
				$subentry.="<SubReportEntry>\r\n
					<Date><![CDATA[".$row['date']."]]></Date>\r\n
					<Tasks><![CDATA[".$row['task']."]]></Tasks>\r\n
					<Assessor><![CDATA[".$row['fullname']."]]></Assessor>\r\n
					<Unit><![CDATA[".$mpu."]]></Unit>\r\n
					<Location><![CDATA[".$row['tdno']."]]></Location>\r\n
					<origin><![CDATA[".$row['origin']."]]></origin>\r\n
					<destination><![CDATA[".$row['destination']."]]></destination>\r\n
				</SubReportEntry>\r\n";
		}
	}
	
	return $subentry;


}


function getTaskentry($competencyid,$trainee,$notcorridor) {

	$taskentry="";
	
	$sql="SELECT name,(CASE WHEN demonstrated='true' THEN 'checked' ELSE 'unchecked' END) as demo, (CASE WHEN  explained='true' THEN 'checked' ELSE 'unchecked' END) as expl,(CASE WHEN nyc='true' THEN 'checked' ELSE 'unchecked' END) as nocompetent FROM app_competencytask WHERE competencyId='$competencyid' and trainee='$trainee' order by competencyId,Id";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
				$taskentry.="<SubRepEntry>\r\n
					<Task><![CDATA[".$row['name']."]]></Task>\r\n
					<Demonstrated><![CDATA[".$row['demo']."]]></Demonstrated>\r\n
					<Explained><![CDATA[".$row['expl']."]]></Explained>\r\n
					<Competent><![CDATA[".$row['nocompetent']."]]></Competent>\r\n
				</SubRepEntry>\r\n";
		}
	}
	
	return $taskentry;


}

function insertAssessorTrainer($fullname) 
{
	$username=strtolower(str_replace(" ",".",$fullname));
	$sqlinsert="INSERT INTO app_trainer_assessor(userid,role) VALUES ('".$username."','assessor'),('".$username."','trainer')";
	mysql_query($sqlinsert,$GLOBALS['connectionInfo']);
	return $sqlinsert;
}

function loadStage($trainee) {

	//$trackId=traineeTrackId($trainee);
	$allStage="";
				
	$sql="SELECT Id,name,description FROM app_core_stage where trackId='1' and upgradeQuery<>'delete'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allStage.=$row["Id"]."^".$row["name"]."^".$row["description"]."!";
		}
	}
	return $allStage;
}

function loadAssessment($trainee) {

	//$trackId=traineeTrackId($trainee);
	$allAssessment="";
				
	$sql="SELECT Id,stageId,name,timevisible FROM app_core_assessment where trackId='1' and upgradeQuery<>'delete'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allAssessment.=$row["Id"]."^".$row["stageId"]."^".$row["name"]."^".$row["timevisible"]."!";
		}
	}
	return $allAssessment;
}

function loadSubject($trainee) {

	//$trackId=traineeTrackId($trainee);
	$allSubject="";
				
	$sql="SELECT Id,assessmentId,name,objective,requirednum FROM app_core_subject where trackId='1' and upgradeQuery<>'delete'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allSubject.=$row["Id"]."^".$row["assessmentId"]."^".$row["name"]."^".$row["objective"]."^".$row["requirednum"]."!";
		}
	}
	return $allSubject;
}

function loadSubjectChecklist($trainee) {

	//$trackId=traineeTrackId($trainee);
	$allSubjectChecklist="";
				
	$sql="SELECT Id,subjectId,checknum,critical FROM app_core_subjectchecklist where trackId='1' and upgradeQuery<>'delete'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allSubjectChecklist.=$row["Id"]."^".$row["subjectId"]."^".$row["checknum"]."^".$row["critical"]."!";
		}
	}
	return $allSubjectChecklist;
}

function loadChecklist($trainee) {

	//$trackId=traineeTrackId($trainee);
	$allChecklist="";
				
	$sql="SELECT Id,checknum,name,objective FROM app_core_checklist where trackId='1' and upgradeQuery<>'delete'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allChecklist.=$row["Id"]."^".$row["checknum"]."^".$row["name"]."^".$row["objective"]."!";
		}
	}
	return $allChecklist;
}

function loadCompetency($trainee) {

	//$trackId=traineeTrackId($trainee);
	$allCompetency="";
				
	$sql="SELECT Id,assessmentId,taskactivity,corridor,objective FROM app_core_competency where trackId='1' and upgradeQuery<>'delete'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allCompetency.=$row["Id"]."^".$row["assessmentId"]."^".$row["taskactivity"]."^".$row["corridor"]."^".$row["objective"]."!";
		}
	}
	return $allCompetency;
}

function loadCompetencyTask($trainee) {

	//$trackId=traineeTrackId($trainee);
	$allCompetencyTask="";
				
	$sql="SELECT Id,competencyId,no,name FROM app_core_competencytask where trackId='1' and upgradeQuery<>'delete'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allCompetencyTask.=$row["Id"]."^".$row["competencyId"]."^".$row["no"]."^".$row["name"]."!";
		}
	}
	return $allCompetencyTask;
}

function loadChecklistIndex($trainee) {

	//$trackId=traineeTrackId($trainee);
	$allChecklistIndex="";
				
	$sql="SELECT Id,stageid,checknum,realCheckNum FROM app_core_checklistindex where trackId='1' and upgradeQuery<>'delete'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allChecklistIndex.=$row["Id"]."^".$row["stageid"]."^".$row["checknum"]."^".$row["realCheckNum"]."!";
		}
	}
	return $allChecklistIndex;
}

function traineeTrackId($trainee) {
	$trackId;			
	$sql="SELECT trackId FROM app_trainee_track where trainee='$trainee' ";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$trackId=$row["trackId"];
		}
	}
	return $trackId;
}

function updateTraineeVersion($trainee)
{
	$sql="SELECT versionNumber from app_update_version ORDER BY Id DESC LIMIT 1";
	$versionNumber;
	$response="";
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
		$versionNumber=$row["versionNumber"];
		$sqlUpdate="update app_trainee_track set versionNumber='$versionNumber' where trainee='$trainee'";
			if(mysql_query($sqlUpdate,$GLOBALS['connectionInfo']))
				$response=$versionNumber;
			else 
				$response="No Version Number";
		}
	}
	return $response;
}

function getNewVersionNumber($trainee)
{
	$sql="SELECT app_update_version.Id FROM app_trainee_track JOIN app_update_version ON app_trainee_track.versionNumber = app_update_version.versionNumber WHERE trainee ='$trainee'";
	$newId;
	$newVersionNumber="";
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$newId=$row["Id"]+1;
		}
	}
	$sqlnewVersion="SELECT * from app_update_version where Id='$newId'";
	if($resultVersion=mysql_query($sqlnewVersion,$GLOBALS['connectionInfo'])){
		while($rowVersion = mysql_fetch_array($resultVersion)) {
			$newVersionNumber=$rowVersion["versionNumber"];
		}
	}
	return $newVersionNumber;
}

function updateTraineeVersionAfterUpgrade($trainee,$version)
{
	$sqlUpdate="update app_trainee_track set versionNumber='$version' where trainee='$trainee'";
	if(mysql_query($sqlUpdate,$GLOBALS['connectionInfo']))
		$response="Upgrade Done";

	return $response;
}
function upgradeStage($trainee,$version)
{
	//$trackId=traineeTrackId($trainee);
	$allStage="";
				
	$sql="SELECT Id,name,description,upgradeQuery FROM app_core_stage where trackId='1' and versionNumber='$version'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allStage.=$row["Id"]."^".$row["name"]."^".$row["description"]."^".$row["upgradeQuery"]."!";
		}
	}
	return $allStage;
}
function upgradeAssessment($trainee,$version) {

	//$trackId=traineeTrackId($trainee);
	$allAssessment="";
				
	$sql="SELECT Id,stageId,name,timevisible,upgradeQuery FROM app_core_assessment where trackId='1' and versionNumber='$version'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allAssessment.=$row["Id"]."^".$row["stageId"]."^".$row["name"]."^".$row["timevisible"]."^".$row["upgradeQuery"]."!";
		}
	}
	return $allAssessment;
}

function upgradeSubject($trainee,$version) {

	//$trackId=traineeTrackId($trainee);
	$allSubject="";
				
	$sql="SELECT Id,assessmentId,name,objective,requirednum,upgradeQuery FROM app_core_subject where trackId='1' and versionNumber='$version'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allSubject.=$row["Id"]."^".$row["assessmentId"]."^".$row["name"]."^".$row["objective"]."^".$row["requirednum"]."^".$row["upgradeQuery"]."!";
		}
	}
	return $allSubject;
}

function upgradeSubjectChecklist($trainee,$version) {

	//$trackId=traineeTrackId($trainee);
	$allSubjectChecklist="";
				
	$sql="SELECT Id,subjectId,checknum,critical,upgradeQuery FROM app_core_subjectchecklist where trackId='1' and versionNumber='$version'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allSubjectChecklist.=$row["Id"]."^".$row["subjectId"]."^".$row["checknum"]."^".$row["critical"]."^".$row["upgradeQuery"]."!";
		}
	}
	return $allSubjectChecklist;
}

function upgradeChecklist($trainee,$version) {

	//$trackId=traineeTrackId($trainee);
	$allChecklist="";
				
	$sql="SELECT Id,checknum,name,objective,upgradeQuery FROM app_core_checklist where trackId='1' and versionNumber='$version'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allChecklist.=$row["Id"]."^".$row["checknum"]."^".$row["name"]."^".$row["objective"]."^".$row["upgradeQuery"]."!";
		}
	}
	return $allChecklist;
}

function upgradeCompetency($trainee,$version) {

	//$trackId=traineeTrackId($trainee);
	$allCompetency="";
				
	$sql="SELECT Id,assessmentId,taskactivity,corridor,objective,upgradeQuery FROM app_core_competency where trackId='1' and versionNumber='$version'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allCompetency.=$row["Id"]."^".$row["assessmentId"]."^".$row["taskactivity"]."^".$row["corridor"]."^".$row["objective"]."^".$row["upgradeQuery"]."!";
		}
	}
	return $allCompetency;
}

function upgradeCompetencyTask($trainee,$version) {

	//$trackId=traineeTrackId($trainee);
	$allCompetencyTask="";
				
	$sql="SELECT Id,competencyId,no,name,upgradeQuery FROM app_core_competencytask where trackId='1' and versionNumber='$version'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allCompetencyTask.=$row["Id"]."^".$row["competencyId"]."^".$row["no"]."^".$row["name"]."^".$row["upgradeQuery"]."!";
		}
	}
	return $allCompetencyTask;
}
function upgradeChecklistIndex($trainee,$version) {

	//$trackId=traineeTrackId($trainee);
	$allChecklistIndex="";
				
	$sql="SELECT Id,stageid,checknum,realCheckNum,upgradeQuery FROM app_core_checklistindex where trackId='1' and versionNumber='$version'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allChecklistIndex.=$row["Id"]."^".$row["stageid"]."^".$row["checknum"]."^".$row["realCheckNum"]."^".$row["upgradeQuery"]."!";
		}
	}
	return $allChecklistIndex;
}

function upgradeChecklistTask($trainee,$version) {

	//$trackId=traineeTrackId($trainee);
	$allChecklistTask="";
				
	$sql="SELECT Id,checknum,name,taskgroup,upgradeQuery FROM app_core_checklisttask where trackId='1' and versionNumber='$version'";
	
	if($result=mysql_query($sql,$GLOBALS['connectionInfo'])){
		while($row = mysql_fetch_array($result)) {
			$allChecklistTask.=$row["Id"]."^".$row["checknum"]."^".$row["name"]."^".$row["taskgroup"]."^".$row["upgradeQuery"]."!";
		}
	}
	return $allChecklistTask;
}
?>
