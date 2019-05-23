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
// Parse link destination
//
'use strict';


var isSpace     = require('../common/utils').isSpace;
var unescapeAll = require('../common/utils').unescapeAll;


module.exports = function parseLinkDestination(str, pos, max) {
  var code, level,
	  lines = 0,
	  start = pos,
	  result = {
		ok: false,
		pos: 0,
		lines: 0,
		str: ''
	  };

  if (str.charCodeAt(pos) === 0x3C /* < */) {
	pos++;
	while (pos < max) {
	  code = str.charCodeAt(pos);
	  if (code === 0x0A /* \n */ || isSpace(code)) { return result; }
	  if (code === 0x3E /* > */) {
		result.pos = pos + 1;
		result.str = unescapeAll(str.slice(start + 1, pos));
		result.ok = true;
		return result;
	  }
	  if (code === 0x5C /* \ */ && pos + 1 < max) {
		pos += 2;
		continue;
	  }

	  pos++;
	}

	// no closing '>'
	return result;
  }

  // this should be ... } else { ... branch

  level = 0;
  while (pos < max) {
	code = str.charCodeAt(pos);

	if (code === 0x20) { break; }

	// ascii control characters
	if (code < 0x20 || code === 0x7F) { break; }

	if (code === 0x5C /* \ */ && pos + 1 < max) {
	  pos += 2;
	  continue;
	}

	if (code === 0x28 /* ( */) {
	  level++;
	}

	if (code === 0x29 /* ) */) {
	  if (level === 0) { break; }
	  level--;
	}

	pos++;
  }

  if (start === pos) { return result; }
  if (level !== 0) { return result; }

  result.str = unescapeAll(str.slice(start, pos));
  result.lines = lines;
  result.pos = pos;
  result.ok = true;
  return result;
};

})(require, module, exports);
})(_require, _module, _module.exports);

export default _module.exports;
