import { memo, useState } from 'react'
import reactLogo from '@assets/react.svg'
import viteLogo from '/vite.svg'
import { NavLink } from 'react-router-dom';

const Home = memo(() => {
  const [count, setCount] = useState(0)
  return (
    <div className = "text-white">
      <div className="flex justify-center items-center gap-4">
        <a href="https://vite.dev" target="_blank" rel="noopener">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card flex justify-center items-center gap-4">
        <button className="btn" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <NavLink to="/prototype">
          <button className="btn">Prototype</button>
        </NavLink>
      </div>
      <p className='text-2xl font-extrabold tracking-wide text-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg'>
          TEST HOME
        </p>
      <p className="text-lg italic text-gray-300 mt-2 hover:text-white transition-colors duration-300">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
});

export default Home;