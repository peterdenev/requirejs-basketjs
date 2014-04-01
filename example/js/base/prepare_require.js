basket.require({ url: init_libs['require'], unique:modules_md5[init_libs['require']] })
.then(function(){               
    basket.require({ url: init_libs['loader'], key: 'basket_loader', unique:modules_md5[init_libs['loader']] })
    .then(function(){                    
        basket.require({ url: init_libs['config'],unique:modules_md5[init_libs['config']] })
    })
})