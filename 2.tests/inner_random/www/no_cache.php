<?php
/**
 * тупое но эффективное решение чтобы билды не "кешировались" после пересборок
 */
$f = @$_REQUEST['f'];
if (!$f) die('no file');

$file = file_get_contents('../truf/build/contracts/' . $f);

header("Content-type:application/json");
echo $file;