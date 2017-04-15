module.exports.register = function (context) {

  var TheGraph = context.TheGraph;

  TheGraph.config.iip = require('./config/iip')
  TheGraph.factories.iip = require('./factories/iip')(TheGraph)

  // Edge view
  const GraphIip = require('./components/graph-iip')
  TheGraph.IIP = React.createFactory(GraphIip);
};