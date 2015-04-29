import transit from 'transit-js'
import Pic from './pic'
import moment from 'moment'

let PicHandler = transit.makeWriteHandler({
  tag: function(v, h) { return 'pic' },
  rep: function(v, h) { return [v.fileName, v.width, v.height, v.date] },
  stringRep: function(v, h) { return null }
})

let MomentHandler = transit.makeWriteHandler({
  tag: function(v, h) { return 'm' },
  rep: function(v, h) { return ''+v.valueOf() },
  stringRep: function(v, h) { return null }
})


export const writer = transit.writer('json', {
  handlers: transit.map([
    Pic, PicHandler,
    moment().constructor, MomentHandler
  ])
})

export const reader = transit.reader('json', {
  handlers: {
    pic: (rep)=> new Pic({fileName: rep[0], width: rep[1], height: rep[2], date: rep[3]}),
    m: (rep)=> moment(parseInt(rep))
  },
  mapBuilder: {
    init: function(node) { return {} },
    add: function(ret, key, val, node) { ret[key] = val; return ret },
    finalize: function(ret, node) { return ret }
  }
})
