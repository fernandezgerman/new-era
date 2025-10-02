<?php

namespace App\Logging;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class SaveIncludeDataIntoFile
{
    protected string $logFileName = 'general.log';
    public function __construct(
        protected string $includeFileName,
    )
    {
        $sufix = Carbon::now()->startOfMonth()->format('_Y_m');
        $aux = explode('/', $this->includeFileName);
        $this->logFileName = str_replace(".php", $sufix.".log", $aux[count($aux) - 1]);
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

            Log::info(storage_path('logs/'.$this->logFileName));
            // 5. Write the captured content to a file
            file_put_contents(storage_path('logs/'.$this->logFileName), PHP_EOL.$output_content, FILE_APPEND);
        }catch (\Throwable $exception){
            Log::error($exception->getMessage(), ['exception' => $exception]);
        }
    }
}
