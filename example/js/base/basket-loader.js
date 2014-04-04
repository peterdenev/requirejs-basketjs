/**
 * requirejs-basketjs
 * Author: Andrew Wakeling <andrew.wakeling@gmail.com>
 * requirejs-basketjs may be freely distributed under the MIT license.
 *
 * Load require.js modules via basket.js.
 */

/**
 * For more information about this function, see comments in "req.load" in require.js.
 *
 * @param {Object} context the require context to find state.
 * @param {String} moduleName the name of the module.
 * @param {Object} url the URL to the module.
 */
;(function () {
    /**
     * absolute path function based on:
     * http://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
     */
    var getAbsolute = function(relative) {        
        var stack = [],
            parts = relative.split("/");        
        for (var i in parts) {
            if (parts[i] == ".") {continue;}
            (parts[i] == "..") ? stack.pop() : stack.push(parts[i]);
        }
        return stack.join("/");
    }

    var original_loader = requirejs.load;
    requirejs.load = function (context, moduleName, url) {
        /**
         * There is currently no public way to access requirejs's config.
         * As suggested by James Burke, we can somewhat rely on the semi-private "requirejs.s.contexts._.config" as it has not changed between 1.0 and 2.0.
         *
         * Source: https://groups.google.com/forum/#!topic/requirejs/Hf-qNmM0ceI
         */

        var config = requirejs.s.contexts._.config;
        if (config.basket && config.basket.excludes && config.basket.excludes.indexOf(moduleName) !== -1) {
            original_loader(context, moduleName, url);
        } else {            
            var b_reqire = { url: url };            
            if(config.basket && config.basket.unique && config.basket.unique.hasOwnProperty(moduleName) ){
                b_reqire.unique = config.basket.unique[moduleName];
            }            
            basket.require(b_reqire).then(function () {
                context.completeLoad(moduleName);
            }, function (error) {
                // TODO: Support path fallback.
                context.onError(error);
            });
        }
    };
}());

