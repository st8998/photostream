let Base64 = require('js-base64').Base64
let _ = require('lodash')

class Pic {
  constructor({fileName = '', trans = {}}) {
    this.fileName = fileName
    this.trans = trans
  }

  encode(trans) {
    return Base64.encodeURI(JSON.stringify(trans))
  }

  static decode(hash) {
    return new Pic({trans: JSON.parse(Base64.decode(hash))})
  }
}

module.exports = Pic
