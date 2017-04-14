module.exports.register = function (context) {
  var TheGraph = context.TheGraph;
  TheGraph.config.tooltip = require('./config/tooltip')
  TheGraph.factories.tooltip = require('./factories/tooltip')(TheGraph.factories)

  // Port view
  const GraphTooltip = require('./components/graph-tooltip')
  TheGraph.Tooltip = React.createFactory(GraphTooltip);
};