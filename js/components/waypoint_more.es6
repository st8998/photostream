import React from 'react'

let { div } = React.DOM

export default class WaypointMore extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let comp = this
    comp.waypoint = new Waypoint({
      element: React.findDOMNode(this),
      enabled: true,
      offset: ()=> 2*Waypoint.viewportHeight(),
      handler: function() {
        this.destroy()
        comp.props.emitter.emit('load', {since: comp.props.since})
      }
    })
  }

  componentWillUnmount() {
    this.waypoint.destroy()
  }

  render() {
    return div({key: this.props.since})
  }
}