<?php


//Encrypt a password using the custom EKP method
//This function calls a JSP page 
//running under TOMCAT to encrypt the password and returns
//the encrypted string 


function EKPencryptPassword($unEncPassword)
{

   $port = 8080;
   $file = "/encryptcentre/jsp/encrypt-password.jsp?".urlencode($unEncPassword);

   $cont = "";
   // IP addresses have changed
   $ip ="116.118.249.142";
   $fp = fsockopen($ip, $port);
   if ( $fp )
   {
       $com = "GET $file HTTP/1.0\r\nAccept: */*\r\nAccept-Language: de-ch\r\nAccept-Encoding: gzip, deflate\r\nUser-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)\r\nHost: $ip:$port\r\nConnection: Keep-Alive\r\n\r\n";
       fputs($fp, $com);
       $cont .= fread($fp, 4096);
       fclose($fp);
       $cont = substr($cont, strpos($cont, "\r\n\r\n") + 4);
    }

    return trim($cont);

}

?>
