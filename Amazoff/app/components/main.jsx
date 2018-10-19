import React from 'react';

const logo = require('../../public/lucasoff.png');

const DEFAULT_HEIGHT = 50;

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      height: DEFAULT_HEIGHT,
      placeholder: 'Enter your Review',
      value: 'Enter your Review',
    };
  }

  componentDidMount() {
    this.mounted = true;

    this.setFilledTextareaHeight();
  }

  setFilledTextareaHeight() {
    if (this.mounted) {
      this.ghost.style.display = 'block';
      if (this.ghost.clientHeight > 0) {
        this.setState({
          height: this.ghost.clientHeight,
        });
      }

      this.ghost.style.display = 'none';
    }
  }

  setValue(event) {
    const { value } = event.target;

    this.setState({ value });
  }

  getExpandableField() {
    const isOneLine = this.state.height <= DEFAULT_HEIGHT;
    const { height, placeholder } = this.state;
    return (
      <textarea
        className="textarea main-fakereview-textarea mb20"
        name="textarea"
        id="textarea"
        autoFocus
        placeholder={placeholder}
        style={{
          height,
          resize: isOneLine ? 'none' : null
        }}
        onChange={(e) => this.setValue(e)}
        onKeyUp={() => this.setFilledTextareaHeight()}
      />
    );
  }

  getGhostField() {
    return (
      <div
        className="textarea textarea--ghost"
        ref={(c) => this.ghost = c}
        aria-hidden="true"
      >
        {this.state.value}
      </div>
    );
  }
  render() {
    return (
      <div className="hero-body">
        <div className="container has-text-centered main-title-container">
          <h1 className="title">
            <img src={logo} alt="Logo" />
          </h1>
          <h2 className="subtitle">
            This is the flagship app, demonstrating the power of the LUCAS API.
          </h2>
        </div>
        <div className="main-fakereview-container has-text-centered">
          {this.getExpandableField()}
          {this.getGhostField()}
          <a className="button is-link is-medium">
            <span>
              Submit Review
            </span>
            <span className="pl10"><i className="fas fa-arrow-circle-right"></i></span>
          </a>
        </div>
      </div>
    );
  }
}

export default Main;

