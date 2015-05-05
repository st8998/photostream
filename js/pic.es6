import res from 'res'
import { Base64 } from 'js-base64'
import { partial, flow, invert, transform, merge, omit, pick, values, mapValues, map } from 'lodash'

import { crc32 } from 'crc'

let { round } = Math

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

export default class Pic {
  constructor(attrs = {}) {
    merge(this, attrs)
    this.id = crc32(this.fileName)
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

  static normalizeTrans(trans) {
    return mapValues(trans, (params, name)=> {
      if (name == 'resize') {
        let dppx = Math.min(2, res.dppx())
        return map(params, (dim)=> dim*dppx)
      } else {
        return params
      }
    })
  }

  url(trans) {
    return `/pics/pipeline/${this.encode(Pic.normalizeTrans(trans))}`
    //return `http://d1b9r9h4o1t0v2.cloudfront.net/pics/pipeline/${this.encode(Pic.normalizeTrans(trans))}`
  }
}

Pic.sizes = [640, 1280]

//Pic.rootDir = '/Users/loki/Pictures/syncable/2015'
Pic.rootDir = '/Users/loki/Pictures/web/'
//Pic.rootDir = '/mnt/photostream/syncable/'
//Pic.rootDir = 'pics/'
