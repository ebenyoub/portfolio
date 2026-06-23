import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/project-detail/ProjectDetailPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/admin/AdminPage'
import CreateProjectPage from './pages/CreateProjectPage'
import EditProjectPage from './pages/EditProjectPage'
import ContactPage from './pages/ContactPage'
import AdminLayout from './components/AdminLayout'
import PrivateRoute from './components/PrivateRoute'

const UnderConstruction = ({ title }: { title: string }) => (
  <div className="bg-[#111111] border border-[#262626] rounded-xl p-10 text-center py-20">
    <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>{title}</h2>
    <p className="text-sm text-[#A1A1AA] font-mono">Module en cours de développement, aligné sur Figma Make.</p>
  </div>
);

function App() {

  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Admin Routes */}
        <Route element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/projects/new" element={<CreateProjectPage />} />
          <Route path="/admin/projects/:id/edit" element={<EditProjectPage />} />
          <Route path="/admin/parcours" element={<UnderConstruction title="Gestion du Parcours" />} />
          <Route path="/admin/competences" element={<UnderConstruction title="Gestion des Compétences" />} />
          <Route path="/admin/medias" element={<UnderConstruction title="Médiathèque" />} />
          <Route path="/admin/parametres" element={<UnderConstruction title="Paramètres" />} />
        </Route>
      </Routes>
  )
}

export default App
