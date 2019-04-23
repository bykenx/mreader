/* eslint-disable */
import query from 'cheerio'
import decode from 'parse-entities'
import RuleGenerater from '../../config/rule'
import { RuleFlags, RuleUnit, Relation } from '../../config/rule'

const flagSels = RuleFlags.sels
const flagIns = RuleFlags.ins
const flagRelations = RuleFlags.relations

/**
 * @param {}
 * @param {RuleUnit} rule
 */
function find (content, rule) {
  let _type = rule.getType()
  let idx = rule.idx
  let result = null
  switch (_type) {
  case flagSels.SEL_ID:
    result = resolve_sel_id(content, rule)
    break
  case flagSels.SEL_CLASS:
    result = resolve_sel_class(content, rule)
    break
  case flagSels.SEL_TAG:
    result = resolve_sel_tag(content, rule)
    break
  case flagSels.SEL_VAL:
    result = resolve_sel_val(content, rule)
  }
  if (idx) {
    // 当指定位置时，查找 index 为 idx 值的Element
    result = result.filter(_idx => {
      return _idx === idx
    })
  }
  return result
}

/**
 * @param {}
 * @param {RuleUnit} rule
 */
function resolve_sel_class (content, rule) {
  let selector
  switch (rule.ins) {
  case flagIns.INS_CONTAINS:
    selector = '[class*="' + rule.value + '"]'
    break
  case flagIns.INS_ENDSWITH:
    selector = '[class$="' + rule.value + '"]'
    break
  case flagIns.INS_STARTSWITH:
    selector = '[class^="' + rule.value + '"]'
    break
  case flagIns.INS_EQUALS:
    selector = '.' + rule.value
    break
  default:
    selector = ''
  }
  return content.find(selector)
}

function resolve_sel_id (content, rule) {
  let selector
  switch (rule.ins) {
  case flagIns.INS_CONTAINS:
    selector = '[id*="' + rule.value + '"]'
    break
  case flagIns.INS_ENDSWITH:
    selector = '[id$="' + rule.value + '"]'
    break
  case flagIns.INS_STARTSWITH:
    selector = '[id^="' + rule.value + '"]'
    break
  case flagIns.INS_EQUALS:
    selector = '#' + rule.value
    break
  default:
    selector = ''
  }
  return content.find(selector)
}

function resolve_sel_tag (content, rule) {
  let selector
  switch (rule.ins) {
  case flagIns.INS_EQUALS:
    selector = rule.value
    break
  default:
    selector = ''
  }
  return content.find(selector)
}

function resolve_sel_val (content, rule) {
  switch (rule.value) {
  case 'href':
  case 'src':
    return content.attr(rule.value)
  case 'text':
    return content.text()
  case 'html':
    return decode(content.html())
  }
}

class Soup {
  constructor (content) {
    content = content || ''
    let $ = query.load(content)
    this._root = $($.root())
    this.ctx = this._root
  }
  /** @param {RuleUnit|Relation} rule */
  startAt (rule) {
    if (!rule) {
      throw Error('rule can not be null')
    }
    let that = this
    return {
      /**
       * @param {RuleUnit|Relation} rule2 
       * @returns {Promise<Array>}
       */
      find (rule2) {
        return new Promise((resolve, reject) => {
          let tasks = []
          that.findAll(rule).then(nodes => {
            nodes.each((_, node) => {
              tasks.push(that.find(rule2, query(node)))
            })
            Promise.all(tasks).then((result) => {
              resolve(result)
            }).catch(e => {
              reject(e)
            })
          }).catch(e => {
            reject(e)
          })
        })
      }
    }
  }
  /** @param {RuleUnit|Relation} rule */
  findAll (rule) {
    return new Promise((resolve, reject) => {
      let ctx = this._root
      let result = this._find(rule, ctx)
      resolve(result)
    })
  }
  /** @param {RuleUnit|Relation} rule */
  find (rule, ctx) {
    return new Promise((resolve, reject) => {
      ctx = ctx || this.ctx
      let result = this._find(rule, ctx)
      resolve(result)
    })
  }
  /**
   * @param {RuleUnit|Relation} rule
   */
  _find (rule, ctx) {
    // 当前规则对象为关系
    if (RuleGenerater.isRelation(rule)) {
      let _type = rule.getType()
      let rules = rule.getRules()
      switch (_type) {
      // 当前规则为一个并列规则时
      // 只要有结果返回就认为得到了想要的结果
      case flagRelations.RELATION_OR:
        for (let idx in rules) {
          let result = this._find(rules[idx], ctx)
          if (result) {
            return result
          }
        }
        break
      // 当前规则为上下级关系时，
      // 应该根据html标签一级一级的查找
      case flagRelations.RELATION_NEXT:
        for (let idx in rules) {
          ctx = this._find(rules[idx], ctx)
        }
        return ctx
      }
    // 当前关系对象为一般规则时
    } else if (RuleGenerater.isRuleUnit(rule)) {
      return find(ctx, rule)
    } else {
      return ''
    }
  }
}

export default Soup
