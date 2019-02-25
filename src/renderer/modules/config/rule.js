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

function lengthEqual(obj, len) {
    if (isEmpty(obj)) {
        return false
    }
    if (!hasOWn(obj, 'length')) {
        return false
    }
    return obj.length === len
}

var Rule = {
    // selector
    sels: {
        SEL_TAG: 0,
        SEL_CLASS: 1,
        SEL_ID: 2,
        SEL_UNKNOWN: 3
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


/**
 * @param {string} str
 * @returns {[string, number]}
 */
Rule._rule_class = function (str) {
    var remains = str.substring(5)
    var ins = this._ins(remains[0])
    remains = remains.substring(1)
    remains = remains.split('.')
    var classname = remains[0]
    var idx = remains[1] || 0
    return ['[class' + ins + classname + ']', idx]
}

/**
 * @param {string} str
 * @returns {[string, number]}
 */
Rule._rule_id = function (str) {
    var remains = str.substring(2)
    var ins = this._ins(remains[0])
    var _id = remains.substring(1)
    return ['[id' + ins + _id + ']', 0]
}

/**
 * @param {string} str
 * @returns {[string, number]}
 */
Rule._rule_tag = function (str) {
    var remains = str.substring(3)
    var ins = remains[0]
    if (!(ins === '.')) {
        throw Error('not support ins <' + ins + '>.')
    }
    remains = remains.substring(1)
    remains = remains.split('.')
    var tagname = remains[0]
    var idx = remains[1] || 0
    return [tagname, idx]
}

/**
 * @param {string} str
 * @returns {[string, number]}
 */
Rule._rule_unknown = function (str) {
    return ['', 0]
}

var RuleGenerator = {
    sels: {
        SEL_TAG: 'tag',
        SEL_CLASS: 'class',
        SEL_ID: 'id',
        SEL_VAL: 'val'
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

Rule.isRelation = function (obj) {
    return obj instanceof Relation
} 

Rule.isRuleUnit = function (obj) {
    return obj instanceof RuleUnit
}

RuleGenerator.generate = function (str) {
    return Relation.split(str)
}

RuleGenerator._ins = function (chr) {
    var ins = RuleGenerator.ins,
        _ins = Rule.ins
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

/**
 * @param {string} str
 * @param {string} part
 * @returns {string}
 */
Rule._ins = function (str) {
    var ins = this.ins
    switch(str) {
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

var RuleUnit = function RuleUnit (_type, ins, value, idx) {
    this._type = _type
    this.ins = ins 
    this.value = value
    this.idx = idx || 0
} 

RuleUnit.get = function (str) {
    var rule = this._build(str)
    if (!rule) {
        rule = this._build_unknown()
    }
    return rule
}

RuleUnit._build = function (str) {
    var sel, ins, val, idx = 0,
        sels = RuleGenerator.sels
    for (var i in sels) {
        if (match(str, sels[i])) {
            var remains = str
            sel = sels[i]
            remains = remains.slice(sel.length)
            if (remains === '') {
                throw Error('illegal ruleunit.')
            }
            ins = RuleGenerator._ins(remains[0])
            if (!ins) {
                throw Error('unspport ins.')
            }
            remains = remains.slice(1).split('.')
            val = remains[0]
            idx = ~~remains[1]
            return new RuleUnit(sel, ins, val, idx)
        }
    }
    return null
}

RuleUnit._build_unknown = function () {
}

var Relation = function Relation (_type, ary) {
    this._type = _type
    this.ary = ary
}

Relation.split = function (part) {
    var weight = RuleGenerator.relation_weight,
        relations = RuleGenerator.relations
    function _split (_part) {
        var _parts = [],
            i = 0
        for (; i < weight.length; i++) {
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
            return new Relation(relations[weight[i]], parts)
        }
    }
    return _split(part)
}

module.exports = RuleGenerator