// Backup of current App.jsx
import React from 'react';
import WildflowerDatabase from './components/WildflowerDatabase.jsx';
import TestComponent from './components/TestComponent.jsx';
import './App.css';

function App() {
  console.log('🎨 App component rendering');
  return (
    <div className="App">
      <WildflowerDatabase />
    </div>
  );
}

export default App;