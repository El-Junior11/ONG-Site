import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import APropos from './pages/APropos';
import NosActivites from './components/NosActivites';
import InterventionsPubliees from './pages/InterventionsPubliees';
import Realisations from './pages/Realisations';
import Contact from './pages/Contact';
import InterventionList from './pages/InterventionList';
import Login from './Login';
import Dashboard from './Dashboard';
import Parametres from './pages/Parametres';

function PublicHome() {
  return (
    <div className="w-full overflow-x-clip">
      <section id="accueil"><HomePage/></section>
      <section id="apropos"><APropos/></section>
      <section id="activites"><NosActivites/></section>
      <section id="interventions"><InterventionsPubliees/></section>
      <section id="realisations"><Realisations/></section>
      <section id="contact"><Contact/></section>
    </div>
  );
}

function AppContent() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper)] font-sans text-[var(--ink)] antialiased">
      <Navbar/>

      <main className={`w-full min-w-0 flex-1 ${isHome ? '' : 'pt-[76px]'}`}>
        <Routes>
          {/* Site public */}
          <Route path="/" element={<PublicHome/>}/>

          {/* Administration */}
          <Route path="/login" element={<Login/>}/>
          <Route path="/dashboard/:id?" element={<Dashboard/>}/>
          <Route path="/interventions-list" element={<InterventionList/>}/>
          <Route path="/settings" element={<Parametres/>}/>

          {/* Redirections */}
          <Route path="/a-propos" element={<Navigate to="/#apropos" replace/>}/>
          <Route path="/interventions-publiees" element={<Navigate to="/#interventions" replace/>}/>
          <Route path="/realisations" element={<Navigate to="/#realisations" replace/>}/>
          <Route path="/contact" element={<Navigate to="/#contact" replace/>}/>
          <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
      </main>

      <Footer/>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent/>
    </Router>
  );
}