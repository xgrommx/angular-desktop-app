define(['./module', '_'], function (views, _) {
    'use strict';

    var templates = {};

    var jade = require('jade'),
        fs = require('fs'),
        path = require('path');

    fs.readdir(path.resolve('./views'), function(err, files)   {
        console.log("Found %d files", files.length);
        _.each(files, function(f) {
            templates[f.substring(0, f.length - 5)] = {
                tmplfile:fs.readFileSync(path.resolve('./views', f)),
                compiled:false
            };
        });
    });

    views.provider('view', function() {

        this.renderView = function(name, context, options) {
            return function(params, path) {
                var tmpl = templates[name];

                if(!tmpl.compiled) {
                    console.log("View isn't compiled, compiling it now");
                    tmpl.tmpl = jade.compile(tmpl.tmplfile);
                    tmpl.compiled = true;
                }

                return tmpl.tmpl(_.extend(context || {}, {
                    params:params,
                    path:path
                }));
            };
        };

        function ViewRenderer() {

        }

        this.$get = function() {
            return new ViewRenderer();
        };

    });

});
