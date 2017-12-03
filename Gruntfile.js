module.exports = function (grunt) {
    'use strict';

    var config = {
        APP: 'snake',
        PUBLIC: 'public',
        ROOT: '.',
        BOWER_PUBLIC: 'bower_components',
        PACKAGE: grunt.file.readJSON('package.json')
    };

    grunt.initConfig({
        config: config,

        clean: {
            client: [
                '<%= config.PUBLIC %>/assets/*'
            ],
            post: [
                '<%= config.PUBLIC %>/assets/*',
                '!<%= config.PUBLIC %>/assets/*.min.*'
            ]
        },

        less: {
            public: {
                options: {
                    paths: ['assets/css'],
                    cleancss: true,
                    compress: true,
                    plugins: [
                        new (require('less-plugin-autoprefix'))({
                            browsers: ["Firefox >= 20", "Chrome >= 34", "Explorer >= 11"]
                        })
                    ]
                },
                files: {
                    '<%= config.PUBLIC %>/assets/<%= config.APP %>.min.css':
                        '<%= config.ROOT %>/less/app.less'
                }
            }
        },

        injector: {
            index: {
                options: {
                    ignorePath: '<%= config.PUBLIC %>',
                    addRootSlash: false,
                    transform: function (filename, index, count) {
                        var extension = filename.split('.').pop().toLowerCase();
                        switch (extension) {
                            case 'css':
                                return '<link rel="stylesheet" href="' + filename + '">';
                            case 'js':
                                return '<script src="' + filename + '" type="text/javascript"></script>';
                            case 'html':
                                return '<link rel="import" src="' + filename + '">';
                        }
                    }
                },
                files: {
                    '<%= config.PUBLIC %>/index.html': [
                        '<%= config.PUBLIC %>/assets/*.min.js',
                        '<%= config.PUBLIC %>/assets/*.min.css'
                    ]
                }
            },
            serviceWorker: {
                options: {
                    starttag: '// -- injector --',
                    endtag: '// -- endinjector --',
                    ignorePath: '<%= config.PUBLIC %>',
                    addRootSlash: true,
                    transform: function (filename, index, count) {
                        var name = '\'' + filename + '\'';
                        return name + (index < count - 1 ? ',' : '');
                    }
                },
                files: {
                    '<%= config.PUBLIC %>/service-worker.js': [
                        '<%= config.PUBLIC %>/assets/**/*.*',
                        '!<%= config.PUBLIC %>/assets/**/*.map',
                        '<%= config.PUBLIC %>/images/**/*.*'
                    ]
                }
            }
        },

        eslint: {
            target: [
                '<%= config.ROOT %>/src/**/*.js'
            ],
            options: {
                configFile: 'eslint.json'
            }
        },

        lintspaces: {
            src: [
                '<%= config.PUBLIC %>/**/*.html',
                '<%= config.ROOT %>/less/**/*.less'
            ],
            options: {
                newline: true,
                //newlineMaximum: 2,
                trailingspaces: true,
                indentation: 'spaces',
                spaces: 4
            }
        },

        lesslint: {
            src: ['<%= config.ROOT %>/less/app.less'],
            options: {
                imports: ['<%= config.ROOT %>/less/**/!(app).less'],
                csslint: {
                    'adjoining-classes': false,
                    'box-sizing': false,
                    'box-model': false,
                    'fallback-colors': false,
                    'gradients': false,
                    'universal-selector': false,
                    'font-sizes': false
                }
            }
        },

        watch: {
            less: {
                files: ['<%= config.ROOT %>/less/**/*.less'],
                tasks: ['less:public'],
                options: {
                    spawn: false
                }
            },
            src: {
                files: [
                    '<%= config.ROOT %>/src/**/*.ts',
                    '!<%= config.ROOT %>/src/**/*.spec.ts'
                ],
                tasks: ['browserify:client', 'exorcise:client', 'uglify', 'clean:post'],
                options: {
                    spawn: false
                }
            }
        },

        browserify: {
            vendor: {
                options: {
                    browserifyOptions: {
                        debug: true
                    },
                    transform: [
                        ['uglifyify', {global: true}]
                    ],
                    require: ['aframe', 'three']
                },
                src: [],
                dest: '<%= config.PUBLIC %>/assets/vendor-<%= config.PACKAGE.version %>.min.js'
            },
            client: {
                options: {
                    browserifyOptions: {
                        debug: true
                    },
                    transform: [
                        ['babelify', {presets: ['es2015']}]
                    ],
                    plugin: [
                        ['tsify', {
                            noImplicitAny: true,
                            target: 'es5'
                        }]
                    ],
                    exclude: ['aframe', 'three']
                },
                files: {
                    '<%= config.PUBLIC %>/assets/<%= config.APP %>-<%= config.PACKAGE.version %>.js': [
                        '<%= config.ROOT %>/src/**/*.ts',
                        '!<%= config.ROOT %>/src/**/*.spec.ts'
                    ]
                }
            }
        },

        exorcise: {
            vendor: {
                options: {},
                files: {
                    '<%= config.PUBLIC %>/assets/vendor-<%= config.PACKAGE.version %>.min.js.map':
                        '<%= config.PUBLIC %>/assets/vendor-<%= config.PACKAGE.version %>.min.js'
                }
            },
            client: {
                options: {},
                files: {
                    '<%= config.PUBLIC %>/assets/<%= config.APP %>-<%= config.PACKAGE.version %>.js.map':
                        '<%= config.PUBLIC %>/assets/<%= config.APP %>-<%= config.PACKAGE.version %>.js'
                }
            }
        },

        uglify: {
            options: {
                mangle: true,
                sourceMap : true,
                sourceMapIncludeSources : true,
                sourceMapIn : '<%= config.PUBLIC %>/assets/<%= config.APP %>-<%= config.PACKAGE.version %>.js.map'
            },
            dist: {
                src: '<%= config.PUBLIC %>/assets/<%= config.APP %>-<%= config.PACKAGE.version %>.js',
                dest: '<%= config.PUBLIC %>/assets/<%= config.APP %>-<%= config.PACKAGE.version %>.min.js'
            }
        },

        zip: {
            release: {
                router: function (filepath) {
                    filepath = filepath.replace(/^public/, config.APP + '-' + config.PACKAGE.version);
                    return filepath;
                },
                src: [
                    'public/**/*'
                ],
                dest: '<%= config.ROOT %>/releases/<%= config.APP %>-<%= config.PACKAGE.version %>.zip'
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-exorcise');
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-lesslint');
    grunt.loadNpmTasks('grunt-lintspaces');
    grunt.loadNpmTasks('grunt-zip');

    grunt.registerTask('default', [
        'eslint', 'lintspaces', 'lesslint', 'clean:client', 'less', 'browserify:client',
        'exorcise:client', 'uglify', 'clean:post', 'injector'
    ]);
    grunt.registerTask('release', ['default', 'zip']);
};
