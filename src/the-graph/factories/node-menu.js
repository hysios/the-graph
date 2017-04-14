module.exports = TheGraph => {
  function createNodeMenuPorts(options) {
    return TheGraph.NodeMenuPorts(options);
  }

  function createNodeMenuMenu(options) {
    return TheGraph.Menu(options);
  }

  return {
    createNodeMenuGroup: TheGraph.factories.createGroup,
    createNodeMenuInports: createNodeMenuPorts,
    createNodeMenuOutports: createNodeMenuPorts,
    createNodeMenuMenu: createNodeMenuMenu
  };
}