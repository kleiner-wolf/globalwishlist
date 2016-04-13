<?php
 $url=$_POST['url'];
 $filename=$_POST['filename'];
 copy($url, $filename);
?>