/*
 * 本模块为配置模块的子模块，将负责用户配置的源转化为规则对象
 * 本模块的生成内容可供爬虫模块读取规则并按其规则解析
 * author: byken
 * date: 2019.02.02
 */
/* eslint-disable */
function isEmpty (obj) {
  if (obj === undefined || obj === null) {
    return true
  }
  return false
}

function hasOWn (e, r) {
  return Object.prototype.hasOwnProperty.call(e, r)
}

function match (s, m) {
  return String.prototype.match.call(s, m)
}

function lengthEqual (obj, len) {
  if (isEmpty(obj)) {
    return false
  }
  if (!hasOWn(obj, 'length')) {
    return false
  }
  return obj.length === len
}
const flags = {
  // selector
  sels: {
    SEL_TAG: 0,
    SEL_CLASS: 1,
    SEL_ID: 2,
    SEL_VAL: 3,
    SEL_UNKNOWN: 4
  },
  // relation
  relations: {
    RELATION_OR: 4,
    RELATION_NEXT: 5
  },
  // instruction
  ins: {
    INS_STARTSWITH: 6,
    INS_ENDSWITH: 7,
    INS_CONTAINS: 8,
    INS_EQUALS: 9
  }
}

const RuleGeneratorConfig = {
  sels: {
    SEL_TAG: '^(tag)',
    SEL_CLASS: '^(class)',
    SEL_ID: '^(id)',
    SEL_VAL: '^(text|href|src|html)$'
  },
  // relation
  relations: {
    RELATION_OR: '|',
    RELATION_NEXT: '@'
  },
  relation_weight: [
    'RELATION_NEXT',
    'RELATION_OR'
  ],
  // instructions
  ins: {
    INS_STARTSWITH: '^',
    INS_CONTAINS: '~',
    INS_ENDSWITH: '$',
    INS_EQUALS: '.'
  }
}

/**
 * @param {string} str
 * @param {string} part
 * @returns {string}
 */
function type2Ins (str) {
  var ins = this.ins
  switch (str) {
    case ins.INS_CONTAINS:
      return '*='
    case ins.INS_STARTSWITH:
      return '^='
    case ins.INS_ENDSWITH:
      return '$='
    case ins.INS_EQUALS:
      return '='
  }
}

function ins2Type (chr) {
  let ins = RuleGeneratorConfig.ins
  let _ins = flags.ins
  switch (chr) {
    case ins.INS_STARTSWITH:
      return _ins.INS_STARTSWITH
    case ins.INS_CONTAINS:
      return _ins.INS_CONTAINS
    case ins.INS_ENDSWITH:
      return _ins.INS_ENDSWITH
    case ins.INS_EQUALS:
      return _ins.INS_EQUALS
    default:
      return null
  }
}

function sel2Type (str) {
  let sels = RuleGeneratorConfig.sels
  let _sels = flags.sels
  for (let i in sels) {
    if (match(str, sels[i])) {
      return _sels[i]
    }
  }
  return null
}

function type2Sel (_type) {
  let sel = RuleGeneratorConfig.ins
  let _sel = flags.ins
  for (let i of _sel) {
    if (_sel[i] === _type) {
      return sel[i]
    }
  }
  return null
}

class RuleUnit {
  constructor (_type, ins, value, idx) {
    this._type = _type
    this.ins = ins
    this.value = value
    this.idx = isEmpty(idx) ? null : idx
    this._tag = 'ruleunit'
  }
  getType () {
    return this._type
  }
}

/**
 * @param {string} str
 * @returns {[string, number]}
 */
RuleUnit._rule_unknown = function (str) {
  return ['', 0]
}

RuleUnit.get = function (str) {
  var rule = this._build(str)
  if (!rule) {
    rule = this._build_unknown()
  }
  return rule
}

RuleUnit._build = function (str) {
  var remains = str
  var sel = null
  var ins = null
  var val = null
  var idx = 0
  var tmp
  var sels = RuleGeneratorConfig.sels
  var _sels = flags.sels
  for (let i in sels) {
    if ((tmp = match(str, sels[i]))) {
      sel = _sels[i]
      if (sels[i] === sels.SEL_VAL) {
        val = tmp[1]
      } else {
        remains = remains.slice(tmp[1].length)
        if (remains === '') {
          throw Error('illegal ruleunit.')
        }
        ins = ins2Type(remains[0])
        if (!ins) {
          throw Error('unspport ins.')
        }
        remains = remains.slice(1).split('.')
        val = remains[0]
        idx = ~~remains[1]
      }
      return new RuleUnit(sel, ins, val, idx)
    }
  }
  return null
}

RuleUnit._build_unknown = function () {
  return null
}

/**
 * @param {number} _type
 * @param {Array} ary
 */
var Relation = function Relation (_type, ary) {
  this._type = _type
  this.ary = ary
  this._tag = 'relation'
}

Relation.split = function (part) {
  var weight = RuleGeneratorConfig.relation_weight
  var relations = RuleGeneratorConfig.relations
  var _relations = flags.relations
  function _split (_part) {
    var _parts = []
    var i = weight.length - 1
    // 权重大的最后拆分
    for (; i >= 0; i--) {
      _parts = _part.split(relations[weight[i]])
      if (!lengthEqual(_parts, 1)) {
        break
      }
    }
    if (lengthEqual(_parts, 1)) {
      return RuleUnit.get(_parts[0])
    } else {
      var parts = []
      for (var j in _parts) {
        parts.push(_split(_parts[j]))
      }
      return new Relation(_relations[weight[i]], parts)
    }
  }
  return _split(part)
}

/**
 * @returns {number}
 */
Relation.prototype.getType = function getType () {
  return this._type
}
/**
 * @returns {Array<RuleUnit>}
 */
Relation.prototype.getRules = function getRules () {
  return this.ary
}

/**
 * 语法翻译工厂类，不可实例化
 */
class RuleGenerator {
  /**
   * 将字符串规则翻译为 RuleUnit 或 Relation 对象，供爬虫处理
   * @param {string} str
   * @returns {RuleUnit|Relation}
   */
  static generate (str) {
    if (!str || str.trim() === '') return null
    return Relation.split(str)
  }
  /**
   * 判断语法单元是否为关系对象
   * @param {{_type: string}} obj 包含 _type 字段的语法单元
   * @returns {Boolean}
   */
  static isRelation (obj) {
    return obj._tag === 'relation'
  }
  /**
   * 判断语法单元是否为元规则
   * @param {{_type: string}} obj
   * @returns {Boolean}
   */
  static isRuleUnit (obj) {
    return obj._tag === 'ruleunit'
  }
}

export default RuleGenerator
export {
  RuleUnit,
  Relation,
  flags as RuleFlags
}