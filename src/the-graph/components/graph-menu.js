const reactMixin = require('react-mixin');
const Component = require('react').Component

module.exports = class GraphMenu extends Component {
  get displayName() {
    return 'TheGraphMenu'
  }

  _addEventListener(node, event, handler, ...args) {
    node.addEventListener(event, handler.bind(this), ...args);
  }

  get radius() {
    return TheGraph.config.menu.radius
  }

  getInitialState() {
    // Use these in CSS for cursor and hover, and to attach listeners
    return {
      n4tappable: (this.props.menu.n4 && this.props.menu.n4.action),
      s4tappable: (this.props.menu.s4 && this.props.menu.s4.action),
      e4tappable: (this.props.menu.e4 && this.props.menu.e4.action),
      w4tappable: (this.props.menu.w4 && this.props.menu.w4.action),
    };
  }
  onTapN4() {
    var options = this.props.options;
    this.props.menu.n4.action(options.graph, options.itemKey, options.item);
    this.props.triggerHideContext();
  }
  onTapS4() {
    var options = this.props.options;
    this.props.menu.s4.action(options.graph, options.itemKey, options.item);
    this.props.triggerHideContext();
  }
  onTapE4() {
    var options = this.props.options;
    this.props.menu.e4.action(options.graph, options.itemKey, options.item);
    this.props.triggerHideContext();
  }
  onTapW4() {
    var options = this.props.options;
    this.props.menu.w4.action(options.graph, options.itemKey, options.item);
    this.props.triggerHideContext();
  }
  componentDidMount() {
    if (this.state.n4tappable) {
      this.refs.n4.addEventListener("up", this.onTapN4);
    }
    if (this.state.s4tappable) {
      this.refs.s4.addEventListener("up", this.onTapS4);
    }
    if (this.state.e4tappable) {
      this.refs.e4.addEventListener("up", this.onTapE4);
    }
    if (this.state.w4tappable) {
      this.refs.w4.addEventListener("up", this.onTapW4);
    }

    // Prevent context menu
    ReactDOM.findDOMNode(this).addEventListener("contextmenu", function (event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
    }, false);
  }
  getPosition() {
    return {
      x: this.props.x !== undefined ? this.props.x : this.props.options.x || 0,
      y: this.props.y !== undefined ? this.props.y : this.props.options.y || 0
    };
  }
  render() {
    var menu = this.props.menu;
    var options = this.props.options;
    var position = this.getPosition();

    var circleXOptions = TheGraph.merge(TheGraph.config.menu.circleXPath, {});
    var outlineCircleOptions = TheGraph.merge(TheGraph.config.menu.outlineCircle, {
      r: this.radius
    });

    var children = [
      // Directional slices
      TheGraph.factories.menu.createMenuSlice.call(this, {
        direction: "n4"
      }),
      TheGraph.factories.menu.createMenuSlice.call(this, {
        direction: "s4"
      }),
      TheGraph.factories.menu.createMenuSlice.call(this, {
        direction: "e4"
      }),
      TheGraph.factories.menu.createMenuSlice.call(this, {
        direction: "w4"
      }),
      // Outline and X
      TheGraph.factories.menu.createMenuCircleXPath.call(this, circleXOptions),
      TheGraph.factories.menu.createMenuOutlineCircle.call(this, outlineCircleOptions)
    ];
    // Menu label
    if (this.props.label || menu.icon) {

      var labelTextOptions = {
        x: 0,
        y: 0 - this.radius - 15,
        children: (this.props.label ? this.props.label : menu.label)
      };

      labelTextOptions = TheGraph.merge(TheGraph.config.menu.labelText, labelTextOptions);
      children.push(TheGraph.factories.menu.createMenuLabelText.call(this, labelTextOptions));
    }
    // Middle icon
    if (this.props.icon || menu.icon) {
      var iconColor = (this.props.iconColor !== undefined ? this.props.iconColor : menu.iconColor);
      var iconStyle = "";
      if (iconColor) {
        iconStyle = " fill route" + iconColor;
      }

      var middleIconRectOptions = TheGraph.merge(TheGraph.config.menu.iconRect, {});
      var middleIcon = TheGraph.factories.menu.createMenuMiddleIconRect.call(this, middleIconRectOptions);

      var middleIconTextOptions = {
        className: "icon context-node-icon" + iconStyle,
        children: TheGraph.FONT_AWESOME[(this.props.icon ? this.props.icon : menu.icon)]
      };
      middleIconTextOptions = TheGraph.merge(TheGraph.config.menu.iconText, middleIconTextOptions);
      var iconText = TheGraph.factories.menu.createMenuMiddleIconText.call(this, middleIconTextOptions);

      children.push(middleIcon, iconText);
    }

    var containerOptions = {
      transform: "translate(" + position.x + "," + position.y + ")",
      children: children
    };

    containerOptions = TheGraph.merge(TheGraph.config.menu.container, containerOptions);
    return TheGraph.factories.menu.createMenuGroup.call(this, containerOptions);

  }
}