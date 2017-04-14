module.exports = React.createClass({
  displayName: "TheGraphModalBG",
  componentDidMount: function () {
    var domNode = ReactDOM.findDOMNode(this);
    var rectNode = this.refs.rect;

    // Right-click on another item will show its menu
    domNode.addEventListener("down", function (event) {
      // Only if outside of menu
      if (event && event.target === rectNode) {
        this.hideModal();
      }
    }.bind(this));
  },
  hideModal: function (event) {
    this.props.triggerHideContext();
  },
  render: function () {


    var rectOptions = {
      width: this.props.width,
      height: this.props.height
    };

    rectOptions = TheGraph.merge(TheGraph.config.modalBG.rect, rectOptions);
    var rect = TheGraph.factories.modalBG.createModalBackgroundRect.call(this, rectOptions);

    var containerContents = [rect, this.props.children];
    var containerOptions = TheGraph.merge(TheGraph.config.modalBG.container, {});
    return TheGraph.factories.modalBG.createModalBackgroundGroup.call(this, containerOptions, containerContents);
  }
})