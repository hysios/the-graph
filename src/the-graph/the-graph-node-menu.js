module.exports.register = function (context) {

  var TheGraph = context.TheGraph;

  TheGraph.config.nodeMenu = {
    container: {
      className: "context-node"
    },
    inports: {},
    outports: {},
    menu: {
      x: 0,
      y: 0
    }
  };

  TheGraph.factories.nodeMenu = {
    createNodeMenuGroup: TheGraph.factories.createGroup,
    createNodeMenuInports: createNodeMenuPorts,
    createNodeMenuOutports: createNodeMenuPorts,
    createNodeMenuMenu: createNodeMenuMenu
  };

  function createNodeMenuPorts(options) {
    return TheGraph.NodeMenuPorts(options);
  }

  function createNodeMenuMenu(options) {
    return TheGraph.Menu(options);
  }

  const GraphNodeMenu = require('./components/graph-node-menu')
  TheGraph.NodeMenu = React.createFactory(GraphNodeMenu);
};