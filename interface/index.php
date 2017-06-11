<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang="en"> <![endif]-->
  <!--[if gt IE 8]><!-->
  
	<?php
		
		// session_start();
		//if(session_is_registered(myusername)){
		//	header("location:main.php");
		//}
		
		// Fernando	Start 
		/*if (isset($_SESSION['user'])) {
		   // logged in
		   session_unset();     // unset $_SESSION variable for the run-time 
    	   session_destroy();   // destroy session data in storage
    	   unset($_SESSION['user']);
			unset($_SESSION['pass']);
    	   //header("location:main.php");
		 }*/
		
		 // Fernando end
		 
	?>
  
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
					
				</div>
				<div class="sec-menu-container">
					
				</div>
			</div>
			
			<div class="module-content">
				<div class="content">
					<div class="section-title"></div>
					<div class="screen-content">
						<table class="nogrid login">
							<tr>
								<th colspan="3" class="left">Login</th>
							</tr>
							<tr>
								<td class="prompt" style="border-color:#FFFFFF;">User ID</td>
							</tr>
							<tr>
								<td class="inputfield" style="border-color:#FFFFFF;"><input name="usrname" type="text" id="usrname"></td>
							</tr>
							<tr>
								<td class="prompt" style="border-color:#FFFFFF;">Password</td>
							</tr>
							<tr>
								<td class="inputfield" style="border-color:#FFFFFF;"><input name="passwd" type="password" id="passwd"></td>
							</tr>
							<tr>
								<td class="submit" style="border-color:#FFFFFF;"><a href="#" class="standard-button login-button">Login</a></td>
							</tr>
							<tr class="password-display">
								<td>
									
								</td>
							</tr>
						</table>
					</div>
					
				</div>
			</div>
		</div>

		<script>window.jQuery || document.write('<script src="js/vendor/jquery-1.8.2.min.js"><\/script>')</script>
		<script src="js/vendor/jquery-ui-1.9.1.custom.min.js"></script>
		<script src="js/vendor/jquery.csv-0.71.js"></script>
		
		<script src="js/plugins.js"></script>
		
		<script>
			$('.password-display').hide()
			
			var checkFields = function() {
				if($('#usrname').val().length > 0 && $('#passwd').val().length > 0) 
					$('.login-button').enabled(true);
				else 
					$('.login-button').enabled(false);
			}
			$('#usrname, #passwd').keyup(function() {
				// if both fields have input, enable the login button
				checkFields();
				
				$('.password-display').fadeOut(200);
			});
			
			checkFields();
			
			var doLogin = function() {
				// disable the button while we check
				$('.login-button').enabled(false);
				
				// get the current trainer/assessor info (from the DB, but returned as CSV)
				$.ajax({
						url: '../getinfo.php',
						type: 'POST',
						data: {mode: 'verify', userid:$('#usrname').val(), pass:$('#passwd').val()}
					})
					.done(function( text ) {
						log('from login: '+text)

						if(text == 'Invalid user ID or password') {
							// let the user know the result
							$('.password-display td').html(text);
							
							$('.password-display').hide().fadeIn(200);
						} else {
							window.location = 'main.php';
						}
					})
					.fail(function(jqXHR, textStatus) {
						$('.login').enabled(true);
						
						if(textStatus == 'abort') return;
						
						log('Error logging in: '+jqXHR.status );
					})
			}
			
			$('.login-button').click(function(e) {
				e.preventDefault(); if($(this).hasClass('disabled')) return; 
				
				doLogin();
			});
		</script>
    
		<!--[if lt IE 10]> <script src="js/vendor/pie.js"></script> <![endif]-->
    </body>
</html>
