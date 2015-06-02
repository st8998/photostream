import React from 'react'
import $ from 'zepto'
import { merge } from 'lodash'

console.log($)

let { img } = React.DOM

export default class WaypointImg extends React.Component {
  constructor(props) {
    super(props)
    this.state = {src: ''}
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.src != nextState.src
  }

  componentDidMount() {
    let img = this

    img.waypoint = new Waypoint({
      element: React.findDOMNode(this),
      enabled: true,
      offset: ()=> 2*Waypoint.viewportHeight(),
      handler: function() {
        this.destroy()
        img.setState({src: img.props.src})
      }
    })
  }

  componentDidUpdate() {
    let img = React.findDOMNode(this)
    let $img = $(img)

    $img.css({opacity: 0})
    if (img.complete || img.naturalWidth > 0) {
      $img.css({opacity: 1})
    } else {
      $img.one('load', function() { $img.css({opacity: 1, transition: 'opacity .3s'}) })
    }
  }

  componentWillUnmount() {
    this.waypoint.destroy()
  }

  render() {
    return img(merge({}, this.props, {src: this.state.src}))
  }
}