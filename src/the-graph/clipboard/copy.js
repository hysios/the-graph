const util = require('./util')
var cloneObject = util.cloneObject
var makeNewId = util.makeNewId

module.exports = function (graph, keys) {
  //Duplicate all the nodes before putting them in clipboard
  //this will make this work also with cut/Paste and once we
  //decide if/how we will implement cross-document copy&paste will work there too
  clipboardContent = {
    nodes: [],
    edges: []
  };
  var map = {};
  var i, len;
  for (i = 0, len = keys.length; i < len; i++) {
    var node = graph.getNode(keys[i]);
    var newNode = cloneObject(node);
    newNode.id = makeNewId(node.component);
    clipboardContent.nodes.push(newNode);
    map[node.id] = newNode.id;
  }
  for (i = 0, len = graph.edges.length; i < len; i++) {
    var edge = graph.edges[i];
    var fromNode = edge.from.node;
    var toNode = edge.to.node;
    if (map.hasOwnProperty(fromNode) && map.hasOwnProperty(toNode)) {
      var newEdge = cloneObject(edge);
      newEdge.from.node = map[fromNode];
      newEdge.to.node = map[toNode];
      clipboardContent.edges.push(newEdge);
    }
  }

};