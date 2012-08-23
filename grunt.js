module.exports = function(grunt) {
    // tasks
    grunt.loadTasks('grunt/tasks');
    grunt.loadNpmTasks('grunt-recess');

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
                src: ['<banner:meta.banner>', 'src/ngx.js', 'src/**/*.js'],
                dest: 'build/ngx.js'
            }
        },
        clean: {
            dist: ['build/']
        },
        copy: {
            dist: {
                files: {
                    'build/templates/ui': ['src/modules/ui/**/*.html'],
                    'build/libs': ['libs/**']
                }
            }
        },
        min: {
            dist: {
                src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
                dest: 'build/ngx.min.js'
            }
        },
        recess: {
            dist_css: {
                src: 'src/**/*.less',
                dest: 'build/styles/ngx.css',
                options: {
                    compile: true
                }
            },
            dist_min: {
                src: '<config:recess.dist_css.dest>',
                dest: 'build/styles/ngx.min.css',
                options: {
                    compress: true
                }
            }
        },
        lint: {
            files: ['grunt.js', 'src/*.js', 'src/**/*.js']
        },
        watch: {
            scripts: {
                files: ['grunt.js', 'src/*.js', 'src/**/*.js'],
                tasks: 'lint concat min'
            },
            styles: {
                files: ['src/**/*.less'],
                tasks: 'recess'
            },
            templates: {
                files: ['src/modules/**/*.html'],
                tasks: 'copy'
            }
        }
    });

    // default task
    grunt.registerTask('default', 'lint clean concat copy min recess');

};