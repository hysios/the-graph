// Simulate a library update
/*
setTimeout(function () {
  var originalComponent = editor.getComponent('core/Split');
  if (!originalComponent) {
    console.warn("Didn't find component. Something is amiss.");
    return;
  }
  var component = JSON.parse(JSON.stringify(originalComponent));
  component.icon = 'github';
  component.inports.push({
    name: 'supercalifragilisticexpialidocious',
    type: 'boolean'
  });
  component.outports.push({
    name: 'boo',
    type: 'boolean'
  });
  editor.registerComponent(component);
}, 1000);
*/

// Simulate node icon updates
/*
var iconKeys = Object.keys(TheGraph.FONT_AWESOME);
window.setInterval(function () {
  if (!editor.fbpGraph) { return; }
  var nodes = editor.fbpGraph.nodes;
  if (nodes.length>0) {
    var randomNodeId = nodes[Math.floor(Math.random()*nodes.length)].id;
    var randomIcon = iconKeys[Math.floor(Math.random()*iconKeys.length)];
    editor.updateIcon(randomNodeId, randomIcon);
  }
}, 1000);
*/

// Simulate un/triggering wire animations
/*
var animatingEdge1 = null;
var animatingEdge2 = null;
window.setInterval(function () {
  if (!editor.fbpGraph) { return; }
  if (animatingEdge2) {
    editor.unanimateEdge(animatingEdge2);
  }
  if (animatingEdge1) {
    animatingEdge2 = animatingEdge1;
  }
  var edges = editor.fbpGraph.edges;
  if (edges.length>0) {
    animatingEdge1 = edges[Math.floor(Math.random()*edges.length)];
    editor.animateEdge(animatingEdge1);
  }
}, 2014);
*/

// Simulate un/triggering errors
/*
var errorNodeId = null;
var makeRandomError = function () {
  if (!editor.fbpGraph) { return; }
  if (errorNodeId) {
    editor.removeErrorNode(errorNodeId);
  }
  var nodes = editor.fbpGraph.nodes;
  if (nodes.length>0) {
    errorNodeId = nodes[Math.floor(Math.random()*nodes.length)].id;
    editor.addErrorNode(errorNodeId);
    editor.updateErrorNodes();
  }
};
window.setInterval(makeRandomError, 3551);
makeRandomError();
*/