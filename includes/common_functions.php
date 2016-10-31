<?php

$fh=null;
$logfile="";

function openLogFile() {

	$GLOBALS['logfile'] = $GLOBALS['logsfolder'].date("Y-m-d").".log";
	
	if (file_exists($GLOBALS['logfile'])) 
		$fh = fopen($GLOBALS['logfile'], "a") or die("can't open csv file ".$GLOBALS['logfile']." for append");
	else
		$fh = fopen($GLOBALS['logfile'], "w") or die("can't open file ".$GLOBALS['logfile']." for writing");
		
	//fwrite($fh, "Starting process: ".date("d/m/Y H:i:s")."\r\n");
		
	return $fh;

}

function closeLogFile() {

	//fwrite($GLOBALS['fh'], "Process completed: ". date("d/m/Y H:i:s"));
	fclose($GLOBALS['fh']);
	
}

function writeLog($text){
	fwrite($GLOBALS['fh'], $text."\r\n");
}
?>
