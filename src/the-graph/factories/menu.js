module.exports = TheGraph => {
  function createMenuSlice(options) {
    /*jshint validthis:true */
    var direction = options.direction;
    var arcPathOptions = TheGraph.merge(TheGraph.config.menu.arcPath, {
      d: TheGraph.arcs[direction]
    });
    var children = [
      TheGraph.factories.menu.createMenuSliceArcPath(arcPathOptions)
    ];

    if (this.props.menu[direction]) {
      var slice = this.props.menu[direction];
      if (slice.icon) {
        var sliceIconTextOptions = {
          x: TheGraph.config.menu.positions[direction + "IconX"],
          y: TheGraph.config.menu.positions[direction + "IconY"],
          children: TheGraph.FONT_AWESOME[slice.icon]
        };
        sliceIconTextOptions = TheGraph.merge(TheGraph.config.menu.sliceIconText, sliceIconTextOptions);
        children.push(TheGraph.factories.menu.createMenuSliceIconText.call(this, sliceIconTextOptions));
      }
      if (slice.label) {
        var sliceLabelTextOptions = {
          x: TheGraph.config.menu.positions[direction + "IconX"],
          y: TheGraph.config.menu.positions[direction + "IconY"],
          children: slice.label
        };
        sliceLabelTextOptions = TheGraph.merge(TheGraph.config.menu.sliceLabelText, sliceLabelTextOptions);
        children.push(TheGraph.factories.menu.createMenuSliceLabelText.call(this, sliceLabelTextOptions));
      }
      if (slice.iconLabel) {
        var sliceIconLabelTextOptions = {
          x: TheGraph.config.menu.positions[direction + "LabelX"],
          y: TheGraph.config.menu.positions[direction + "LabelY"],
          children: slice.iconLabel
        };
        sliceIconLabelTextOptions = TheGraph.merge(TheGraph.config.menu.sliceIconLabelText, sliceIconLabelTextOptions);
        children.push(TheGraph.factories.menu.createMenuSliceIconLabelText.call(this, sliceIconLabelTextOptions));
      }
    }

    var containerOptions = {
      ref: direction,
      className: "context-slice context-node-info" + (this.state[direction + "tappable"] ? " click" : ""),
      children: children
    };
    containerOptions = TheGraph.merge(TheGraph.config.menu.container, containerOptions);
    return TheGraph.factories.menu.createMenuGroup.call(this, containerOptions);
  }

  return {
    createMenuGroup: TheGraph.factories.createGroup,
    createMenuSlice: createMenuSlice,
    createMenuSliceArcPath: TheGraph.factories.createPath,
    createMenuSliceText: TheGraph.factories.createText,
    createMenuSliceIconText: TheGraph.factories.createText,
    createMenuSliceLabelText: TheGraph.factories.createText,
    createMenuSliceIconLabelText: TheGraph.factories.createText,
    createMenuCircleXPath: TheGraph.factories.createPath,
    createMenuOutlineCircle: TheGraph.factories.createCircle,
    createMenuLabelText: TheGraph.factories.createText,
    createMenuMiddleIconRect: TheGraph.factories.createRect,
    createMenuMiddleIconText: TheGraph.factories.createText
  };
}