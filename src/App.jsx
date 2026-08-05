import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './screens/Welcome.jsx'
import Quiz from './screens/Quiz.jsx'
import Plan from './screens/Plan.jsx'
import AppShell from './components/AppShell.jsx'
import Home from './screens/Home.jsx'
import Tracker from './screens/Tracker.jsx'
import Sos from './screens/Sos.jsx'
import Coach from './screens/Coach.jsx'
import Journal from './screens/Journal.jsx'
import Library from './screens/Library.jsx'
import Community from './screens/Community.jsx'
import Profile from './screens/Profile.jsx'
import Premium from './screens/Premium.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/premium" element={<Premium />} />

        <Route element={<AppShell />}>
          <Route path="/home" element={<Home />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/sos" element={<Sos />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/library" element={<Library />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profil" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
