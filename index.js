var gulp = require('gulp');
var Elixir = require('laravel-elixir');
var svgmin = require('gulp-svgmin');
var svgSprite = require('gulp-svg-sprite');
var _ = require('lodash');

var config = {

	minOptions: {
		plugins: [
			{
				removeXMLNS: true
			}
		],
    },

    spriteOptions: {
		mode: {
			symbol: { // symbol mode to build the SVG
				render: {
					css: false, // CSS output option for icon sizing
					scss: false // SCSS output option for icon sizing
				},
				dest: 'sprite',
				sprite: 'sprite.svg', //sprite name
		  		example: false // Build sample page
			}
		},
		svg: {
			xmlDeclaration: false, // strip out the XML attribute
			doctypeDeclaration: false, // don't include the !DOCTYPE declaration
		}
	}
}

Elixir.extend('svgToSprite', function(src, baseDir, filename, svgminOptions, svgSpriteOptions) {


	return new Elixir.Task('svgToSprite', function() {
		
		return gulp.src(src)
				   	.pipe(svgmin(svgminOptions || config.minOptions))
				    .on('error', function(e) {
				    	new Elixir.Notification('SVG minification failed.');
				    	this.emit('end');
				    })
				    .pipe(svgSprite(getSpriteOptions(svgSpriteOptions, filename)))
				    .on('error', function(e) {
				    	new Elixir.Notification('SVG spritification failed.');
				    	this.emit('end');
				    })
				    .pipe(gulp.dest(baseDir))
				    .pipe(new Elixir.Notification('Sprite SVG generated.'))

	});

});

function getSpriteOptions(options, file)
{
	
	var filename = file || 'sprite.svg';

	var options = options || config.spriteOptions;
	
	var ops = _.merge(options, {
		mode: {
			symbol: {
				sprite: filename
			}
		}
	});

	return ops;
}
