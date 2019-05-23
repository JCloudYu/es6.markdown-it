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
// Process ![image](<src> "title")

'use strict';

var normalizeReference   = require('../common/utils').normalizeReference;
var isSpace              = require('../common/utils').isSpace;


module.exports = function image(state, silent) {
  var attrs,
	  code,
	  content,
	  label,
	  labelEnd,
	  labelStart,
	  pos,
	  ref,
	  res,
	  title,
	  token,
	  tokens,
	  start,
	  href = '',
	  oldPos = state.pos,
	  max = state.posMax;

  if (state.src.charCodeAt(state.pos) !== 0x21/* ! */) { return false; }
  if (state.src.charCodeAt(state.pos + 1) !== 0x5B/* [ */) { return false; }

  labelStart = state.pos + 2;
  labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);

  // parser failed to find ']', so it's not a valid link
  if (labelEnd < 0) { return false; }

  pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {
	//
	// Inline link
	//

	// [link](  <href>  "title"  )
	//        ^^ skipping these spaces
	pos++;
	for (; pos < max; pos++) {
	  code = state.src.charCodeAt(pos);
	  if (!isSpace(code) && code !== 0x0A) { break; }
	}
	if (pos >= max) { return false; }

	// [link](  <href>  "title"  )
	//          ^^^^^^ parsing link destination
	start = pos;
	res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
	if (res.ok) {
	  href = state.md.normalizeLink(res.str);
	  if (state.md.validateLink(href)) {
		pos = res.pos;
	  } else {
		href = '';
	  }
	}

	// [link](  <href>  "title"  )
	//                ^^ skipping these spaces
	start = pos;
	for (; pos < max; pos++) {
	  code = state.src.charCodeAt(pos);
	  if (!isSpace(code) && code !== 0x0A) { break; }
	}

	// [link](  <href>  "title"  )
	//                  ^^^^^^^ parsing link title
	res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
	if (pos < max && start !== pos && res.ok) {
	  title = res.str;
	  pos = res.pos;

	  // [link](  <href>  "title"  )
	  //                         ^^ skipping these spaces
	  for (; pos < max; pos++) {
		code = state.src.charCodeAt(pos);
		if (!isSpace(code) && code !== 0x0A) { break; }
	  }
	} else {
	  title = '';
	}

	if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {
	  state.pos = oldPos;
	  return false;
	}
	pos++;
  } else {
	//
	// Link reference
	//
	if (typeof state.env.references === 'undefined') { return false; }

	if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {
	  start = pos + 1;
	  pos = state.md.helpers.parseLinkLabel(state, pos);
	  if (pos >= 0) {
		label = state.src.slice(start, pos++);
	  } else {
		pos = labelEnd + 1;
	  }
	} else {
	  pos = labelEnd + 1;
	}

	// covers label === '' and label === undefined
	// (collapsed reference link and shortcut reference link respectively)
	if (!label) { label = state.src.slice(labelStart, labelEnd); }

	ref = state.env.references[normalizeReference(label)];
	if (!ref) {
	  state.pos = oldPos;
	  return false;
	}
	href = ref.href;
	title = ref.title;
  }

  //
  // We found the end of the link, and know for a fact it's a valid link;
  // so all that's left to do is to call tokenizer.
  //
  if (!silent) {
	content = state.src.slice(labelStart, labelEnd);

	state.md.inline.parse(
	  content,
	  state.md,
	  state.env,
	  tokens = []
	);

	token          = state.push('image', 'img', 0);
	token.attrs    = attrs = [ [ 'src', href ], [ 'alt', '' ] ];
	token.children = tokens;
	token.content  = content;

	if (title) {
	  attrs.push([ 'title', title ]);
	}
  }

  state.pos = pos;
  state.posMax = max;
  return true;
};

})(require, module, exports);
})(_require, _module, _module.exports);

export default _module.exports;
