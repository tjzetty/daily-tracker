import React, { useState } from 'react';

import './App.css';

import Calendar from './components/calendar';
import Tasks from './components/tasks';


function App() {
  const [tasks, setTasks] = useState([]);

  return (
    <div className="App">
      
      <header className="App-header">
        <div className="flex-container">
          <Tasks tasks={tasks} setTasks={setTasks} />
          <Calendar tasks={tasks} />
        </div>
      </header>
    </div>
  );
}

export default App;
