<?php
// Test file with array access operations

// Array access operations that should be modified
$value1 = $array['key'] ?? null;
$value2 = $array[$variable] ?? null;
$value3 = $_POST['param'] ?? null;
$value4 = $_GET['param'] ?? null;

// Array access operations that should not be modified
$array['key'] = 'value';
$array[$variable] = 'value';
$_POST['param'] = 'value';
$_GET['param'] = 'value';

// Array access operations that already have the null coalescing operator
$value5 = $array['key'] ?? null;
$value6 = $array[$variable] ?? null;
$value7 = $_POST['param'] ?? null;
$value8 = $_GET['param'] ?? null;

// More complex cases
$value9 = $array['key'] ?? null['subkey'];
$value10 = $array[$variable] ?? null[$subvariable];
$value11 = $_POST['param'] ?? null[$subparam];
$value12 = $_GET['param'] ?? null[$subparam];

// Function calls with array access
functionCall($array['key'] ?? null);
functionCall($_POST['param'] ?? null);

// Array access in conditions
if ($array['key'] == 'value') {
    // Do something
}

if ($_POST['param'] == 'value') {
    // Do something
}

// Array access in loops
foreach ($array['key'] ?? null as $item) {
    // Do something
}

// Array access in string interpolation
echo "Value: {$array['key'] ?? null}";
echo "Value: {$_POST['param'] ?? null}";
