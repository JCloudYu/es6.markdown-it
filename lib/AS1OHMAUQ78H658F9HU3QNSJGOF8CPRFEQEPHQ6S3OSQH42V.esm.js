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

import m_QQ2PJP7SE1FV7OJ2M4NP36EFRS5IJQT8G3OQPRT0507KHS04 from "./QQ2PJP7SE1FV7OJ2M4NP36EFRS5IJQT8G3OQPRT0507KHS04.esm.js";
import m_H9B76U29HP9TIE5DDIQJN7OJOCCEJDT16J4MAHB2PLNRGOF7 from "./H9B76U29HP9TIE5DDIQJN7OJOCCEJDT16J4MAHB2PLNRGOF7.esm.js";
import m_NP47HEAQQNQ22K63T4FSS5L2F829A6PMIFUR352GPMKJ9VKG from "./NP47HEAQQNQ22K63T4FSS5L2F829A6PMIFUR352GPMKJ9VKG.esm.js";
import m_9AQJ9MHOJVJQARHM0N3T731CHBPV2QUOR8GFKS6UI7PPAN27 from "./9AQJ9MHOJVJQARHM0N3T731CHBPV2QUOR8GFKS6UI7PPAN27.esm.js";
import m_V1B71PM1BJQJ3AF1FL3IJSVC80FNP1FGII9TTOATMJLVOH3D from "./V1B71PM1BJQJ3AF1FL3IJSVC80FNP1FGII9TTOATMJLVOH3D.esm.js";
import m_AK22NRBSUQIOSD3TBH9SHNMKDAE50V1A5DQ6HN2HNTEOUKHD from "./AK22NRBSUQIOSD3TBH9SHNMKDAE50V1A5DQ6HN2HNTEOUKHD.esm.js";
import m_1TIT9ELES7NNK7VQSHS3VNN87PI5VSDCR1JUC5LK8N4Q3199 from "./1TIT9ELES7NNK7VQSHS3VNN87PI5VSDCR1JUC5LK8N4Q3199.esm.js";
import m_FCRKU5CMV3E7HP02HHSS4QKUIK859E52TKKNHNC8MBPCAIT2 from "./FCRKU5CMV3E7HP02HHSS4QKUIK859E52TKKNHNC8MBPCAIT2.esm.js";
const _module_map = {"./ruler": m_QQ2PJP7SE1FV7OJ2M4NP36EFRS5IJQT8G3OQPRT0507KHS04, "./rules_core/block": m_H9B76U29HP9TIE5DDIQJN7OJOCCEJDT16J4MAHB2PLNRGOF7, "./rules_core/inline": m_NP47HEAQQNQ22K63T4FSS5L2F829A6PMIFUR352GPMKJ9VKG, "./rules_core/linkify": m_9AQJ9MHOJVJQARHM0N3T731CHBPV2QUOR8GFKS6UI7PPAN27, "./rules_core/normalize": m_V1B71PM1BJQJ3AF1FL3IJSVC80FNP1FGII9TTOATMJLVOH3D, "./rules_core/replacements": m_AK22NRBSUQIOSD3TBH9SHNMKDAE50V1A5DQ6HN2HNTEOUKHD, "./rules_core/smartquotes": m_1TIT9ELES7NNK7VQSHS3VNN87PI5VSDCR1JUC5LK8N4Q3199, "./rules_core/state_core": m_FCRKU5CMV3E7HP02HHSS4QKUIK859E52TKKNHNC8MBPCAIT2};
const _require	  = function(module){ return _module_map[module]; };
const _module	  = {exports:{}};

(function(require, module, exports){
	let _module_map = undefined, _require = undefined, _module = undefined;
	return (function(require,module,exports){
/** internal
 * class Core
 *
 * Top-level rules executor. Glues block/inline parsers and does intermediate
 * transformations.
 **/
'use strict';


var Ruler  = require('./ruler');


var _rules = [
  [ 'normalize',      require('./rules_core/normalize')      ],
  [ 'block',          require('./rules_core/block')          ],
  [ 'inline',         require('./rules_core/inline')         ],
  [ 'linkify',        require('./rules_core/linkify')        ],
  [ 'replacements',   require('./rules_core/replacements')   ],
  [ 'smartquotes',    require('./rules_core/smartquotes')    ]
];


/**
 * new Core()
 **/
function Core() {
  /**
   * Core#ruler -> Ruler
   *
   * [[Ruler]] instance. Keep configuration of core rules.
   **/
  this.ruler = new Ruler();

  for (var i = 0; i < _rules.length; i++) {
	this.ruler.push(_rules[i][0], _rules[i][1]);
  }
}


/**
 * Core.process(state)
 *
 * Executes core chain rules.
 **/
Core.prototype.process = function (state) {
  var i, l, rules;

  rules = this.ruler.getRules('');

  for (i = 0, l = rules.length; i < l; i++) {
	rules[i](state);
  }
};

Core.prototype.State = require('./rules_core/state_core');


module.exports = Core;

})(require, module, exports);
})(_require, _module, _module.exports);

export default _module.exports;
