const util = require('./util')
var cloneObject = util.cloneObject
var makeNewId = util.makeNewId

module.exports = function (graph) {
  var map = {};
  var pasted = {
    nodes: [],
    edges: []
  };
  var i, len;
  for (i = 0, len = clipboardContent.nodes.length; i < len; i++) {
    var node = clipboardContent.nodes[i];
    var meta = cloneObject(node.metadata);
    meta.x += 36;
    meta.y += 36;
    var newNode = graph.addNode(makeNewId(node.component), node.component, meta);
    map[node.id] = newNode.id;
    pasted.nodes.push(newNode);
  }
  for (i = 0, len = clipboardContent.edges.length; i < len; i++) {
    var edge = clipboardContent.edges[i];
    var newEdgeMeta = cloneObject(edge.metadata);
    var newEdge;
    if (edge.from.hasOwnProperty('index') || edge.to.hasOwnProperty('index')) {
      // One or both ports are addressable
      var fromIndex = edge.from.index || null;
      var toIndex = edge.to.index || null;
      newEdge = graph.addEdgeIndex(map[edge.from.node], edge.from.port, fromIndex, map[edge.to.node], edge.to.port, toIndex, newEdgeMeta);
    } else {
      newEdge = graph.addEdge(map[edge.from.node], edge.from.port, map[edge.to.node], edge.to.port, newEdgeMeta);
    }
    pasted.edges.push(newEdge);
  }
  return pasted;
};