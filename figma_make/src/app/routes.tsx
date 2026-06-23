import { createBrowserRouter, Navigate } from "react-router";
import AdminLayout from "./layouts/AdminLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectFormPage from "./pages/ProjectFormPage";
import CareerPage from "./pages/CareerPage";
import SkillsPage from "./pages/SkillsPage";
import SettingsPage from "./pages/SettingsPage";
import MediaPage from "./pages/MediaPage";
import PublicPortfolio from "./pages/PublicPortfolio";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicPortfolio />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "projects/new", element: <ProjectFormPage /> },
      { path: "projects/:id/edit", element: <ProjectFormPage /> },
      { path: "career", element: <CareerPage /> },
      { path: "skills", element: <SkillsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "media", element: <MediaPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
