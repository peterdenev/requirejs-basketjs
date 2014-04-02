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
     var getAbsolute = function(relative, base) {
        base = typeof base !== 'undefined' ?  base : '';
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); // remove current file name (or empty string)
                     // (omit if "base" is the current folder without trailing slash)
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
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
            var unique = (typeof modules_md5 !== 'undefined') ? modules_md5[getAbsolute(url)] : 1;
            if(config.basket && config.basket.unique && config.basket.unique.hasOwnProperty(moduleName) ){
                unique = config.basket.unique[moduleName];
            }
            basket.require({ url: url,unique:unique }).then(function () {
                context.completeLoad(moduleName);
            }, function (error) {
                // TODO: Support path fallback.
                context.onError(error);
            });
        }
    };
}());

