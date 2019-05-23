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
// Process autolinks '<protocol:...>'

'use strict';


/*eslint max-len:0*/
var EMAIL_RE    = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/;
var AUTOLINK_RE = /^<([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)>/;


module.exports = function autolink(state, silent) {
  var tail, linkMatch, emailMatch, url, fullUrl, token,
	  pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  tail = state.src.slice(pos);

  if (tail.indexOf('>') < 0) { return false; }

  if (AUTOLINK_RE.test(tail)) {
	linkMatch = tail.match(AUTOLINK_RE);

	url = linkMatch[0].slice(1, -1);
	fullUrl = state.md.normalizeLink(url);
	if (!state.md.validateLink(fullUrl)) { return false; }

	if (!silent) {
	  token         = state.push('link_open', 'a', 1);
	  token.attrs   = [ [ 'href', fullUrl ] ];
	  token.markup  = 'autolink';
	  token.info    = 'auto';

	  token         = state.push('text', '', 0);
	  token.content = state.md.normalizeLinkText(url);

	  token         = state.push('link_close', 'a', -1);
	  token.markup  = 'autolink';
	  token.info    = 'auto';
	}

	state.pos += linkMatch[0].length;
	return true;
  }

  if (EMAIL_RE.test(tail)) {
	emailMatch = tail.match(EMAIL_RE);

	url = emailMatch[0].slice(1, -1);
	fullUrl = state.md.normalizeLink('mailto:' + url);
	if (!state.md.validateLink(fullUrl)) { return false; }

	if (!silent) {
	  token         = state.push('link_open', 'a', 1);
	  token.attrs   = [ [ 'href', fullUrl ] ];
	  token.markup  = 'autolink';
	  token.info    = 'auto';

	  token         = state.push('text', '', 0);
	  token.content = state.md.normalizeLinkText(url);

	  token         = state.push('link_close', 'a', -1);
	  token.markup  = 'autolink';
	  token.info    = 'auto';
	}

	state.pos += emailMatch[0].length;
	return true;
  }

  return false;
};

})(require, module, exports);
})(_require, _module, _module.exports);

export default _module.exports;
