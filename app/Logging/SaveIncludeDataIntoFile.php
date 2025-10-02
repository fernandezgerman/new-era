<?php

namespace App\Logging;

use Illuminate\Support\Facades\Log;

class SaveIncludeDataIntoFile
{
    public function __construct(
        protected string $logFileName,
        protected string $includeFileName,
    )
    {

    }

    public function __invoke()
    {
        try{

            ob_start();

            // 2. Include the file whose output you want to save
            include $this->includeFileName;

            // 3. Get the buffered contents into a variable
            $output_content = ob_get_contents();

            // 4. Clean and end output buffering
            ob_end_clean();

            // 5. Write the captured content to a file
            file_put_contents(storage_path('logs/'.$this->logFileName), $output_content);
        }catch (\Throwable $exception){
            Log::error($exception->getMessage(), ['exception' => $exception]);
        }
    }
}
