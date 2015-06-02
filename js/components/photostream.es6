import React from 'react'
import $ from 'zepto'
import { map, reduce } from 'lodash'

let more = React.createFactory(require('components/waypoint_more'))
let waypointImg = React.createFactory(require('components/waypoint_img'))
let { ul, li, img, div, h1, h2 } = React.DOM

class DateCard extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.date != this.props.date
  }

  render() {
    let date = this.props.date
    return li({className: `card ${date.format('ddd').toLowerCase()}`, key: date.format()},
      div({className: 'date'}, [
        h1(null, date.date()),
        h2(null, date.format('MMMM / YYYY'))]),
      img({className: 'background', src: '/static/1x1.gif'}))
  }
}
let dateCard = React.createFactory(DateCard)

class PicCard extends React.Component {
  openGallery(pic) {
    let $card = $(React.findDOMNode(this))
    this.props.es.onNext({
      action: 'open-gallery',
      pic: pic,
      from: {x: $card.offset().left, y: $card.offset().top, w: $card.width()}
    })
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.pic.fileName != this.props.pic.fileName
  }

  render() {
    let pic = this.props.pic
    return li({className: 'card', key: pic.fileName, onClick: this.openGallery.bind(this, pic)}, [
      waypointImg({className: 'foreground', src: pic.url({resize: [300, 300], sharpen: []})}),
      img({className: 'background', src: '/static/1x1.gif'})
    ])
  }
}
let picCard = React.createFactory(PicCard)

export default class Photostream extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {
    let cards = []
    let lastDate = reduce(this.props.pics, (currDate, pic)=> {
      if (!pic.date.isSame(currDate, 'day')) cards.push(dateCard({date: pic.date}))

      cards.push(picCard({pic, es: this.props.es}))
      return pic.date
    })

    cards.push(more({es: this.props.es, since: lastDate ? lastDate.valueOf() : ''}))

    return ul({className: 'cards'}, cards)
  }
}
