require.config({
    baseUrl: 'js/modules',
    paths: {       
        general: '../general',        
    },
    // if basket.checksums is correct implemented there will be no need of this settings
    basket: {
        excludes: ['general'],
        unique:{
            // uncomment and change the num if you want to force reload this module
            // since php make checksum the files that will be optional
            //util: 1  
        }
    }
});

// Load the main app module to start the app
requirejs(["general"]);