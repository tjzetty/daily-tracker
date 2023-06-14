import './App.css';

import MyTable from './components/calendar';

function App() {
  return (
    <div className="App">
      
      <header className="App-header">
        <div className="flex-container">
          <MyTable/>
        </div>
      </header>
    </div>
  );
}

export default App;
