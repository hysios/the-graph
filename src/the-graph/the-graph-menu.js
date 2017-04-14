module.exports.register = function (context) {

  var TheGraph = context.TheGraph;

  TheGraph.config.menu = require('./config/menu')(TheGraph.config)
  TheGraph.factories.menu = require('./factories/menu')(TheGraph)

  const GraphMenu = require('./components/graph-menu')
  TheGraph.Menu = React.createFactory(GraphMenu);

  require('./menu/modal-bg')(TheGraph)
};