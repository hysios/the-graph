module.exports.register = function (context) {

  var TheGraph = context.TheGraph;

  TheGraph.config.edge = require('./config/edge')(TheGraph.config)

  TheGraph.factories.edge = require('./factories/edge')(TheGraph.factories)

  // Edge view
  const GraphEdge = require('./components/graph-edge')(TheGraph)
  TheGraph.Edge = React.createFactory(GraphEdge);
};