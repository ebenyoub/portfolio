import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/project-detail/ProjectDetailPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/admin/AdminPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminParcoursPage from './pages/admin/AdminParcoursPage'
import AdminCompetencesPage from './pages/admin/AdminCompetencesPage'
import AdminMediasPage from './pages/admin/AdminMediasPage'
import AdminParametresPage from './pages/admin/AdminParametresPage'
import CreateProjectPage from './pages/CreateProjectPage'
import EditProjectPage from './pages/EditProjectPage'
import AdminLayout from './components/AdminLayout'
import PrivateRoute from './components/PrivateRoute'

function App() {

  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Admin Routes */}
        <Route element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/projects" element={<AdminPage />} />
          <Route path="/admin/projects/new" element={<CreateProjectPage />} />
          <Route path="/admin/projects/:id/edit" element={<EditProjectPage />} />
          <Route path="/admin/parcours" element={<AdminParcoursPage />} />
          <Route path="/admin/competences" element={<AdminCompetencesPage />} />
          <Route path="/admin/medias" element={<AdminMediasPage />} />
          <Route path="/admin/parametres" element={<AdminParametresPage />} />
        </Route>
      </Routes>
  )
}

export default App
