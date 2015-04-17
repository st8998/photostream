let Base64 = require('js-base64').Base64

let {partial, flow, invert, transform, merge, omit, pick} = require('lodash')

let encodeTable = {
  'resize': 'r',
  'fileName': 'f'
}
let decodeTable = invert(encodeTable)

let tableTransform = (codeTable, attrs)=> transform(attrs, (out, value, key)=> out[codeTable[key] || key] = value)

let encodeAttrs = partial(tableTransform, encodeTable)
let decodeAttrs = partial(tableTransform, decodeTable)

let encodeFlow = flow(encodeAttrs, JSON.stringify, Base64.encodeURI)
let decodeFlow = flow(Base64.decode, JSON.parse, decodeAttrs)

class Pic {
  constructor(attrs = {}) {
    merge(this, attrs)
  }

  encode(trans) {
    return encodeFlow(merge({fileName: this.fileName}, trans))
  }

  path() {
    return Pic.rootDir + this.fileName
  }

  static encode(attrs) {
    return encodeFlow(attrs)
  }

  static decode(hash) {
    let decoded = decodeFlow(hash)
    return new Pic({fileName: decoded.fileName, trans: omit(decoded, 'fileName')})
  }

  asJson() {
    return pick(this, 'fileName', 'width', 'height')
  }

  static fromJson(attrs) {
    return new Pic(attrs)
  }
}

Pic.rootDir = 'pics/'

module.exports = Pic
