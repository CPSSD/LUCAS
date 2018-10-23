import React from 'react';

const logo = require('../../public/lucasoff.png');

const DEFAULT_HEIGHT = 50;

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      height: DEFAULT_HEIGHT,
      placeholder: 'Enter your Review',
      value: null,
    };
  }

  componentDidUpdate() {
    this.setFilledTextareaHeight();
  }

  setFilledTextareaHeight() {
    this.ghost.className = 'textarea textarea--ghost display-block';
    if (this.ghost.clientHeight > 0 && this.state.height !== this.ghost.clientHeight) {
      this.setState({
        height: this.ghost.clientHeight,
      });
    }

    this.ghost.className = 'textarea textarea--ghost display-none';
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
      />
    );
  }

  getGhostField() {
    return (
      <div
        className="textarea textarea--ghost display-block"
        ref={(c) => this.ghost = c}
        aria-hidden="true"
      >
        {`${this.state.value} \u200b`}
      </div>
    );
  }

  sendRequest() {
    fetch('/api/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        review: this.state.value
      })
    })
      .then((res) => res.json())
      .then((result) => {
        this.setState({ accuracy: result.class_probs[0], result: result.result});
      });
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
          <button className="button is-link is-medium" onClick={() => this.sendRequest()}>
            <span>
              Submit Review
            </span>
            <span className="pl10"><i className="fas fa-arrow-circle-right"></i></span>
          </button>
          {this.getGhostField()}
        </div>
        <div>{this.state.accuracy} and result {this.state.result}</div>
      </div>
    );
  }
}

export default Main;

