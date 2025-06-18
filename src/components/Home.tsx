import { memo, useState } from 'react'
import "@styles/Home.css";
import reactLogo from '@assets/react.svg'
import viteLogo from '/vite.svg'
import { NavLink } from 'react-router-dom';

const Home = memo(() => {
  const [count, setCount] = useState(0)
  return (
    <div className="homeContainer">
      <div className="logoContainer">
        <a href="https://vite.dev" target="_blank" rel="noopener">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button className="btn" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <NavLink to="/prototype">
          <button className="btn">Prototype</button>
        </NavLink>
      </div>
      <p className="testTitle">
          TEST HOME
        </p>
      <p className="description">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
});

export default Home;