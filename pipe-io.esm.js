/**
 *	Author: JCloudYu
 *	Create: 2019/06/17
**/
import fs from "fs";
import path from "path";
import {MarkdownIt} from "./esm.markdown-it.esm.js";

const MAX_INPUT_SIZE = 100 * 1024;

const [script] = process.argv.slice(2);


(async()=>{
	let RAW_INPUT = false;
	
	
	if ( script !== undefined ) {
		try {
			const stream = fs.readFileSync(path.resolve(script));
			RAW_INPUT = stream.toString('utf8');
		}
		catch(e) {
			process.stderr.write( `Cannot read file content! (${e.message})\n` );
			process.exit(1);
		}
	}
	
	
	
	if ( !RAW_INPUT ) {
		const STDIN = await ReadAll(process.stdin);
		RAW_INPUT = STDIN.toString( 'utf8' );
	}
	
	try {
		const MK = new MarkdownIt();
		const markdown_result = MK.render(RAW_INPUT);
		console.log(markdown_result);
		process.stdout.write(`${markdown_result}\n`);
		process.exit(0);
	}
	catch(e) {
		process.stderr.write( "Cannot process input markdown file!\n" );
		process.exit(1);
	}
})().catch((e)=>{throw e;});






function ReadAll(stream) {
	const chunks = [];
	let _buffer_size = 0;
	return new Promise((resolve, reject)=>{
		let _resolve = resolve, _reject = reject;
	
		stream
		.on( 'error', (e)=>{
			if ( _reject ) {
				_reject(e);
				_reject = null;
			}
		})
		.on( 'data', (chunk)=>{
			if ( _buffer_size < MAX_INPUT_SIZE ) {
				_buffer_size += chunk.length;
				chunks.push(chunk);
				return;
			}
			
			if ( _reject ) {
				_reject(new Error( "Input markdown size has been reached!" ));
				_reject = null;
			}
		})
		.on( 'end', ()=>{
			if ( _resolve ) {
				_resolve(Buffer.concat(chunks));
				_resolve = null;
			}
		});
	});
}
