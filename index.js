#!/usr/bin/env node
/**
 *	Author: JCloudYu
 *	Create: 2019/06/17
**/

const child_process = require( 'child_process' );

const child = child_process.spawn( process.execPath, [
	'--experimental-modules',
	'--loader',
	`${__dirname}/esm-loader.mjs`,
	`${__dirname}/pipe-io.esm.js`,
	...process.argv.slice(2)
], { cwd:process.cwd(), env:process.env, stdio:'inherit' });



child.on( 'exit', (code, signal)=>{
	if ( code !== null ) {
		process.exit(code);
	}
	else {
		process.exit(1);
	}
});
