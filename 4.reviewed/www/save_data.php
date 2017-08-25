<?php
/**
 * и для анализа R => .txt
 */
$data = @$_REQUEST['data'];
$file = @$_REQUEST['file'];
$fp = fopen($file . '.txt', 'w');
foreach ($data as $key => $value) {
	fwrite($fp, $value . PHP_EOL);
}
fclose($fp);

