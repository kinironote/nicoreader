import React, { Component } from 'react';
import Header from './components/header.js';
import Body from './components/body.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <link href="https://fonts.googleapis.com/css?family=PT+Sans" rel="stylesheet"></link>
        <Header />
        <Body />
      </div>
    );
  }
}

export default App;