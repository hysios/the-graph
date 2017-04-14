module.exports.register = function (context) {

  var TheGraph = context.TheGraph;

  TheGraph.config.graph = require('./config/graph')
  TheGraph.factories.graph = require('./factories/graph')(TheGraph)

  // Graph view
  const Graph = require('./components/graph')
  TheGraph.Graph = React.createFactory(Graph);
};