module.exports = function(grunt) {
    // tasks
    grunt.loadTasks('build/tasks');
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
                dest: 'dist/ngx.js'
            }
        },
        clean: {
            dist: ['dist/']
        },
        copy: {
            dist: {
                files: {
                    'dist/templates/ui': ['src/modules/ui/**/*.html'],
                    'dist/libs': ['libs/**']
                }
            }
        },
        min: {
            dist: {
                src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
                dest: 'dist/ngx.min.js'
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
                src: '<config:recess.dist_css.dest>',
                dest: 'dist/styles/ngx.min.css',
                options: {
                    compress: true
                }
            }
        },
        lint: {
            files: ['grunt.js', 'src/ngx.js', 'src/lang/*.js', 'src/modules/**/*.js']
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