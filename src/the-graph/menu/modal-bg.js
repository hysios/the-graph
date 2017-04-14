module.exports = function (TheGraph) {
  TheGraph.config.modalBG = {
    container: {},
    rect: {
      ref: "rect",
      className: "context-modal-bg"
    }
  };

  TheGraph.factories.modalBG = {
    createModalBackgroundGroup: TheGraph.factories.createGroup,
    createModalBackgroundRect: TheGraph.factories.createRect
  };

  const ModalBg = require('../components/menu/modal-bg')
  TheGraph.ModalBG = React.createFactory(ModalBg);
}