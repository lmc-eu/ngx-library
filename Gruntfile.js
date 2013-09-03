module.exports = function(grunt) {
    // tasks
    grunt.loadTasks('build/tasks');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-watch'); 
    grunt.loadNpmTasks('grunt-release');
    // configuration
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            banner: '/**\n' +
                ' * <%= pkg.description %>\n' +
                ' * @version v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * @link <%= pkg.homepage %>\n' +
                ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
                ' */'
        },
        concat: {
            dist: {
                src: ['<banner:meta.banner>', 'src/ngx.js', 'src/deps/ecmascript/*.js', 'src/deps/head.js/*.js', 'src/modules/**/!(lang|test)/*.js', 'src/modules/**/lang/*.js'],
                dest: 'dist/ngx.js'
            }
        },
        clean: {
            build: ['dist/']
        },
        copy: {
            dist: {
                files: [
                    {expand: true, cwd: 'src/modules/ui/', src: ['**/*.html'], dest: 'dist/templates/ui/' },
                    {expand: true, cwd: 'libs/', src: ['**'], dest: 'dist/libs'}
                ]
            }
        },
        uglify: {
            // Specify mangle: false to prevent changes to your variable and function names.
            options: {
                mangle: false
            },          
            dist: {
              files: {
                      'dist/ngx.min.js': ['dist/ngx.js']
              }
            }
        },
        recess: {
            dist_css: {
                src: 'src/**/*.less',
                dest: 'dist/styles/ngx.css',
                options: {
                    compile: true
                }
            },
            dist_min: {
                src:  'src/**/*.less',
                dest: 'dist/styles/ngx.min.css',
                options: {
                    compile: true,
                    compress: true
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/ngx.js', 'src/modules/**/*.js']
        },
        watch: {
            scripts: {
                files: ['Gruntfile.js', 'src/*.js', 'src/**/*.js', 'test/**/*.js'],
                tasks: ['lint', 'concat', 'min', 'karma']
            },
            styles: {
                files: ['src/**/*.less'],
                tasks: ['recess']
            },
            templates: {
                files: ['src/modules/**/*.html'],
                tasks: ['copy']
            }
        },
        karma: {
            unit: {
                configFile: 'test/unit/config.js',
                runnerPort: 9999,
                singleRun: true,
                browsers: ['PhantomJS']                
            }
        },
        release: {
            options: {
              npm: false //default: true
            }
          }        
    });

    grunt.registerTask('default', ['jshint', 'clean', 'concat', 'copy', 'uglify', 'recess']);
    grunt.registerTask('devel', ['karma', 'watch']);
};
