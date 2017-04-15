const Component = require('react').Component

module.exports = class GraphGroup extends Component {
  get displayName() {
    return 'TheGraphGroup'
  }

  _addEventListener(node, event, handler, ...args) {
    node.addEventListener(event, handler.bind(this), ...args);
  }

  componentDidMount() {
    // Move group
    if (this.props.isSelectionGroup) {
      // Drag selection by bg
      var boxNode = ReactDOM.findDOMNode(this.refs.box)
      this._addEventListener(boxNode, 'track', this.onTrackStart);
    } else {
      var labelNode = ReactDOM.findDOMNode(this.refs.label)
      this._addEventListener(labelNode, 'track', this.onTrackStart);
    }

    var domNode = ReactDOM.findDOMNode(this);

    // Don't pan under menu
    this._addEventListener(domNode, 'track', this.dontPan);

    // Context menu
    if (this.props.showContext) {
      this._addEventListener(domNode, 'contextmenu', this.showContext);
      this._addEventListener(domNode, 'hold', this.showContext);
    }
  }
  showContext(event) {
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
      type: (this.props.isSelectionGroup ? 'selection' : 'group'),
      x: x,
      y: y,
      graph: this.props.graph,
      itemKey: this.props.label,
      item: this.props.item
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

  dontPan(event) {
    // Don't drag under menu
    if (this.props.app.menuShown) {
      event.stopPropagation();
    }
  }

  trackHandler(event) {
    event.stopPropagation();
    switch (event.detail.state) {
      case 'start':
        this.onTrackStart(event);
        break;
      case 'track':
        this.onTrack(event);
        break;
      case 'end':
        this.onTrackEnd(event);
        break;
    }
  }

  onTrackStart(event) {
    // Don't drag graph
    event.stopPropagation();

    this.props.graph.startTransaction('movegroup');
  }

  onTrack(event) {
    // Don't fire on graph
    event.stopPropagation();

    var deltaX = Math.round(event.ddx / this.props.scale);
    var deltaY = Math.round(event.ddy / this.props.scale);

    this.props.triggerMoveGroup(this.props.item.nodes, deltaX, deltaY);
  }

  onTrackEnd(event) {
    // Don't fire on graph
    event.stopPropagation();

    // Don't tap graph (deselect)
    event.preventTap();

    // Snap to grid
    this.props.triggerMoveGroup(this.props.item.nodes);

    if (this.props.isSelectionGroup) {
      var box = ReactDOM.findDOMNode(this.refs.box);
      box.removeEventListener('track', this.onTrack);
    } else {
      var label = ReactDOM.findDOMNode(this.refs.label);
      label.removeEventListener('track', this.onTrack);
    }

    this.props.graph.endTransaction('movegroup');
  }

  render() {
    var x = this.props.minX - TheGraph.config.nodeWidth / 2;
    var y = this.props.minY - TheGraph.config.nodeHeight / 2;
    var color = (this.props.color ? this.props.color : 0);
    var selection = (this.props.isSelectionGroup ? ' selection drag' : '');
    var boxRectOptions = {
      x: x,
      y: y,
      width: this.props.maxX - x + TheGraph.config.nodeWidth * 0.5,
      height: this.props.maxY - y + TheGraph.config.nodeHeight * 0.75,
      className: 'group-box color' + color + selection
    };
    boxRectOptions = TheGraph.merge(TheGraph.config.group.boxRect, boxRectOptions);
    var boxRect = TheGraph.factories.group.createGroupBoxRect.call(this, boxRectOptions);

    var labelTextOptions = {
      x: x + TheGraph.config.nodeRadius,
      y: y + 9,
      children: this.props.label
    };
    labelTextOptions = TheGraph.merge(TheGraph.config.group.labelText, labelTextOptions);
    var labelText = TheGraph.factories.group.createGroupLabelText.call(this, labelTextOptions);

    var descriptionTextOptions = {
      x: x + TheGraph.config.nodeRadius,
      y: y + 24,
      children: this.props.description
    };
    descriptionTextOptions = TheGraph.merge(TheGraph.config.group.descriptionText, descriptionTextOptions);
    var descriptionText = TheGraph.factories.group.createGroupDescriptionText.call(this, descriptionTextOptions);

    var groupContents = [
      boxRect,
      labelText,
      descriptionText
    ];

    var containerOptions = TheGraph.merge(TheGraph.config.group.container, {});
    return TheGraph.factories.group.createGroupGroup.call(this, containerOptions, groupContents);

  }
}