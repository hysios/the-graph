module.exports.register = function (context) {

  var TheGraph = context.TheGraph;

  TheGraph.config.nodeMenuPorts = {
    container: {},
    linesGroup: {
      className: "context-ports-lines"
    },
    portsGroup: {
      className: "context-ports-ports"
    },
    portPath: {
      className: "context-port-path"
    },
    nodeMenuPort: {}
  };

  TheGraph.factories.menuPorts = {
    createNodeMenuPortsGroup: TheGraph.factories.createGroup,
    createNodeMenuPortsLinesGroup: TheGraph.factories.createGroup,
    createNodeMenuPortsPortsGroup: TheGraph.factories.createGroup,
    createNodeMenuPortsPortPath: TheGraph.factories.createPath,
    createNodeMenuPortsNodeMenuPort: createNodeMenuPort
  };

  function createNodeMenuPort(options) {
    return TheGraph.NodeMenuPort(options);
  }

  const NodeMenuPorts = require('./components/node-menu-ports')
  TheGraph.NodeMenuPorts = React.createFactory(NodeMenuPorts);
};