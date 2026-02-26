import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom mb-4">
          <div className="container">
            <Link className="navbar-brand fw-semibold d-flex align-items-center gap-2" to="/">
              <img src="/octofit-logo.png" alt="Octofit logo" className="app-logo" />
              <span>Octofit Tracker</span>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              aria-expanded={isNavOpen}
              aria-label="Toggle navigation"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`}>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item"><Link className="nav-link" to="/activities">Activities</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/leaderboard">Leaderboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/teams">Teams</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/users">Users</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/workouts">Workouts</Link></li>
              </ul>
              <a className="btn btn-outline-primary btn-sm" href="https://getbootstrap.com/docs/5.3/getting-started/introduction/" target="_blank" rel="noreferrer">Bootstrap Docs</a>
            </div>
          </div>
        </nav>
        <div className="container app-main">
          <Routes>
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route
              path="/"
              element={(
                <div className="card page-card">
                  <div className="card-body text-start">
                    <h1 className="h2 mb-3">Welcome to Octofit Tracker</h1>
                    <p className="lead mb-3">Track team activities, monitor leaderboard progress, and discover recommended workouts.</p>
                    <div className="d-flex flex-wrap gap-2">
                      <Link className="btn btn-primary" to="/activities">View Activities</Link>
                      <Link className="btn btn-outline-secondary" to="/leaderboard">Open Leaderboard</Link>
                    </div>
                  </div>
                </div>
              )}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
