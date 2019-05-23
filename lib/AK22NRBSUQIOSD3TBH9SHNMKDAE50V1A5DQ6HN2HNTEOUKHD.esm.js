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
// Simple typographyc replacements
//
// (c) (C) → ©
// (tm) (TM) → ™
// (r) (R) → ®
// +- → ±
// (p) (P) -> §
// ... → … (also ?.... → ?.., !.... → !..)
// ???????? → ???, !!!!! → !!!, `,,` → `,`
// -- → &ndash;, --- → &mdash;
//
'use strict';

// TODO:
// - fractionals 1/2, 1/4, 3/4 -> ½, ¼, ¾
// - miltiplication 2 x 4 -> 2 × 4

var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;

// Workaround for phantomjs - need regex without /g flag,
// or root check will fail every second time
var SCOPED_ABBR_TEST_RE = /\((c|tm|r|p)\)/i;

var SCOPED_ABBR_RE = /\((c|tm|r|p)\)/ig;
var SCOPED_ABBR = {
  c: '©',
  r: '®',
  p: '§',
  tm: '™'
};

function replaceFn(match, name) {
  return SCOPED_ABBR[name.toLowerCase()];
}

function replace_scoped(inlineTokens) {
  var i, token, inside_autolink = 0;

  for (i = inlineTokens.length - 1; i >= 0; i--) {
	token = inlineTokens[i];

	if (token.type === 'text' && !inside_autolink) {
	  token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
	}

	if (token.type === 'link_open' && token.info === 'auto') {
	  inside_autolink--;
	}

	if (token.type === 'link_close' && token.info === 'auto') {
	  inside_autolink++;
	}
  }
}

function replace_rare(inlineTokens) {
  var i, token, inside_autolink = 0;

  for (i = inlineTokens.length - 1; i >= 0; i--) {
	token = inlineTokens[i];

	if (token.type === 'text' && !inside_autolink) {
	  if (RARE_RE.test(token.content)) {
		token.content = token.content
					.replace(/\+-/g, '±')
					// .., ..., ....... -> …
					// but ?..... & !..... -> ?.. & !..
					.replace(/\.{2,}/g, '…').replace(/([?!])…/g, '$1..')
					.replace(/([?!]){4,}/g, '$1$1$1').replace(/,{2,}/g, ',')
					// em-dash
					.replace(/(^|[^-])---([^-]|$)/mg, '$1\u2014$2')
					// en-dash
					.replace(/(^|\s)--(\s|$)/mg, '$1\u2013$2')
					.replace(/(^|[^-\s])--([^-\s]|$)/mg, '$1\u2013$2');
	  }
	}

	if (token.type === 'link_open' && token.info === 'auto') {
	  inside_autolink--;
	}

	if (token.type === 'link_close' && token.info === 'auto') {
	  inside_autolink++;
	}
  }
}


module.exports = function replace(state) {
  var blkIdx;

  if (!state.md.options.typographer) { return; }

  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

	if (state.tokens[blkIdx].type !== 'inline') { continue; }

	if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) {
	  replace_scoped(state.tokens[blkIdx].children);
	}

	if (RARE_RE.test(state.tokens[blkIdx].content)) {
	  replace_rare(state.tokens[blkIdx].children);
	}

  }
};

})(require, module, exports);
})(_require, _module, _module.exports);

export default _module.exports;
