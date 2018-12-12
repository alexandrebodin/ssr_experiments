import React from 'react';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      count: 0
    };
  }

  render() {
    const { count } = this.state;
    return (
      <div>
        <div>{count}</div>
        <button onClick={() => this.setState(s => ({ count: s.count + 1 }))}>Increment</button>
      </div>
    );
  }
}

export default App;
