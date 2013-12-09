module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    debug: false,

    // Clean deploy folder //
    clean: {
      dist:{
        files: [
          {
            dot: true,
            src: ['deploy/**/*', '**/*.min.min.*']
          }
        ]
      }
    },

    // Copy images and html to deploy //
    copy: {
      dist: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'src/',
            dest: 'deploy/',
            src: [
              'img/*.{jpg,jpeg,png,gif,svg}', // images
              '*.html' // html pages
            ]
          }
        ]
      }
    },

    // Concat pre-minified JS and CSS files (use WebStorm's file-watchers for minification) //
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= grunt.file.readJSON(\'package.json\').version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %>*/'
      },
      js: {
        src: ['src/**/*.min.js'],
        dest: 'deploy/main.min.js'
      },
      css: {
        src: ['src/**/*.min.css'],
        dest: 'deploy/style.min.css'
      }
    },

    // Replace script/css paths with minified names //
    useminPrepare: {
      html: 'src/*.html',
      options: {
        dest: 'deploy'
      }
    },
    usemin: {
      html: ['deploy/*.html'],
      css: ['deploy/css/*.css'],
      options: {
        dirs: ['deploy']
      }
    },
    
    replace: {
      dist: {
      	options: [{
      	  // Strip paths from image urls //
          find: /([\(|"|']+)\W*?img\//gi, 
          repl: '$1'
      	},{
      	  // Rename console.log statements to just 'log' //
          find: /([^window\.])console\.\w+?\(/gi,
          repl: '$1log('
      	},{
      	  // Update version meta tag //
          find: /(<meta.+?"date".+?content=").*?"/i,
          repl: '$1<%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %>"'
	  	}],
	    src: [
	      'deploy/*.min.{css,js}', 
	      'deploy/*.html'
	    ]
	  },
	  debug: {
	  	options: [{
      	  // Add debug flag after banner in main.min.js //
          find: /\*\//,
          repl: '*/\nvar DEBUG = <%=debug%>;\n'
	  	}],
	  	src: ['deploy/main.min.js']
	  }
    }
	
  });

  // Load plugins for necessary tasks //
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
  grunt.registerMultiTask('replace','',function(){  	
  	var s;
  	
  	grunt.log.writeln('Applying regex replace to following files:');
  	this.filesSrc.forEach(function(file){
  	  grunt.log.writeln('    - '.white + file.cyan);
  	  s = grunt.file.read(file);
  	  this.data.options.forEach(function(item){
  	  	s = s.replace(new RegExp(item.find), item.repl);
  	  });
  	  grunt.file.write(file, s);
  	},this);
  });

  grunt.registerTask('debug', function(){
    grunt.config.set('debug', 'true');
    grunt.task.run('default');
  });
  
  grunt.registerTask('default', [
    'clean',
    'concat',
    'useminPrepare',
    'copy',
    'usemin',
    'replace'
  ]);
};