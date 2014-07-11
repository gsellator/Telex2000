/*global module:false*/
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /* Clean the folder which will recieve the file to deploy */
        clean: ["pkg/"],

        /* Update the app version in the Package.json */
        bump: {
            options: {
                commit: false,
                createTag: false,
                push: false
            }
        },

        /* Copy the needed files you will deploy */
        copy: {
            package: {
                src: 'package.json',
                dest: 'pkg/',
            },
            server0: {
                src: '.printer',
                dest: 'pkg/',
            },
            server1: {
                src: 'app.js',
                dest: 'pkg/',
            },
            server4: {
                src: 'public/**/*',
                dest: 'pkg/',
            },
            server5: {
                src: 'views/**/*',
                dest: 'pkg/',
            },
            server6: {
                src: 'model.js',
                dest: 'pkg/',
            }
        },

        /* Deploy to you server */
        'sftp-deploy': {
            prod: {
                auth: {
                    host: '91.121.177.78',
                    port: 22,
                    authKey: 'prod'
                },
                src: 'pkg',
                dest: '/home/Telex2000-prod/Telex2000',
                server_sep: '/'
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sftp-deploy');

    grunt.registerTask('prod', ['clean', 'bump', 'copy', 'sftp-deploy:prod']);
};