module.exports.register = function (context) {

  var TheGraph = context.TheGraph;

  // Initialize namespace for configuration and factory functions.
  TheGraph.config.node = require('./config/node')(TheGraph.config)

  // These factories use generic factories from the core, but
  // each is called separately allowing developers to intercept
  // individual elements of the node creation.
  TheGraph.factories.node = require('./factories/node')(TheGraph)

  // PolymerGestures monkeypatch
  // Deprecated!!
  function patchGestures() {}

  const GraphNode = require('./components/graph-node')

  // Node view
  TheGraph.Node = React.createFactory(GraphNode);
};