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
// For each opening emphasis-like marker find a matching closing one
//
'use strict';


module.exports = function link_pairs(state) {
  var i, j, lastDelim, currDelim,
	  delimiters = state.delimiters,
	  max = state.delimiters.length;

  for (i = 0; i < max; i++) {
	lastDelim = delimiters[i];

	if (!lastDelim.close) { continue; }

	j = i - lastDelim.jump - 1;

	while (j >= 0) {
	  currDelim = delimiters[j];

	  if (currDelim.open &&
		  currDelim.marker === lastDelim.marker &&
		  currDelim.end < 0 &&
		  currDelim.level === lastDelim.level) {

		// typeofs are for backward compatibility with plugins
		var odd_match = (currDelim.close || lastDelim.open) &&
						typeof currDelim.length !== 'undefined' &&
						typeof lastDelim.length !== 'undefined' &&
						(currDelim.length + lastDelim.length) % 3 === 0;

		if (!odd_match) {
		  lastDelim.jump = i - j;
		  lastDelim.open = false;
		  currDelim.end  = i;
		  currDelim.jump = 0;
		  break;
		}
	  }

	  j -= currDelim.jump + 1;
	}
  }
};

})(require, module, exports);
})(_require, _module, _module.exports);

export default _module.exports;
