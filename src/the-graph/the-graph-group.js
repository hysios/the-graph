module.exports.register = function (context) {

  var TheGraph = context.TheGraph;

  TheGraph.config.group = require('./factories/group')(TheGraph.config)
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