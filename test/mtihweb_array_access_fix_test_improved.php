<?php
// Script to add null coalescing operator to array access operations in PHP files

// Directories to search
$directories = [
    'test/mtihweb/paginas'
];

// Regular expression pattern to match array access operations
// This pattern matches array access operations like $array['key'] but not assignments like $array['key'] = value
// It also handles nested array access operations and array access operations in conditions
$pattern = '/\$([a-zA-Z0-9_]+)(\[[\'"][^\]]*[\'"]\]|\[[^\]]+\])(?!\s*=|\s*\??)/';

// Function to process a file
function processFile($filePath) {
    // Read the file content
    $content = file_get_contents($filePath);

    // Skip if file is empty or not readable
    if ($content === false) {
        echo "Skipping $filePath (not readable)\n";
        return;
    }

    global $pattern;

    // Check if the file contains array access operations
    if (preg_match($pattern, $content)) {
        // Replace array access operations with null coalescing operator
        $newContent = preg_replace_callback($pattern, function($matches) {
            // Don't modify if it already has the null coalescing operator
            if (strpos($matches[0], '??') !== false) {
                return $matches[0];
            }
            return $matches[0] . ' ?? null';
        }, $content);

        // Write the modified content back to the file
        if ($newContent !== $content) {
            file_put_contents($filePath, $newContent);
            echo "Modified $filePath\n";
            return true;
        } else {
            echo "No changes needed in $filePath\n";
            return false;
        }
    } else {
        echo "No array access operations found in $filePath\n";
        return false;
    }
}

// Process all PHP files in the specified directories
foreach ($directories as $directory) {
    echo "Processing directory: $directory\n";

    // Get all PHP files in the directory and its subdirectories
    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($directory)
    );

    foreach ($files as $file) {
        if ($file->isFile() && $file->getExtension() === 'php') {
            processFile($file->getPathname());
        }
    }
}

echo "Done!\n";
