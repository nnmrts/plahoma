<?php
$data = $_POST['data'];
$file = "generated/placeholder-" . md5(uniqid()) . ".png";

// remove "data:image/png;base64,"
$uri =  substr($data,strpos($data,",") );

// save to file
file_put_contents($file, base64_decode($uri));

// return the filename
$file = trim($file,'"');
echo json_encode($file);