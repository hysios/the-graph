const reactMixin = require('react-mixin');
const Component = require('react').Component

module.exports = class GraphTooltip extends Component {
  get displayName() {
    return 'TheGraphTooltip'
  }

  render() {
    var rectOptions = TheGraph.merge(TheGraph.config.tooltip.rect, {
      width: this.props.label.length * 6
    });
    var rect = TheGraph.factories.tooltip.createTooltipRect.call(this, rectOptions);

    var textOptions = TheGraph.merge(TheGraph.config.tooltip.text, {
      children: this.props.label
    });
    var text = TheGraph.factories.tooltip.createTooltipText.call(this, textOptions);

    var containerContents = [rect, text];

    var containerOptions = {
      className: "tooltip" + (this.props.visible ? "" : " hidden"),
      transform: "translate(" + this.props.x + "," + this.props.y + ")",
    };
    containerOptions = TheGraph.merge(TheGraph.config.tooltip.container, containerOptions);
    return TheGraph.factories.tooltip.createTooltipGroup.call(this, containerOptions, containerContents);

  }
}