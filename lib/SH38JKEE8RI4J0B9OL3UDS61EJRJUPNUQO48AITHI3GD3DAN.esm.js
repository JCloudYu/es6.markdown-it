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

'use strict';


var encodeCache = {};


// Create a lookup array where anything but characters in `chars` string
// and alphanumeric chars is percent-encoded.
//
function getEncodeCache(exclude) {
  var i, ch, cache = encodeCache[exclude];
  if (cache) { return cache; }

  cache = encodeCache[exclude] = [];

  for (i = 0; i < 128; i++) {
	ch = String.fromCharCode(i);

	if (/^[0-9a-z]$/i.test(ch)) {
	  // always allow unencoded alphanumeric characters
	  cache.push(ch);
	} else {
	  cache.push('%' + ('0' + i.toString(16).toUpperCase()).slice(-2));
	}
  }

  for (i = 0; i < exclude.length; i++) {
	cache[exclude.charCodeAt(i)] = exclude[i];
  }

  return cache;
}


// Encode unsafe characters with percent-encoding, skipping already
// encoded sequences.
//
//  - string       - string to encode
//  - exclude      - list of characters to ignore (in addition to a-zA-Z0-9)
//  - keepEscaped  - don't encode '%' in a correct escape sequence (default: true)
//
function encode(string, exclude, keepEscaped) {
  var i, l, code, nextCode, cache,
	  result = '';

  if (typeof exclude !== 'string') {
	// encode(string, keepEscaped)
	keepEscaped  = exclude;
	exclude = encode.defaultChars;
  }

  if (typeof keepEscaped === 'undefined') {
	keepEscaped = true;
  }

  cache = getEncodeCache(exclude);

  for (i = 0, l = string.length; i < l; i++) {
	code = string.charCodeAt(i);

	if (keepEscaped && code === 0x25 /* % */ && i + 2 < l) {
	  if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
		result += string.slice(i, i + 3);
		i += 2;
		continue;
	  }
	}

	if (code < 128) {
	  result += cache[code];
	  continue;
	}

	if (code >= 0xD800 && code <= 0xDFFF) {
	  if (code >= 0xD800 && code <= 0xDBFF && i + 1 < l) {
		nextCode = string.charCodeAt(i + 1);
		if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
		  result += encodeURIComponent(string[i] + string[i + 1]);
		  i++;
		  continue;
		}
	  }
	  result += '%EF%BF%BD';
	  continue;
	}

	result += encodeURIComponent(string[i]);
  }

  return result;
}

encode.defaultChars   = ";/?:@&=+$,-_.!~*'()#";
encode.componentChars = "-_.!~*'()";


module.exports = encode;

})(require, module, exports);
})(_require, _module, _module.exports);

export default _module.exports;
