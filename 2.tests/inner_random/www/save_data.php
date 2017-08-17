<?php
/**
 * и для анализа нам удобнее csv ага)
 */
$data = @$_REQUEST;

$fp = fopen('results.csv', 'w');
foreach ($data as $key => $value) {
	fwrite($fp, $key . ';' . $value . PHP_EOL);
}
fclose($fp);