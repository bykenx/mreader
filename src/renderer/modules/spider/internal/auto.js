import RuleGenerator from '../../config/rule'

function autogenerate (dest, src) {
  for (let prop in src) {
    if (!src.hasOwnProperty(prop)) {
      continue
    }
    if (prop.endsWith('Rule')) {
      dest[prop] = RuleGenerator.generate(src[prop])
    } else {
      dest[prop] = src[prop]
    }
  }
}

export {
  autogenerate
}
