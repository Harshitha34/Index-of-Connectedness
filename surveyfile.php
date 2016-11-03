<!DOCTYPE html PUBLIC"-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" /></head>
<body>
<?php
$use=$_POST['survey'];
$feedback=$_POST['feedback'];
$filename="newfile.txt";
if($use =='Yes')
	$f= 'User has found this information useful.';
else
	$f= "User has not found this information useful.";
$d='Feedback provided by user is : '.$feedback.' ';
echo 'Form data has been saved to '.$filename.'  <br>
<a href="'.$filename.'">Click here to read </a> ';
$myfile = fopen($filename, "w");
fwrite($myfile, $f);
fwrite($myfile ,"\r\n" .$d);
fclose($myfile);
?>
</body>
</html>


