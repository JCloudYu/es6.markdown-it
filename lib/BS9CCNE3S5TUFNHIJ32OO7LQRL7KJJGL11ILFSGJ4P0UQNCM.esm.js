/**
Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
**/


const _module_map = {};
const _require	  = function(module){ return _module_map[module]; };
const _module	  = {exports:{}};

(function(require, module, exports){
	let _module_map = undefined, _require = undefined, _module = undefined;
	return (function(require,module,exports){
// fences (``` lang, ~~~ lang)

'use strict';


module.exports = function fence(state, startLine, endLine, silent) {
  var marker, len, params, nextLine, mem, token, markup,
	  haveEndMarker = false,
	  pos = state.bMarks[startLine] + state.tShift[startLine],
	  max = state.eMarks[startLine];

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  if (pos + 3 > max) { return false; }

  marker = state.src.charCodeAt(pos);

  if (marker !== 0x7E/* ~ */ && marker !== 0x60 /* ` */) {
	return false;
  }

  // scan marker length
  mem = pos;
  pos = state.skipChars(pos, marker);

  len = pos - mem;

  if (len < 3) { return false; }

  markup = state.src.slice(mem, pos);
  params = state.src.slice(pos, max);

  if (params.indexOf(String.fromCharCode(marker)) >= 0) { return false; }

  // Since start is found, we can report success here in validation mode
  if (silent) { return true; }

  // search end of block
  nextLine = startLine;

  for (;;) {
	nextLine++;
	if (nextLine >= endLine) {
	  // unclosed block should be autoclosed by end of document.
	  // also block seems to be autoclosed by end of parent
	  break;
	}

	pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
	max = state.eMarks[nextLine];

	if (pos < max && state.sCount[nextLine] < state.blkIndent) {
	  // non-empty line with negative indent should stop the list:
	  // - ```
	  //  test
	  break;
	}

	if (state.src.charCodeAt(pos) !== marker) { continue; }

	if (state.sCount[nextLine] - state.blkIndent >= 4) {
	  // closing fence should be indented less than 4 spaces
	  continue;
	}

	pos = state.skipChars(pos, marker);

	// closing code fence must be at least as long as the opening one
	if (pos - mem < len) { continue; }

	// make sure tail has spaces only
	pos = state.skipSpaces(pos);

	if (pos < max) { continue; }

	haveEndMarker = true;
	// found!
	break;
  }

  // If a fence has heading spaces, they should be removed from its inner block
  len = state.sCount[startLine];

  state.line = nextLine + (haveEndMarker ? 1 : 0);

  token         = state.push('fence', 'code', 0);
  token.info    = params;
  token.content = state.getLines(startLine + 1, nextLine, len, true);
  token.markup  = markup;
  token.map     = [ startLine, state.line ];

  return true;
};

})(require, module, exports);
})(_require, _module, _module.exports);

export default _module.exports;
