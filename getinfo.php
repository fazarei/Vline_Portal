<?php

require_once('includes/config.inc.php');
require_once('includes/db_functions.php');
require_once('includes/auth.php');

$GLOBALS['fh'] = openLogFile();

if($_POST) {
	
	$csvdata="";
		
	$mode=$_POST['mode'];

	writeLog(date('Y-m-d H:i:s')." - Mode:  $mode");
	
	switch($mode){
		
		case "verify":
			$userid="";
			$pass="";
			if (isset($_POST['userid']))
				$userid = $_POST['userid'];
				
			if (isset($_POST['pass']))
				$pass = EKPencryptPassword($_POST['pass']);
				
					
			$csvdata=verifyUser($userid,$pass);
			break;
		
		case "trainee":
		
			$lpassword ="";
			$username ="";
			$email ="";
			
			if (isset($_POST['username']))
				$username = $_POST['username'];
		
			if (isset($_POST['pass']))
					$lpassword = EKPencryptPassword($_POST['pass']);
					
			if (isset($_POST['email']))
					$email = $_POST['email'];
		
			$csvdata=getTraineeInfo($username,$lpassword,$email);
			break;
		
		case "trainerassessor":
			$csvdata=getTrainerAssessorInfo();
			break;
		
		case "traineelist":
			$csvdata=getTraineeList();
			break;
			
		case "traineelistgroup":
			$csvdata=getTraineeListGroup();
			break;	
	
		case "users":
			$excludes="";
			$userid="";
			
			if (isset($_POST['excludes']))
				$excludes = $_POST['excludes'];
				
			if (isset($_POST['userid']))
				$userid = $_POST['userid'];
				
			$csvdata=getUsers($excludes,$userid);
			break;
			
		case "settrainerassessor":
			$csvdata=(isset($_POST['data'])) ? setTrainerAssessor($_POST['data']) : "Empty File" ;
			break;
			
		case "stages":
			$csvdata=getStages();
			break;
			
		case "groups":
			$csvdata=getGroups();
			break;
		case "totalchklistassesslist":
			$stageid="";
			
			if (isset($_POST['stageid'])) 
				$stageid = $_POST['stageid'];
				
			$csvdata=getTotalChklistAssesslist($stageid);
			break;
			
		case "checklistindex":
			$stageid="";
			if (isset($_POST['stageid'])) 
				$stageid = $_POST['stageid'];
				
			$csvdata=getChecklistIndex($stageid);
			break;
			
		case "asesslistindex":
			$stageid="";
			if (isset($_POST['stageid'])) 
				$stageid = $_POST['stageid'];
				
			$csvdata=getAssesslistIndex($stageid);
			break;
		
		case "checklistdata":
			$trainee="";
			$checklistid="";
		
			if (isset($_POST['trainee'])) 
				$trainee = $_POST['trainee'];
				
			if (isset($_POST['checklistid'])) 
				$checklistid = $_POST['checklistid'];
				
			$csvdata=getChklistData($trainee,$checklistid);
			break;
		
		case "checklisttask":
			$trainee="";
			$checklistid="";
			if (isset($_POST['trainee'])) 
				$trainee = $_POST['trainee'];
				
			if (isset($_POST['checklistid'])) 
				$checklistid = $_POST['checklistid'];
				
			$csvdata=getChklistTask($trainee,$checklistid);
			break;
		
		case "assessmentdetail":
			$trainee="";
			$assessmentid="";
			$stageid="";
			if (isset($_POST['trainee'])) 
				$trainee = $_POST['trainee'];
				
			if (isset($_POST['assessmentid'])) 
				$assessmentid = $_POST['assessmentid'];
			
			if (isset($_POST['stageid'])) 
				$stageid = $_POST['stageid'];
			
			$csvdata=($stageid=="10") ? getAssessment10Detail($trainee,$assessmentid,$stageid) : getAssessmentDetail($trainee,$assessmentid,$stageid);
			break;
			
		case "generatepasswd":
			$userid="";
			$trainer = "";
			$assessor = "";
			$email = "";
		
			if (isset($_POST['userid']))
				$userid = $_POST['userid'];
				
				$trainer = $_POST['trainer'];
				$assessor = $_POST['assessor'];
				
			$csvdata = EKPencryptPassword( $userid.$GLOBALS['shared_key'] ).$trainer.$assessor;
			
			if (isset($_POST['email'])) {
				$email = $_POST['email'];
				
				if($email != '') {
					// TODO: send an email with the password
					$to = $email;
					$subject = "VLine Driver Trainer - Temporary user details";
					$message = "A temporary password has been generated for the user '".$userid."'.\n\nTemporary password: ".$csvdata;
					$from = "no-reply@gvmedia.com.au";
					$headers = "From:" . $from;
					@mail($to, $subject, $message, $headers);
				}
			}
			
			break;
		case "upload":
			
			if (isset($_POST['tblname']) && isset($_POST['data'])) {
					$trainee = $_POST['trainee'];
					$tblname = $_POST['tblname'];
					$data = $_POST['data'];
					$csvdata=insertCSV($trainee,$tblname,$data);
			}
			break;
		
		case "auditlog":
			$csvdata=getAuditLog($_POST['tblname']);
			break;
			
		case "insertAssessorTrainer":
				insertAssessorTrainer($_POST['data']);
			break;
		
		case "loadStage":
			$csvdata=loadStage($_POST['trainee']);
			break;
		
		case "loadAssessment":
			$csvdata=loadAssessment($_POST['trainee']);
			break;
		
		case "loadSubject":
			$csvdata=loadSubject($_POST['trainee']);
			break;

		case "loadSubjectChecklist":
			$csvdata=loadSubjectChecklist($_POST['trainee']);
			break;	

		case "loadChecklist":
			$csvdata=loadChecklist($_POST['trainee']);
			break;	

		case "loadChecklistIndex":
			$csvdata=loadChecklistIndex($_POST['trainee']);
			break;	

		case "loadCompetency":
			$csvdata=loadCompetency($_POST['trainee']);
			break;	

		case "loadCompetencyTask":
			$csvdata=loadCompetencyTask($_POST['trainee']);
			break;	

		case "updateTraineeVersion":
			$csvdata=updateTraineeVersion($_POST['trainee']);
			break;				
		
		case "getNewVersionNumber":	
			$csvdata=getNewVersionNumber($_POST['trainee']);
			break;
			
		case "updateTraineeVersionAfterUpgrade":
			$csvdata=updateTraineeVersionAfterUpgrade($_POST['trainee'],$_POST['version']);
			break;

		case "upgradeStage":
			$csvdata=upgradeStage($_POST['trainee'],$_POST['version']);
			break;	
			
		case "upgradeAssessment":
			$csvdata=upgradeAssessment($_POST['trainee'],$_POST['version']);
			break;	

		case "upgradeSubject":
			$csvdata=upgradeSubject($_POST['trainee'],$_POST['version']);
			break;	

		case "upgradeSubjectChecklist":
			$csvdata=upgradeSubjectChecklist($_POST['trainee'],$_POST['version']);
			break;

		case "upgradeChecklist":
			$csvdata=upgradeChecklist($_POST['trainee'],$_POST['version']);
			break;

		case "upgradeCompetency":
			$csvdata=upgradeCompetency($_POST['trainee'],$_POST['version']);
			break;
			
		case "upgradeCompetencyTask":
			$csvdata=upgradeCompetencyTask($_POST['trainee'],$_POST['version']);
			break;
			
		case "upgradeChecklistIndex":
			$csvdata=upgradeChecklistIndex($_POST['trainee'],$_POST['version']);
			break;

		case "upgradeStage":
			$csvdata=upgradeStage($_POST['trainee'],$_POST['version']);
			break;

		case "upgradeChecklistTask":
			$csvdata=upgradeChecklistTask($_POST['trainee'],$_POST['version']);
			break;			
		
		default:
			$csvdata="No Record Found";
	}
	
	if($csvdata=="")
		$csvdata="No Record Found";
	
	echo $csvdata;
        writeLog(date('Y-m-d H:i:s')." - Result : $csvdata \r\n");	
}

closeLogFile();
mysql_close($GLOBALS['connectionInfo']);

?>
