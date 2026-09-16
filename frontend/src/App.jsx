import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Analyze from './pages/Analyze'
import Results from './pages/Results'
import History from './pages/History'
import Settings from './pages/Settings'
import About from './pages/About'
import Help from './pages/Help'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="h-screen flex flex-col">
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-surface dark:bg-navy-950">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analyze" element={<Analyze />} />
                <Route path="/results" element={<Results />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<Help />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}