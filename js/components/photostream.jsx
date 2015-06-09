import React from 'react'
import $ from 'zepto'
import { map, reduce } from 'lodash'

import More from 'components/waypoint_more'
import WaypointImg from 'components/waypoint_img'

class DateCard extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.date != this.props.date
  }

  render() {
    let date = this.props.date
    return (
      <li className={`card ${date.format('ddd').toLowerCase()}`} key={date.format()}>
        <div className="date">
          <h1>{date.date()}</h1>
          <h2>{date.format('MMMM / YYYY')}</h2>
        </div>
        <img src="/static/1x1.gif" className="background"/>
      </li>
    )
  }
}

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
      || nextProps.className != this.props.className
      || nextProps.pic.starred != this.props.pic.starred
  }

  render() {
    let pic = this.props.pic

    return (
      <li className={['card', this.props.className].join(' ')} key={pic.fileName} onClick={this.openGallery.bind(this, pic)}>
        <WaypointImg className="foreground" src={pic.url({resize: pic.starred? [600, 600] : [300, 300], sharpen: []})} />
        <img src="/static/1x1.gif" className="background"/>
      </li>
    )
  }
}

export default class Photostream extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {
    function x2class() {
      if (x2class.clazz == 'x2 x2-left') {
        return x2class.clazz = 'x2 x2-right'
      } else {
        return x2class.clazz = 'x2 x2-left'
      }
    }

    let cards = []
    let lastDate = reduce(this.props.pics, (currDate, pic, i)=> {
      if (i % 5 == 0) pic.starred = true

      if (!pic.date.isSame(currDate, 'day')) cards.push(<DateCard date={pic.date} />)

      cards.push(<PicCard pic={pic} es={this.props.es} className={pic.starred? x2class() : ''} />)
      return pic.date
    })

    cards.push(<More es={this.props.es} since={lastDate? lastDate.valueOf() : ''} />)

    return <ul className="cards">{ cards }</ul>
  }
}
