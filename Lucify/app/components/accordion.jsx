import React from 'react';
import cx from 'classnames';

class Accordion extends React.Component {
  constructor(props) {
    super(props)
    const { children, selectedIndex } = this.props;
    this.index = typeof props.selectedIndex !== 'undefined' ? props.selectedIndex : -1
    this.nodes = []
    this.isOpen = false;
    this.state = {
      heights: React.Children.map(
        children,
        (child, index) => (index === selectedIndex ? 'auto' : 0)
      )
    }
  }

  componentWillReceiveProps(props) {
    const { selectedIndex } = props;
    if (typeof selectedIndex !== 'undefined' && this.index !== selectedIndex) {
      this.toggle(selectedIndex);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  close(index) {
    setTimeout(() => this.setHeight(index, 0), 50);
  }

  setHeight(index, height, callback) {
    const heights = this.state.heights.slice();
    heights[index] = height;
    this.setState({ heights }, callback);
  }

  open(index) {
    clearTimeout(this.timeout);
    this.setHeight(index, this.nodes[index].children[1].children[0].offsetHeight, () => {
      this.timeout = setTimeout(() => this.setHeight(index, 'auto'), this.props.transitionDuration);
    })
  }

  setFixedHeightOnCurrentlyOpenedItem() {
    return new Promise(resolve => {
      if (this.index > -1) {
        this.setHeight(
          this.index,
          this.nodes[this.index].children[1].children[0].offsetHeight,
          resolve
        )
      }
      else {
        resolve();
      }
    })
  }

  toggle(index, click) {
    const { onChange, changeOnClick } = this.props;
    clearTimeout(this.timeout);

    if (click) {
      if (onChange) {
        onChange(index, this.index !== index, this.index !== index ? index : -1);
      }
      if (!changeOnClick) return;
    }

    // First, set a fixed height on the currently opened item, for collapse animation to work
    this.setFixedHeightOnCurrentlyOpenedItem().then(() => {
      if (this.index > -1) {
        this.close(this.index);
      }

      if (index > -1 && index !== this.index) {
        this.index = index;
        this.open(index);
      }
      else {
        this.index = -1
      }
    })

    this.isOpen = !this.isOpen;
  }

  getClasses(){
    const classes = cx({
      'accordion-controller': this.isOpen
    });

    return classes
  }

  render() {
    const { transitionDuration, transitionTimingFunction, className, openClassName } = this.props;
    const nodes = React.Children.map(this.props.children, (child, index) => (
      <div
        key={index}
        ref={div => {
          this.nodes[index] = div;
        }}
        className={this.index === index ? openClassName : ''}
      >
        <div onClick={() => this.toggle(index, true)}>{child.props['data-header']}</div>
        <div className={this.getClasses()} style={{
          overflow: 'hidden',
          transition: `height ${transitionDuration}ms ${transitionTimingFunction}`,
          height: this.state.heights[index]
        }}>{child}</div>
      </div>
    ));
    return <div className={className}>{nodes}</div>
  }
}

Accordion.defaultProps = {
  transitionDuration: 500,
  transitionTimingFunction: 'ease',
  openClassName: 'open',
  changeOnClick: true
}

export default Accordion;
