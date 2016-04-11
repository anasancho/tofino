// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import lint from 'mocha-eslint';

const paths = [
  'gulpfile.js',
  './app',
  './build',
  './shared',
  './test',
  './ui',
];

const options = {
  alwaysWarn: false,
  timeout: 10000,
};

lint(paths, options);
