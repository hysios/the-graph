module.exports.register = function (context) {

  var TheGraph = context.TheGraph;

  var unwrap = function (n) {
    return n;
  }

  TheGraph.config.app = require('./config/app')
  TheGraph.factories.app = require('./factories/app')(TheGraph)

  const GraphApp = require('./components/graph-app')(TheGraph)
  TheGraph.App = React.createFactory(GraphApp);
};