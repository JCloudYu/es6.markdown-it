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
// Replace link-like texts with link nodes.
//
// Currently restricted by `md.validateLink()` to http/https/ftp
//
'use strict';


var arrayReplaceAt = require('../common/utils').arrayReplaceAt;


function isLinkOpen(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose(str) {
  return /^<\/a\s*>/i.test(str);
}


module.exports = function linkify(state) {
  var i, j, l, tokens, token, currentToken, nodes, ln, text, pos, lastPos,
	  level, htmlLinkLevel, url, fullUrl, urlText,
	  blockTokens = state.tokens,
	  links;

  if (!state.md.options.linkify) { return; }

  for (j = 0, l = blockTokens.length; j < l; j++) {
	if (blockTokens[j].type !== 'inline' ||
		!state.md.linkify.pretest(blockTokens[j].content)) {
	  continue;
	}

	tokens = blockTokens[j].children;

	htmlLinkLevel = 0;

	// We scan from the end, to keep position when new tags added.
	// Use reversed logic in links start/end match
	for (i = tokens.length - 1; i >= 0; i--) {
	  currentToken = tokens[i];

	  // Skip content of markdown links
	  if (currentToken.type === 'link_close') {
		i--;
		while (tokens[i].level !== currentToken.level && tokens[i].type !== 'link_open') {
		  i--;
		}
		continue;
	  }

	  // Skip content of html tag links
	  if (currentToken.type === 'html_inline') {
		if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
		  htmlLinkLevel--;
		}
		if (isLinkClose(currentToken.content)) {
		  htmlLinkLevel++;
		}
	  }
	  if (htmlLinkLevel > 0) { continue; }

	  if (currentToken.type === 'text' && state.md.linkify.test(currentToken.content)) {

		text = currentToken.content;
		links = state.md.linkify.match(text);

		// Now split string to nodes
		nodes = [];
		level = currentToken.level;
		lastPos = 0;

		for (ln = 0; ln < links.length; ln++) {

		  url = links[ln].url;
		  fullUrl = state.md.normalizeLink(url);
		  if (!state.md.validateLink(fullUrl)) { continue; }

		  urlText = links[ln].text;

		  // Linkifier might send raw hostnames like "example.com", where url
		  // starts with domain name. So we prepend http:// in those cases,
		  // and remove it afterwards.
		  //
		  if (!links[ln].schema) {
			urlText = state.md.normalizeLinkText('http://' + urlText).replace(/^http:\/\//, '');
		  } else if (links[ln].schema === 'mailto:' && !/^mailto:/i.test(urlText)) {
			urlText = state.md.normalizeLinkText('mailto:' + urlText).replace(/^mailto:/, '');
		  } else {
			urlText = state.md.normalizeLinkText(urlText);
		  }

		  pos = links[ln].index;

		  if (pos > lastPos) {
			token         = new state.Token('text', '', 0);
			token.content = text.slice(lastPos, pos);
			token.level   = level;
			nodes.push(token);
		  }

		  token         = new state.Token('link_open', 'a', 1);
		  token.attrs   = [ [ 'href', fullUrl ] ];
		  token.level   = level++;
		  token.markup  = 'linkify';
		  token.info    = 'auto';
		  nodes.push(token);

		  token         = new state.Token('text', '', 0);
		  token.content = urlText;
		  token.level   = level;
		  nodes.push(token);

		  token         = new state.Token('link_close', 'a', -1);
		  token.level   = --level;
		  token.markup  = 'linkify';
		  token.info    = 'auto';
		  nodes.push(token);

		  lastPos = links[ln].lastIndex;
		}
		if (lastPos < text.length) {
		  token         = new state.Token('text', '', 0);
		  token.content = text.slice(lastPos);
		  token.level   = level;
		  nodes.push(token);
		}

		// replace current node
		blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
	  }
	}
  }
};

})(require, module, exports);
})(_require, _module, _module.exports);

export default _module.exports;
