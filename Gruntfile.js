"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        nodeunit: {
            all: ['test/*.js']
        },
        watch: {
            scripts: {
                files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
                tasks: ['nodeunit']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['watch']);
};
