<?php

function getJSmodulesMD5($baseDir='js'){
    $modules_md5 = array();
    try {
        $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($baseDir, RecursiveDirectoryIterator::SKIP_DOTS));
        foreach ($iterator as $file) {         
            $module_key = str_replace('\\','/',$file->getPathName());    
            $modules_md5[$module_key] = md5_file($file->getPathName());       
        }   
    } catch (Exception $e) {
        //TODO show an error
    }
    return $modules_md5;
}

?>

<!DOCTYPE html>
<html>
    <head>
        <title>My Sample Project</title>        
        <script type="text/javascript" src="js/base/basket.full.min.js"></script>         
         <script>
            // 1) config the path to js files
            var modules_md5 = <?php echo json_encode(getJSmodulesMD5('js')); ?>;
            // 2) config the path to base js libs            
            var init_libs = {
                prepare: 'js/base/prepare_require.js',
                require: 'js/base/require.js',
                loader: 'js/base/basket-loader.js',
                // 3) config the main (general) js for require.js in require_conf.js
                config: 'js/require_conf.js'
            };
            // 3) run
            basket.require({ url: init_libs['prepare'], unique:modules_md5[init_libs['prepare']] });                     
            // try:
            // 1) js/modules/util.js ->  uncomment "foo: bar" row
            // 2) Refresh. That's all. Enjoy :)           
        </script>
    </head>
    <body>
        <h1>My Sample Project</h1>
    </body>
</html>