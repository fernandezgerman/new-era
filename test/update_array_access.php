<?php
// Script to replace array access operations with Arr::get() calls
// Usage: php update_array_access.php

// Define the directories to exclude
$excludeDirs = ['lib', 'PHPMailer'];

// Function to check if a file should be processed
function shouldProcessFile($filePath) {
    global $excludeDirs;

    foreach ($excludeDirs as $dir) {
        if (strpos($filePath, "/$dir/") !== false) {
            return false;
        }
    }

    return true;
}

// Function to add the use statement if it doesn't exist
function addUseStatement($content) {
    if (strpos($content, 'use Illuminate\Support\Arr;') === false) {
        // Find the opening PHP tag
        $pos = strpos($content, '<?php');
        if ($pos !== false) {
            // Insert the use statement after the opening PHP tag
            $content = substr_replace($content, "<?php\nuse Illuminate\Support\Arr;\n", $pos, 5);
        }
    }

    return $content;
}

// Function to replace array access operations with Arr::get() calls
function replaceArrayAccess($content) {
    // Split the content into lines
    $lines = explode("\n", $content);
    $newLines = [];
    $changed = false;

    foreach ($lines as $lineNumber => $line) {
        // Skip lines that are assignments to array elements
        if (preg_match('/\$[a-zA-Z0-9_]+\[[\'"][^\'"]+[\'"]\]\s*=/', $line)) {
            $newLines[] = $line;
            continue;
        }

        // Replace array access operations with Arr::get() calls
        $pattern = '/\$([a-zA-Z0-9_]+)\[([\'"])([^\'"]+)\\2\]/';
        $matchCount = preg_match_all($pattern, $line, $matches, PREG_SET_ORDER);
        echo "Line " . ($lineNumber + 1) . ": " . $line . "\n";
        echo "  Match count: " . $matchCount . "\n";
        if ($matchCount > 0) {
            $newLine = $line;
            foreach ($matches as $match) {
                $array = $match[1];
                $key = $match[3];
                $search = $match[0];
                $replace = "Arr::get(\$$array, '$key')";
                $newLine = str_replace($search, $replace, $newLine);
            }

            if ($newLine !== $line) {
                $changed = true;
                echo "Line " . ($lineNumber + 1) . " - Replaced: $line\n";
                echo "With: $newLine\n";
            }

            $newLines[] = $newLine;
        } else {
            $newLines[] = $line;
        }
    }

    // Join the lines back together
    $newContent = implode("\n", $newLines);

    // Debug output
    if ($changed) {
        echo "Found array access operations to replace.\n";
    } else {
        echo "No array access operations found to replace.\n";
    }

    return $newContent;
}

// Function to process a file
function processFile($filePath) {
    if (!shouldProcessFile($filePath)) {
        echo "Skipping file (excluded directory): $filePath\n";
        return;
    }

    echo "Processing file: $filePath\n";

    // Read the file content
    $content = file_get_contents($filePath);

    // Skip empty files
    if (empty($content)) {
        echo "Skipping empty file: $filePath\n";
        return;
    }

    echo "File size: " . strlen($content) . " bytes\n";

    // Output the first few lines of the file content
    $lines = explode("\n", $content);
    echo "First 10 lines of the file:\n";
    for ($i = 0; $i < min(10, count($lines)); $i++) {
        echo ($i + 1) . ": " . $lines[$i] . "\n";
    }

    // Make a backup of the original file
    $backupPath = $filePath . '.bak';
    file_put_contents($backupPath, $content);

    // Add the use statement if it doesn't exist
    $newContent = addUseStatement($content);

    // Check if the use statement was added
    if ($newContent !== $content) {
        echo "Added use statement\n";
    }

    // Replace array access operations with Arr::get() calls
    $newContent = replaceArrayAccess($newContent);

    // Check if the content has changed and is not empty
    if ($newContent !== $content && !empty($newContent)) {
        // Write the updated content back to the file
        $result = file_put_contents($filePath, $newContent);

        if ($result === false) {
            echo "Error writing to file: $filePath\n";
        } else {
            echo "Updated: $filePath\n";
        }
    } else if (empty($newContent)) {
        echo "Warning: New content is empty for: $filePath. Skipping update.\n";
    } else {
        echo "No changes needed for: $filePath\n";
    }
}

// Function to recursively process files in a directory
function processDirectory($dir) {
    $files = scandir($dir);

    foreach ($files as $file) {
        if ($file === '.' || $file === '..') {
            continue;
        }

        $filePath = "$dir/$file";

        if (is_dir($filePath)) {
            processDirectory($filePath);
        } elseif (pathinfo($filePath, PATHINFO_EXTENSION) === 'php') {
            processFile($filePath);
        }
    }
}

// Check if a specific file was specified
if ($argc > 1) {
    $filePath = $argv[1];
    processFile($filePath);
} else {
    // Start processing the mtihweb directory
    processDirectory('mtihweb');
}

echo "Done!\n";
