module.exports.register = function (context) {

  var TheGraph = context.TheGraph;

  TheGraph.config.nodeMenu = require('./config/node-menu')
  TheGraph.factories.nodeMenu = require('./factories/node-menu')(TheGraph)

  const GraphNodeMenu = require('./components/graph-node-menu')
  TheGraph.NodeMenu = React.createFactory(GraphNodeMenu);
};