<?php
// Script to search for array access operations in a specific file
// Usage: php search_array_access.php <file_path>

if ($argc < 2) {
    echo "Usage: php search_array_access.php <file_path>\n";
    exit(1);
}

$filePath = $argv[1];

// Read the file content
$content = file_get_contents($filePath);

// Split the content into lines
$lines = explode("\n", $content);

// Search for array access operations
$pattern = '/\$([a-zA-Z0-9_]+)\[([\'"])([^\'"]+)\\2\]/';
$found = false;

foreach ($lines as $lineNumber => $line) {
    if (preg_match_all($pattern, $line, $matches, PREG_SET_ORDER)) {
        $found = true;
        echo "Line " . ($lineNumber + 1) . ": $line\n";
        foreach ($matches as $match) {
            echo "  Array: $match[1], Key: $match[3]\n";
        }
    }
}

if (!$found) {
    echo "No array access operations found in $filePath\n";
}
