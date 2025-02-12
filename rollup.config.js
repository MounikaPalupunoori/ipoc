import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { config } from 'dotenv';
import fs from 'fs';
import copy from 'rollup-plugin-copy'
const createPreprocessors = require('./svelte.config').createPreprocessors;
const path = require('path');
const production = process.env.NODE_ENV == 'production';
const legacySupport = true; // enable for IE11 Support
const customResolver = resolve({
  extensions: ['.mjs', '.svelte', '.js', '.jsx', '.json', '.sass', '.scss'],
});
function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn(
        'npm',
        ['run', 'start', '--', '--dev', '--single'],
        {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        }
      );
      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}
function insertHashToIndex() {
	return {
		writeBundle() {
			const stats = fs.statSync('public/ipoc/build/bundle.js');
			let indexHtml = fs.readFileSync(`static/index.html`, 'utf8');
			indexHtml = indexHtml
				.replace(
					/\/global\.css(\?_=[0-9\.]+)?/,
					'global.css?v=' + stats.ctimeMs
				)
				.replace(
					/\/build\/bundle\.css(\?_=[0-9\.]+)?/,
					'build/bundle.css?v=' + stats.ctimeMs
				)
				.replace(
					/\/build\/bundle\.js(\?_=[0-9\.]+)?/,
					'build/bundle.js?v=' + stats.ctimeMs
				);
			// You can create a new file if you don't want to make a mutable modification.
      fs.writeFileSync(`public/ipoc/index.html`, indexHtml);
			fs.writeFileSync(`public/index.html`, indexHtml);
		},
	};
}
const babelConfig = {
  extensions: ['.js', '.mjs', '.html', '.svelte'],
  include: ['src/**', 'node_modules/svelte/**'],
};
export default {
  input: 'src/main.js',
  output: {
    sourcemap: !production,
    format: 'iife',
    name: 'app',
    file: 'public/ipoc/build/bundle.js',
  },
  plugins: [
    copy({
      targets: [{src:'static/**', dest:'public/ipoc/static'}]
    }),
    terser(),
    replace({
      // stringify the object
      myapp: JSON.stringify({
        env: {
          isProd: production,
          ...config().parsed, // attached the .env config
        },
      }),
    }),
    alias({
      entries: [
        {
          find: svelte,
          replacement: path.resolve('node_modules', 'svelte'),
        },
        {
          find: '@Components',
          replacement: path.resolve(__dirname, 'src/Components/'),
          // OR place `customResolver` here. See explanation below.
        },
        {
          find: '@Services',
          replacement: path.resolve(__dirname, 'src/Services/'),
          // OR place `customResolver` here. See explanation below.
        },
        {
          find: '@Assets',
          replacement: path.resolve(__dirname, 'src/Assets/'),
          // OR place `customResolver` here. See explanation below.
        },
        {
          find: '@Store',
          replacement: path.resolve(__dirname, 'src/Store/'),
          // OR place `customResolver` here. See explanation below.
        },
        {
          find: '@Utils',
          replacement: path.resolve(__dirname, 'src/Utils/'),
          // OR place `customResolver` here. See explanation below.
        },
        {
          find: '@Helper',
          replacement: path.resolve(__dirname, 'src/Helper/'),
          // OR place `customResolver` here. See explanation below.
        },{
          find: '@Controller',
          replacement: path.resolve(__dirname, 'src/Controller/'),
          // OR place `customResolver` here. See explanation below.
        },{
          find: '@Constants',
          replacement: path.resolve(__dirname, 'src/Constants/'),
          // OR place `customResolver` here. See explanation below.
        },
      ],
      customResolver,
    }),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        css: (css) => {
          css.write('public/ipoc/build/bundle.css');
        },
        // immutable: true,
        // hydratable: true,
        // generate: 'ssr',
      },
      // we'll extract any component CSS out into
      // a separate file - better for performance
      preprocess: createPreprocessors(!production),
    }),
    // compile to good old IE11 compatible ES5
    // compile to ES 2015 in oder to support chromium 59+
    legacySupport && babel(babelConfig),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'bundle.css' }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    json(),
    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),
    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),
    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser() && insertHashToIndex(),
  ],
  watch: {
    clearScreen: false,
  },
};
