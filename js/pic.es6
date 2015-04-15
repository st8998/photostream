let Base64 = require('js-base64').Base64
let _ = require('lodash')

let encodeTable = {
  'resize': 'r'
}
let decodeTable = _.invert(encodeTable)

let transform = (codeTable, attrs)=> _.transform(attrs, (out, value, key)=> out[codeTable[key] || key] = value)

let encodeAttrs = _.partial(transform, encodeTable)
let decodeAttrs = _.partial(transform, decodeTable)

let encodeFlow = _.flow(encodeAttrs, JSON.stringify, Base64.encodeURI)
let decodeFlow = _.flow(Base64.decode, JSON.parse, decodeAttrs)

class Pic {
  constructor({fileName = '', trans = {}}) {
    this.fileName = fileName
    this.trans = trans
  }

  encode() {
    return encodeFlow(this.trans)
  }

  static decode(hash) {
    return new Pic({trans: decodeFlow(hash)})
  }
}

module.exports = Pic
