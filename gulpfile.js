const gulp = require('gulp');
const closure = require('google-closure-compiler').gulp();
const {PolymerProject} = require('polymer-build');
const mergeStream = require('merge-stream');

const project = new PolymerProject({
  entrypoint: `./lit-element.js`,
  sources: [
    'lit-element.js'
  ]
});

gulp.task('closure', () => {
  const sources = project.sources();
  const dependencies = project.dependencies();

  const mergedFiles = mergeStream(sources, dependencies);

  return mergedFiles
    .pipe(closure({
      compilation_level: 'ADVANCED',
      language_in: 'ES6_STRICT',
      language_out: 'ES6_STRICT',
      warning_level: 'VERBOSE',
      isolation_mode: 'IIFE',
      module_resolution: 'NODE',
      assume_function_wrapper: true,
      rewrite_polyfills: false,
      new_type_inf: true,
      externs: [
        'node_modules/@polymer/polymer/externs/polymer-externs.js'
      ],
      extra_annotation_name: [
        'appliesMixin'
      ]
    }))
    .pipe(gulp.dest('dist'));
});
