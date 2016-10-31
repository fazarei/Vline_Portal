<?php

	session_start();
	$sid = session_id();
	echo $sid;
	echo "<br />";
	
	//destroy session
	session_destroy();
	session_unset();
	
	//now start the new session
	session_start();
	session_regenerate_id(true);
	$sid = session_id();
	echo $sid;
	
	header("Location: index.php")
	/*session_start();
	
	unset($_SESSION['user']);
	
	session_unset();   
	session_destroy();
	session_start();
	$_SESSION = array();*/
	
	//header("Location: index.php");

?>

