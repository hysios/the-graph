module.exports.register = function (context) {

  var TheGraph = context.TheGraph;

  // Initialize configuration for the Port view.
  TheGraph.config.port = require('./config/port')
  TheGraph.factories.port = require('./factories/port')(TheGraph.factories)

  // Port view
  const GraphPort = require('./components/graph-port')
  TheGraph.Port = React.createFactory(GraphPort);


};