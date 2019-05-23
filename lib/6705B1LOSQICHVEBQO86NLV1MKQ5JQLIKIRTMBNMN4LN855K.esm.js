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

import m_8KGPHBGDJ9SC4QTM6USH1EISPKCR1RQVU8741QTVUOVDCLVR from "./8KGPHBGDJ9SC4QTM6USH1EISPKCR1RQVU8741QTVUOVDCLVR.esm.js";
import m_7DSR4PIR7LK89HTLS184HIU32J0NMSIULOD1ERC262PAD1FR from "./7DSR4PIR7LK89HTLS184HIU32J0NMSIULOD1ERC262PAD1FR.esm.js";
import m_NRFC5DE3KNOVIONOQ31SLTHDPGDJ25J2B66QST38CHNRVDP4 from "./NRFC5DE3KNOVIONOQ31SLTHDPGDJ25J2B66QST38CHNRVDP4.esm.js";
import m_IBLF6ND2M339I1B5879UOH68B92CI0VTMPPN3AR5GV472VJN from "./IBLF6ND2M339I1B5879UOH68B92CI0VTMPPN3AR5GV472VJN.esm.js";
const _module_map = {"uc.micro/categories/Cc/regex": m_8KGPHBGDJ9SC4QTM6USH1EISPKCR1RQVU8741QTVUOVDCLVR, "uc.micro/categories/P/regex": m_7DSR4PIR7LK89HTLS184HIU32J0NMSIULOD1ERC262PAD1FR, "uc.micro/categories/Z/regex": m_NRFC5DE3KNOVIONOQ31SLTHDPGDJ25J2B66QST38CHNRVDP4, "uc.micro/properties/Any/regex": m_IBLF6ND2M339I1B5879UOH68B92CI0VTMPPN3AR5GV472VJN};
const _require	  = function(module){ return _module_map[module]; };
const _module	  = {exports:{}};

(function(require, module, exports){
	let _module_map = undefined, _require = undefined, _module = undefined;
	return (function(require,module,exports){
'use strict';


module.exports = function (opts) {
  var re = {};

  // Use direct extract instead of `regenerate` to reduse browserified size
  re.src_Any = require('uc.micro/properties/Any/regex').source;
  re.src_Cc  = require('uc.micro/categories/Cc/regex').source;
  re.src_Z   = require('uc.micro/categories/Z/regex').source;
  re.src_P   = require('uc.micro/categories/P/regex').source;

  // \p{\Z\P\Cc\CF} (white spaces + control + format + punctuation)
  re.src_ZPCc = [ re.src_Z, re.src_P, re.src_Cc ].join('|');

  // \p{\Z\Cc} (white spaces + control)
  re.src_ZCc = [ re.src_Z, re.src_Cc ].join('|');

  // Experimental. List of chars, completely prohibited in links
  // because can separate it from other part of text
  var text_separators = '[><\uff5c]';

  // All possible word characters (everything without punctuation, spaces & controls)
  // Defined via punctuation & spaces to save space
  // Should be something like \p{\L\N\S\M} (\w but without `_`)
  re.src_pseudo_letter       = '(?:(?!' + text_separators + '|' + re.src_ZPCc + ')' + re.src_Any + ')';
  // The same as abothe but without [0-9]
  // var src_pseudo_letter_non_d = '(?:(?![0-9]|' + src_ZPCc + ')' + src_Any + ')';

  ////////////////////////////////////////////////////////////////////////////////

  re.src_ip4 =

	'(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

  // Prohibit any of "@/[]()" in user/pass to avoid wrong domain fetch.
  re.src_auth    = '(?:(?:(?!' + re.src_ZCc + '|[@/\\[\\]()]).)+@)?';

  re.src_port =

	'(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?';

  re.src_host_terminator =

	'(?=$|' + text_separators + '|' + re.src_ZPCc + ')(?!-|_|:\\d|\\.-|\\.(?!$|' + re.src_ZPCc + '))';

  re.src_path =

	'(?:' +
	  '[/?#]' +
		'(?:' +
		  '(?!' + re.src_ZCc + '|' + text_separators + '|[()[\\]{}.,"\'?!\\-]).|' +
		  '\\[(?:(?!' + re.src_ZCc + '|\\]).)*\\]|' +
		  '\\((?:(?!' + re.src_ZCc + '|[)]).)*\\)|' +
		  '\\{(?:(?!' + re.src_ZCc + '|[}]).)*\\}|' +
		  '\\"(?:(?!' + re.src_ZCc + '|["]).)+\\"|' +
		  "\\'(?:(?!" + re.src_ZCc + "|[']).)+\\'|" +
		  "\\'(?=" + re.src_pseudo_letter + '|[-]).|' +  // allow `I'm_king` if no pair found
		  '\\.{2,3}[a-zA-Z0-9%/]|' + // github has ... in commit range links. Restrict to
									 // - english
									 // - percent-encoded
									 // - parts of file path
									 // until more examples found.
		  '\\.(?!' + re.src_ZCc + '|[.]).|' +
		  (opts && opts['---'] ?
			'\\-(?!--(?:[^-]|$))(?:-*)|' // `---` => long dash, terminate
		  :
			'\\-+|'
		  ) +
		  '\\,(?!' + re.src_ZCc + ').|' +      // allow `,,,` in paths
		  '\\!(?!' + re.src_ZCc + '|[!]).|' +
		  '\\?(?!' + re.src_ZCc + '|[?]).' +
		')+' +
	  '|\\/' +
	')?';

  re.src_email_name =

	'[\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]+';

  re.src_xn =

	'xn--[a-z0-9\\-]{1,59}';

  // More to read about domain names
  // http://serverfault.com/questions/638260/

  re.src_domain_root =

	// Allow letters & digits (http://test1)
	'(?:' +
	  re.src_xn +
	  '|' +
	  re.src_pseudo_letter + '{1,63}' +
	')';

  re.src_domain =

	'(?:' +
	  re.src_xn +
	  '|' +
	  '(?:' + re.src_pseudo_letter + ')' +
	  '|' +
	  // don't allow `--` in domain names, because:
	  // - that can conflict with markdown &mdash; / &ndash;
	  // - nobody use those anyway
	  '(?:' + re.src_pseudo_letter + '(?:-(?!-)|' + re.src_pseudo_letter + '){0,61}' + re.src_pseudo_letter + ')' +
	')';

  re.src_host =

	'(?:' +
	// Don't need IP check, because digits are already allowed in normal domain names
	//   src_ip4 +
	// '|' +
	  '(?:(?:(?:' + re.src_domain + ')\\.)*' + re.src_domain/*_root*/ + ')' +
	')';

  re.tpl_host_fuzzy =

	'(?:' +
	  re.src_ip4 +
	'|' +
	  '(?:(?:(?:' + re.src_domain + ')\\.)+(?:%TLDS%))' +
	')';

  re.tpl_host_no_ip_fuzzy =

	'(?:(?:(?:' + re.src_domain + ')\\.)+(?:%TLDS%))';

  re.src_host_strict =

	re.src_host + re.src_host_terminator;

  re.tpl_host_fuzzy_strict =

	re.tpl_host_fuzzy + re.src_host_terminator;

  re.src_host_port_strict =

	re.src_host + re.src_port + re.src_host_terminator;

  re.tpl_host_port_fuzzy_strict =

	re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;

  re.tpl_host_port_no_ip_fuzzy_strict =

	re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator;


  ////////////////////////////////////////////////////////////////////////////////
  // Main rules

  // Rude test fuzzy links by host, for quick deny
  re.tpl_host_fuzzy_test =

	'localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:' + re.src_ZPCc + '|>|$))';

  re.tpl_email_fuzzy =

	  '(^|' + text_separators + '|\\(|' + re.src_ZCc + ')(' + re.src_email_name + '@' + re.tpl_host_fuzzy_strict + ')';

  re.tpl_link_fuzzy =
	  // Fuzzy link can't be prepended with .:/\- and non punctuation.
	  // but can start with > (markdown blockquote)
	  '(^|(?![.:/\\-_@])(?:[$+<=>^`|\uff5c]|' + re.src_ZPCc + '))' +
	  '((?![$+<=>^`|\uff5c])' + re.tpl_host_port_fuzzy_strict + re.src_path + ')';

  re.tpl_link_no_ip_fuzzy =
	  // Fuzzy link can't be prepended with .:/\- and non punctuation.
	  // but can start with > (markdown blockquote)
	  '(^|(?![.:/\\-_@])(?:[$+<=>^`|\uff5c]|' + re.src_ZPCc + '))' +
	  '((?![$+<=>^`|\uff5c])' + re.tpl_host_port_no_ip_fuzzy_strict + re.src_path + ')';

  return re;
};

})(require, module, exports);
})(_require, _module, _module.exports);

export default _module.exports;
