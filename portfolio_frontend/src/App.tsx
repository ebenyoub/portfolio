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
import PrivateRoute from './components/PrivateRoute'

function App() {

  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
        <Route path="/admin/projects/new" element={<PrivateRoute><CreateProjectPage /></PrivateRoute>} />
        <Route path="/admin/projects/:id/edit" element={<PrivateRoute><EditProjectPage /></PrivateRoute>} />
      </Routes>
  )
}

export default App
