import { Component } from 'react';
import TaskManager from './components/TaskManager';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <TaskManager />
      </div>
    );
  }
}

export default App;
