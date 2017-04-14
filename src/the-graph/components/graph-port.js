const reactMixin = require('react-mixin');
const Component = require('react').Component

class GraphPort extends Component {
  get displayName() {
    return 'TheGraphPort'
  }

  _addEventListener(node, event, handler, ...args) {
    node.addEventListener(event, handler.bind(this), ...args);
  }

  componentDidMount() {
    let node = ReactDOM.findDOMNode(this);
    // Preview edge start
    this._addEventListener(node, 'tap', this.edgeStart);
    // Make edge
    this._addEventListener(node, 'track', this.trackHandler);
    this._addEventListener(node, 'the-graph-edge-drop', this.edgeStart);

    // Show context menu
    if (this.props.showContext) {
      this._addEventListener(node, 'contextmenu', this.showContext);
      this._addEventListener(node, 'hold', this.showContext);
    }
  }

  trackHandler(event) {
    // Don't fire on graph
    event.stopPropagation();
    let detail = event.detail
    switch (detail.state) {
      case 'start':
        this.edgeStart(event);
        break;
      case 'track':
        // this._onTrack(event);
        break;
      case 'end':
        let hoverElem = detail.hover()
        event.relatedTarget = hoverElem
        this.triggerDropOnTarget(event);
        break;
    }
  }

  getTooltipTrigger() {
    return ReactDOM.findDOMNode(this);
  }

  shouldShowTooltip() {
    return (
      this.props.app.state.scale < TheGraph.zbpBig ||
      this.props.label.length > 8
    );
  }
  showContext(event) {
    // Don't show port menu on export node port
    if (this.props.isExport) {
      return;
    }
    // Click on label, pass context menu to node
    if (event && (event.target === ReactDOM.findDOMNode(this.refs.label))) {
      return;
    }
    // Don't show native context menu
    event.preventDefault();

    // Don't tap graph on hold event
    event.stopPropagation();
    if (event.preventTap) {
      event.preventTap();
    }

    // Get mouse position
    var x = event.x || event.clientX || 0;
    var y = event.y || event.clientY || 0;

    // App.showContext
    this.props.showContext({
      element: this,
      type: (this.props.isIn ? 'nodeInport' : 'nodeOutport'),
      x: x,
      y: y,
      graph: this.props.graph,
      itemKey: this.props.label,
      item: this.props.port
    });
  }

  getContext(menu, options, hide) {
    return TheGraph.Menu({
      menu: menu,
      options: options,
      label: this.props.label,
      triggerHideContext: hide
    });
  }

  edgeStart(event) {
    // Don't start edge on export node port
    if (this.props.isExport) {
      return;
    }

    // Click on label, pass context menu to node
    if (event && (event.target === ReactDOM.findDOMNode(this.refs.label))) {
      return;
    }
    // Don't tap graph
    event.stopPropagation();
    var edgeStartEvent = new CustomEvent('the-graph-edge-start', {
      detail: {
        isIn: this.props.isIn,
        port: this.props.port,
        // process: this.props.processKey,
        route: this.props.route
      },
      bubbles: true
    });
    let node = ReactDOM.findDOMNode(this)
    node.dispatchEvent(edgeStartEvent);
  }

  triggerDropOnTarget(event) {
    let sourceEvent = event.detail.sourceEvent

    // throw new Error('fuck')
    // If dropped on a child element will bubble up to port

    // 'relatedTarget', optional and defaulting to null, of type EventTarget,
    // that is the element just left (in case of  a mouseenter or mouseover)
    // or is entering (in case of a mouseout or mouseleave).
    var target = event.relatedTarget // || sourceEvent.toElement || sourceEvent.fromElement
    if (!target) {
      return;
    }
    var dropEvent = new CustomEvent('the-graph-edge-drop', {
      detail: null,
      bubbles: true
    });
    let targetNode = target
    targetNode.dispatchEvent(dropEvent);
  }

  render() {
    var style;
    if (this.props.label.length > 7) {
      var fontSize = 6 * (30 / (4 * this.props.label.length));
      style = {
        'fontSize': fontSize + 'px'
      };
    }
    var r = 4;
    // Highlight matching ports
    var highlightPort = this.props.highlightPort;
    var inArc = TheGraph.arcs.inport;
    var outArc = TheGraph.arcs.outport;
    if (highlightPort && highlightPort.isIn === this.props.isIn && (highlightPort.type === this.props.port.type || this.props.port.type === 'any')) {
      r = 6;
      inArc = TheGraph.arcs.inportBig;
      outArc = TheGraph.arcs.outportBig;
    }

    var backgroundCircleOptions = TheGraph.merge(TheGraph.config.port.backgroundCircle, {
      r: r + 1
    });
    var backgroundCircle = TheGraph.factories.port.createPortBackgroundCircle.call(this, backgroundCircleOptions);

    var arcOptions = TheGraph.merge(TheGraph.config.port.arc, {
      d: (this.props.isIn ? inArc : outArc)
    });
    var arc = TheGraph.factories.port.createPortArc.call(this, arcOptions);

    var innerCircleOptions = {
      className: 'port-circle-small fill route' + this.props.route,
      r: r // - 0.5
    };

    innerCircleOptions = TheGraph.merge(TheGraph.config.port.innerCircle, innerCircleOptions);
    var innerCircle = TheGraph.factories.port.createPortInnerCircle.call(this, innerCircleOptions);

    var labelTextOptions = {
      x: (this.props.isIn ? 5 : -5),
      style: style,
      children: this.props.label
    };
    labelTextOptions = TheGraph.merge(TheGraph.config.port.text, labelTextOptions);
    var labelText = TheGraph.factories.port.createPortLabelText.call(this, labelTextOptions);

    var portContents = [
      backgroundCircle,
      arc,
      innerCircle,
      labelText
    ];

    var containerOptions = TheGraph.merge(TheGraph.config.port.container, {
      title: this.props.label,
      transform: 'translate(' + this.props.x + ',' + this.props.y + ')'
    });
    return TheGraph.factories.port.createPortGroup.call(this, containerOptions, portContents);

  }
}

var ToolTipMixin = require('../mixins/tooltip')
reactMixin.bindClass(GraphPort, ToolTipMixin)

module.exports = GraphPort