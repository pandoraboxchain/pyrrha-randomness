<?php
/**
 * и для анализа R => .txt
 */
$data = @$_REQUEST['data'];

$fp = fopen('results.csv', 'w');
fwrite($fp, 'x' . PHP_EOL);
foreach ($data as $key => $value) {
	fwrite($fp, $value . PHP_EOL);
}
fclose($fp);