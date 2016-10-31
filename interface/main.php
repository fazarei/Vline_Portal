<!DOCTYPE html>
	
	<?php
		require '../includes/db_functions.php';
	?>
	
	<?php
		
		session_start();
		//if(!session_is_registered(myusername)){
		//	header("location:index.php");
		//}
		if (isset($_SESSION['user'])) {
		   // logged in
		} else {
		   // not logged in
		  header("location:index.php");
		}
	?>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang="en"> <![endif]-->
  <!--[if gt IE 8]><!-->
  <html class="no-js" lang="en"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>VLine Driver Trainer - App Admin Site</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">
			
        <link rel="stylesheet" type="text/css" href="css/normalize.min.css">
		<link rel="stylesheet" type="text/css" href="css/main.min.css">
        <link rel="stylesheet" type="text/css" href="css/redmond/jquery-ui-1.9.1.custom.css" />
        <link rel="stylesheet" type="text/css" href="css/vline-admin.css">
        
		<script src="js/vendor/modernizr-2.6.2.min.js"></script>
	 </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->
        
		 <h1>
			<?php 
				//echo  "Pageuser = ". $_SESSION['user'];
			?>
		</h1>
		
		<div id="wrapper" class=" pie">
			<div id="navigation-container">
			 <img src="http://vline.globalvision.com.au/vlineappadmin/interface/css/images/bg_p1.png" />
				<div class="site-title">Driver Trainer - App Admin Site</div>
				<div class="main-menu-container">
					<ul>
						<li><a id="home" title="Home" href="#home">Home</a></li>
						<li><a id="assignTrainer" title="Assign Trainer/Assessor" href="#assignTrainer">Assign Trainer/Assessor</a></li>
						<li><a id="traineeList" title="Trainee List" href="#traineeList">Trainee List</a></li>
						<li><a id="generatePassword" title="Generate Temporary Password" href="#generatePassword">Generate Temporary Password</a></li>
						<li><a id="logRecords" title="Log Records" href="#logRecords">Logs</a></li>
					</ul>
				</div>
				<div class="sec-menu-container">
					<ul>
						<!-- <li><a title="Account Information" href="#accountInfo">Account Information</a></li> -->
						<!-- <li class="last">Welcome, Firstname Lastname (<a class="logout" title="Logout" href="#">Logout</a>)</li> -->
						<li class="last"><a class="logout" title="Logout" href="#">Logout</a></li>
					</ul>
				</div>
			</div>
			
			<div class="module-content">
				<div class="underlay-content">
					
				</div>
				
				<div class="content">
					<div class="section-title"></div>
					<div class="screen-content"></div>
				</div>
				
				
				<div class="overlay-content">
					
				</div>
			</div>
		</div>

		<script>window.jQuery || document.write('<script src="js/vendor/jquery-1.8.2.min.js"><\/script>')</script>
		<script src="js/vendor/jquery-ui-1.9.1.custom.min.js"></script>
		<script src="js/vendor/jquery.csv-0.71.js"></script>
    
		<!--[if lt IE 10]> <script src="js/vendor/pie.js"></script> <![endif]-->
		
		<?php
			// get the trainer/assessor list (to use later)
			$trainerAssessorListData = getTrainerAssessorInfo();
			// save it as a JS variable
			echo '<script type="text/javascript">var trainerAssessorListData = $.csv.toArrays('.json_encode($trainerAssessorListData).');</script>';
			
			// get the list of groups (to use later)
			$groupListData = getGroups();
			// save it as a JS variable
			echo '<script type="text/javascript">var groupArrays = $.csv.toArrays('.json_encode($groupListData).');</script>';
			
			// get the list of stages (to use later)
			$stageListData = getStages();
			// save it as a JS variable
			echo '<script type="text/javascript">var stageArrays = $.csv.toArrays('.json_encode($stageListData ).');</script>';
			
			// get the trainee list (to use later)
			$traineeListData = getTraineeList();
			// save it as a JS variable
			echo '<script type="text/javascript">var traineeListData = $.csv.toArrays('.json_encode($traineeListData).');</script>';
			
			$traineeListDataGroup = getTraineeListGroup();
			// save it as a JS variable
			echo '<script type="text/javascript">var getTraineeListGroup = $.csv.toArrays('.json_encode($traineeListDataGroup).');</script>';
			
			// get the Checklists and Assessment Data (to use later)
			$checklistsnAsseementData = getTotalChklistAssesslist();
			// save it as a JS variable
			echo '<script type="text/javascript">var checklistAndAssessmentsData = $.csv.toArrays('.json_encode($checklistsnAsseementData).');</script>';
			
			
			// get the logs Data (to use later)
			/*$logauditData = getAuditLog();
			// save it as a JS variable
			echo '<script type="text/javascript">var tableData = $.csv.toArrays('.json_encode($logauditData).');</script>';*/
			
			
		?>
		
		<script>
			//alert('data:'+groupArrays);
		</script>
		
		<script src="js/plugins.js"></script>
        <script src="js/main.js"></script>
		
    </body>
</html>
