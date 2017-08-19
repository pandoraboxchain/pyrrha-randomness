<?php
/**
 * и для анализа R => произвольный массив для сверки .txt
 */

$fp = fopen(__DIR__ . '/results.csv', 'w');
fwrite($fp, 'x' . PHP_EOL);
for($i = 0; $i<200; $i++) {
	$value = random_int( 0 , 10000000000) % 100;	
	fwrite($fp, $value . PHP_EOL);
}
fclose($fp);