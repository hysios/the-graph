const Component = require('react').Component

module.exports = class TheGraphNodeMenuPort extends Component {
  get displayName() {
    return 'TheGraphNodeMenuPort'
  }

  _addEventListener(node, event, handler, ...args) {
    node.addEventListener(event, handler.bind(this), ...args);
  }

  componentDidMount() {
    var node = ReactDOM.findDOMNode(this)
    this._addEventListener(node, 'up', this.edgeStart);
  }

  edgeStart(event) {
    // Don't tap graph
    event.stopPropagation();

    var port = {
      process: this.props.processKey,
      port: this.props.label,
      type: this.props.port.type
    };

    var edgeStartEvent = new CustomEvent('the-graph-edge-start', {
      detail: {
        isIn: this.props.isIn,
        port: port,
        route: this.props.route
      },
      bubbles: true
    });
    var node = ReactDOM.findDOMNode(this)
    node.dispatchEvent(edgeStartEvent);
  }

  render() {
    var labelLen = this.props.label.length;
    var bgWidth = (labelLen > 12 ? labelLen * 8 + 40 : 120);
    // Highlight compatible port
    var highlightPort = this.props.highlightPort;
    var highlight = (highlightPort && highlightPort.isIn === this.props.isIn && highlightPort.type === this.props.port.type);

    var rectOptions = {
      className: 'context-port-bg' + (highlight ? ' highlight' : ''),
      x: this.props.x + (this.props.isIn ? -bgWidth : 0),
      y: this.props.y - TheGraph.contextPortSize / 2,
      width: bgWidth
    };

    rectOptions = TheGraph.merge(TheGraph.config.nodeMenuPort.backgroundRect, rectOptions);
    var rect = TheGraph.factories.nodeMenuPort.createNodeMenuBackgroundRect.call(this, rectOptions);

    var circleOptions = {
      className: 'context-port-hole stroke route' + this.props.route,
      cx: this.props.x,
      cy: this.props.y,
    };
    circleOptions = TheGraph.merge(TheGraph.config.nodeMenuPort.circle, circleOptions);
    var circle = TheGraph.factories.nodeMenuPort.createNodeMenuPortCircle.call(this, circleOptions);

    var textOptions = {
      className: 'context-port-label fill route' + this.props.route,
      x: this.props.x + (this.props.isIn ? -20 : 20),
      y: this.props.y,
      children: this.props.label.replace(/(.*)\/(.*)(_.*)\.(.*)/, '$2.$4')
    };

    textOptions = TheGraph.merge(TheGraph.config.nodeMenuPort.text, textOptions);
    var text = TheGraph.factories.nodeMenuPort.createNodeMenuPortText.call(this, textOptions);

    var containerContents = [rect, circle, text];

    var containerOptions = TheGraph.merge(TheGraph.config.nodeMenuPort.container, {
      className: 'context-port click context-port-' + (this.props.isIn ? 'in' : 'out')
    });
    return TheGraph.factories.nodeMenuPort.createNodeMenuPortGroup.call(this, containerOptions, containerContents);

  }
}