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
// lheading (---, ===)

'use strict';


module.exports = function lheading(state, startLine, endLine/*, silent*/) {
  var content, terminate, i, l, token, pos, max, level, marker,
	  nextLine = startLine + 1, oldParentType,
	  terminatorRules = state.md.block.ruler.getRules('paragraph');

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  oldParentType = state.parentType;
  state.parentType = 'paragraph'; // use paragraph to match terminatorRules

  // jump line-by-line until empty one or EOF
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
	// this would be a code block normally, but after paragraph
	// it's considered a lazy continuation regardless of what's there
	if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }

	//
	// Check for underline in setext header
	//
	if (state.sCount[nextLine] >= state.blkIndent) {
	  pos = state.bMarks[nextLine] + state.tShift[nextLine];
	  max = state.eMarks[nextLine];

	  if (pos < max) {
		marker = state.src.charCodeAt(pos);

		if (marker === 0x2D/* - */ || marker === 0x3D/* = */) {
		  pos = state.skipChars(pos, marker);
		  pos = state.skipSpaces(pos);

		  if (pos >= max) {
			level = (marker === 0x3D/* = */ ? 1 : 2);
			break;
		  }
		}
	  }
	}

	// quirk for blockquotes, this line should already be checked by that rule
	if (state.sCount[nextLine] < 0) { continue; }

	// Some tags can terminate paragraph without empty line.
	terminate = false;
	for (i = 0, l = terminatorRules.length; i < l; i++) {
	  if (terminatorRules[i](state, nextLine, endLine, true)) {
		terminate = true;
		break;
	  }
	}
	if (terminate) { break; }
  }

  if (!level) {
	// Didn't find valid underline
	return false;
  }

  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

  state.line = nextLine + 1;

  token          = state.push('heading_open', 'h' + String(level), 1);
  token.markup   = String.fromCharCode(marker);
  token.map      = [ startLine, state.line ];

  token          = state.push('inline', '', 0);
  token.content  = content;
  token.map      = [ startLine, state.line - 1 ];
  token.children = [];

  token          = state.push('heading_close', 'h' + String(level), -1);
  token.markup   = String.fromCharCode(marker);

  state.parentType = oldParentType;

  return true;
};

})(require, module, exports);
})(_require, _module, _module.exports);

export default _module.exports;
