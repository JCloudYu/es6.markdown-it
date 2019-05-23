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
// Merge adjacent text nodes into one, and re-calculate all token levels
//
'use strict';


module.exports = function text_collapse(state) {
  var curr, last,
	  level = 0,
	  tokens = state.tokens,
	  max = state.tokens.length;

  for (curr = last = 0; curr < max; curr++) {
	// re-calculate levels
	level += tokens[curr].nesting;
	tokens[curr].level = level;

	if (tokens[curr].type === 'text' &&
		curr + 1 < max &&
		tokens[curr + 1].type === 'text') {

	  // collapse two adjacent text nodes
	  tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
	} else {
	  if (curr !== last) { tokens[last] = tokens[curr]; }

	  last++;
	}
  }

  if (curr !== last) {
	tokens.length = last;
  }
};

})(require, module, exports);
})(_require, _module, _module.exports);

export default _module.exports;
