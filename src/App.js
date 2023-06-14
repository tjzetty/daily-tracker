import './App.css';

import MyTable from './components/calendar';
import Tasks from './components/tasks';

function App() {
  return (
    <div className="App">
      
      <header className="App-header">
        <div className="flex-container">
          <Tasks />
          <MyTable/>
        </div>
      </header>
    </div>
  );
}

export default App;
