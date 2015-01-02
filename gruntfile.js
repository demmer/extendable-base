module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        gruntDry: {
            pkg: pkg,
            deps: {
                chai: {
                    browserBuild: 'node_modules/chai/chai.js',
                    testOnly: true
                },
                underscore: {
                    browserBuild: 'node_modules/underscore/underscore.js'
                }
            }
        }
    });

    grunt.task.loadNpmTasks('grunt-dry');
};
