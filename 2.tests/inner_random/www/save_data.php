<?php
/**
 * и для анализа R => .txt
 */
$data = @$_REQUEST;

$fp = fopen('results.txt', 'w');
foreach ($data as $key => $value) {
	fwrite($fp, $value . PHP_EOL);
}
fclose($fp);