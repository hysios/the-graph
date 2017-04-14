module.exports = TheGraph => {
  function createGraphNode(options) {
    return TheGraph.Node(options);
  }

  function createGraphEdge(options) {
    return TheGraph.Edge(options);
  }

  function createGraphIIP(options) {
    return TheGraph.IIP(options);
  }

  function createGraphGroup(options) {
    return TheGraph.Group(options);
  }

  function createGraphEdgePreview(options) {
    return TheGraph.Edge(options);
  }

  return {
    createGraphContainerGroup: TheGraph.factories.createGroup,
    createGraphGroupsGroup: TheGraph.factories.createGroup,
    createGraphEdgesGroup: TheGraph.factories.createGroup,
    createGraphIIPGroup: TheGraph.factories.createGroup,
    createGraphNodesGroup: TheGraph.factories.createGroup,
    createGraphInportsGroup: TheGraph.factories.createGroup,
    createGraphOutportsGroup: TheGraph.factories.createGroup,
    createGraphNode: createGraphNode,
    createGraphEdge: createGraphEdge,
    createGraphIIP: createGraphIIP,
    createGraphGroup: createGraphGroup,
    createGraphEdgePreview: createGraphEdgePreview
  };
}