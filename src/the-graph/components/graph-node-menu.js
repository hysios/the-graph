const reactMixin = require('react-mixin');
const Component = require('react').Component

module.exports = class GraphNodeMenu extends Component {
  get displayName() {
    return 'TheGraphNodeMenu'
  }

  get radius() {
    return 72
  }

  stopPropagation(event) {
    // Don't drag graph
    event.stopPropagation();
  }

  componentDidMount() {
    // Prevent context menu
    var node = ReactDOM.findDOMNode(this)
    node.addEventListener("contextmenu", function (event) {
      event.stopPropagation();
      event.preventDefault();
    }, false);
  }

  render() {
    var scale = this.props.node.props.app.state.scale;
    var ports = this.props.ports;
    var deltaX = this.props.deltaX;
    var deltaY = this.props.deltaY;

    var inportsOptions = {
      ports: ports.inports,
      isIn: true,
      scale: scale,
      processKey: this.props.processKey,
      deltaX: deltaX,
      deltaY: deltaY,
      nodeWidth: this.props.nodeWidth,
      nodeHeight: this.props.nodeHeight,
      highlightPort: this.props.highlightPort
    };

    inportsOptions = TheGraph.merge(TheGraph.config.nodeMenu.inports, inportsOptions);
    var inports = TheGraph.factories.nodeMenu.createNodeMenuInports.call(this, inportsOptions);

    var outportsOptions = {
      ports: ports.outports,
      isIn: false,
      scale: scale,
      processKey: this.props.processKey,
      deltaX: deltaX,
      deltaY: deltaY,
      nodeWidth: this.props.nodeWidth,
      nodeHeight: this.props.nodeHeight,
      highlightPort: this.props.highlightPort
    };

    outportsOptions = TheGraph.merge(TheGraph.config.nodeMenu.outports, outportsOptions);
    var outports = TheGraph.factories.nodeMenu.createNodeMenuOutports.call(this, outportsOptions);

    var menuOptions = {
      menu: this.props.menu,
      options: this.props.options,
      triggerHideContext: this.props.triggerHideContext,
      icon: this.props.icon,
      label: this.props.label
    };

    menuOptions = TheGraph.merge(TheGraph.config.nodeMenu.menu, menuOptions);
    var menu = TheGraph.factories.nodeMenu.createNodeMenuMenu.call(this, menuOptions);

    var children = [
      inports, outports, menu
    ];

    var containerOptions = {
      transform: "translate(" + this.props.x + "," + this.props.y + ")",
      children: children
    };
    containerOptions = TheGraph.merge(TheGraph.config.nodeMenu.container, containerOptions);
    return TheGraph.factories.nodeMenu.createNodeMenuGroup.call(this, containerOptions);

  }
}