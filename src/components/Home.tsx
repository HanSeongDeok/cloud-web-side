import { memo, useState } from 'react'
import reactLogo from '@assets/react.svg'
import viteLogo from '/vite.svg'
import { NavLink } from 'react-router-dom';

const Home = memo(() => {
  const [count, setCount] = useState(0)
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      {/* 로고 컨테이너 */}
      <div className="flex items-center justify-center space-x-8 mb-8">
        <a 
          href="https://vite.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group transition-transform duration-300 hover:scale-110"
        >
          <img 
            src={viteLogo} 
            className="h-24 w-24 drop-shadow-lg transition-all duration-300 group-hover:drop-shadow-2xl" 
            alt="Vite logo" 
          />
        </a>
        <a 
          href="https://react.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group transition-transform duration-300 hover:scale-110"
        >
          <img 
            src={reactLogo} 
            className="h-24 w-24 drop-shadow-lg transition-all duration-300 group-hover:drop-shadow-2xl animate-spin-slow" 
            alt="React logo" 
          />
        </a>
      </div>

      {/* 메인 제목 */}
      <h1 className="text-5xl font-extrabold tracking-wide mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
        Vite + React
      </h1>

      {/* 카드 컨테이너 */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button 
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
          
          <NavLink to="/login">
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95">
              Login
            </button>
          </NavLink>
          
          <NavLink to="/storage">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95">
              VTDM
            </button>
          </NavLink>
        </div>
      </div>

      {/* 서브 제목 */}
      <p className="text-3xl font-extrabold tracking-wide mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
        TEST HOME
      </p>
      
      {/* 설명 텍스트 */}
      <p className="text-lg italic text-gray-300 text-center max-w-md hover:text-white transition-colors duration-300">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
});

export default Home;