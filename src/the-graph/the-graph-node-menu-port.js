module.exports.register = function (context) {

  var TheGraph = context.TheGraph;

  TheGraph.config.nodeMenuPort = {
    container: {},
    backgroundRect: {
      rx: TheGraph.config.nodeRadius,
      ry: TheGraph.config.nodeRadius,
      height: TheGraph.contextPortSize - 1
    },
    circle: {
      r: 10
    },
    text: {}
  };

  TheGraph.factories.nodeMenuPort = {
    createNodeMenuPortGroup: TheGraph.factories.createGroup,
    createNodeMenuBackgroundRect: TheGraph.factories.createRect,
    createNodeMenuPortCircle: TheGraph.factories.createCircle,
    createNodeMenuPortText: TheGraph.factories.createText
  };

  const NodeMenuPort = require('./components/node-menu-port')
  TheGraph.NodeMenuPort = React.createFactory(NodeMenuPort);
};