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

import m_QDNLPQV4PT4BFJC7QDDGAEK9M9H5R8JTKT74FC74KMFT569U from "./QDNLPQV4PT4BFJC7QDDGAEK9M9H5R8JTKT74FC74KMFT569U.esm.js";
const _module_map = {"../common/utils": m_QDNLPQV4PT4BFJC7QDDGAEK9M9H5R8JTKT74FC74KMFT569U};
const _require	  = function(module){ return _module_map[module]; };
const _module	  = {exports:{}};

(function(require, module, exports){
	let _module_map = undefined, _require = undefined, _module = undefined;
	return (function(require,module,exports){
// Proceess '\n'

'use strict';

var isSpace = require('../common/utils').isSpace;


module.exports = function newline(state, silent) {
  var pmax, max, pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x0A/* \n */) { return false; }

  pmax = state.pending.length - 1;
  max = state.posMax;

  // '  \n' -> hardbreak
  // Lookup in pending chars is bad practice! Don't copy to other rules!
  // Pending string is stored in concat mode, indexed lookups will cause
  // convertion to flat mode.
  if (!silent) {
	if (pmax >= 0 && state.pending.charCodeAt(pmax) === 0x20) {
	  if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 0x20) {
		state.pending = state.pending.replace(/ +$/, '');
		state.push('hardbreak', 'br', 0);
	  } else {
		state.pending = state.pending.slice(0, -1);
		state.push('softbreak', 'br', 0);
	  }

	} else {
	  state.push('softbreak', 'br', 0);
	}
  }

  pos++;

  // skip heading spaces for next line
  while (pos < max && isSpace(state.src.charCodeAt(pos))) { pos++; }

  state.pos = pos;
  return true;
};

})(require, module, exports);
})(_require, _module, _module.exports);

export default _module.exports;
