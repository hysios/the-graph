module.exports.register = function (context) {

  var TheGraph = context.TheGraph;

  TheGraph.config.group = {
    container: {
      className: "group"
    },
    boxRect: {
      ref: "box",
      rx: TheGraph.config.nodeRadius,
      ry: TheGraph.config.nodeRadius
    },
    labelText: {
      ref: "label",
      className: "group-label drag"
    },
    descriptionText: {
      className: "group-description"
    }
  };

  TheGraph.factories.group = {
    createGroupGroup: TheGraph.factories.createGroup,
    createGroupBoxRect: TheGraph.factories.createRect,
    createGroupLabelText: TheGraph.factories.createText,
    createGroupDescriptionText: TheGraph.factories.createText
  };

  // Group view
  const Group = require('./components/group')
  TheGraph.Group = React.createFactory(Group);
};