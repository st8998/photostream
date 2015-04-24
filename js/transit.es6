import transit from 'transit-js'
import Pic from './pic'

let PicHandler = transit.makeWriteHandler({
  tag: function(v, h) { return 'pic' },
  rep: function(v, h) { return [v.fileName, v.width, v.height, v.date] },
  stringRep: function(v, h) { return null }
})


export const writer = transit.writer('json', {
  'handlers': transit.map([
     Pic, PicHandler
  ])
})

export const reader = transit.reader('json', {
  'handlers': {
    'pic': (rep)=> new Pic({fileName: rep[0], width: rep[1], height: rep[2], date: rep[3]})
  }
})
