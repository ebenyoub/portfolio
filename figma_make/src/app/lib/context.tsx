import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Project, CareerItem, Skill, SiteSettings, ActivityItem, MediaItem } from "./types";
import {
  INITIAL_PROJECTS,
  INITIAL_CAREER,
  INITIAL_SKILLS,
  INITIAL_SETTINGS,
  INITIAL_ACTIVITY,
  INITIAL_MEDIA,
} from "./mockData";

interface AppContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  projects: Project[];
  addProject: (p: Omit<Project, "id" | "updatedAt">) => void;
  updateProject: (p: Project) => void;
  deleteProject: (id: string) => void;
  career: CareerItem[];
  addCareer: (c: Omit<CareerItem, "id">) => void;
  updateCareer: (c: CareerItem) => void;
  deleteCareer: (id: string) => void;
  skills: Skill[];
  addSkill: (s: Omit<Skill, "id">) => void;
  deleteSkill: (id: string) => void;
  settings: SiteSettings;
  updateSettings: (s: SiteSettings) => void;
  activity: ActivityItem[];
  media: MediaItem[];
  addMedia: (m: Omit<MediaItem, "id">) => void;
  deleteMedia: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function today() {
  return new Date().toISOString().split("T")[0];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("eb_admin_auth") === "1"
  );
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [career, setCareer] = useState<CareerItem[]>(INITIAL_CAREER);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [activity, setActivity] = useState<ActivityItem[]>(INITIAL_ACTIVITY);
  const [media, setMedia] = useState<MediaItem[]>(INITIAL_MEDIA);

  const pushActivity = useCallback((label: string, type: ActivityItem["type"]) => {
    setActivity((prev) => [
      { id: genId(), type, label, timestamp: "À l'instant" },
      ...prev.slice(0, 9),
    ]);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 900));
    if (email === "elyas@admin.fr" && password === "admin") {
      localStorage.setItem("eb_admin_auth", "1");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("eb_admin_auth");
    setIsAuthenticated(false);
  }, []);

  const addProject = useCallback(
    (p: Omit<Project, "id" | "updatedAt">) => {
      const np: Project = { ...p, id: genId(), updatedAt: today() };
      setProjects((prev) => [np, ...prev]);
      pushActivity(`${p.title} ajouté`, "project_added");
    },
    [pushActivity]
  );

  const updateProject = useCallback(
    (p: Project) => {
      setProjects((prev) =>
        prev.map((x) => (x.id === p.id ? { ...p, updatedAt: today() } : x))
      );
      pushActivity(`${p.title} mis à jour`, "project_updated");
    },
    [pushActivity]
  );

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addCareer = useCallback(
    (c: Omit<CareerItem, "id">) => {
      setCareer((prev) => [...prev, { ...c, id: genId() }]);
      pushActivity(`${c.title} ajouté au parcours`, "career_updated");
    },
    [pushActivity]
  );

  const updateCareer = useCallback(
    (c: CareerItem) => {
      setCareer((prev) => prev.map((x) => (x.id === c.id ? c : x)));
      pushActivity(`${c.title} mis à jour`, "career_updated");
    },
    [pushActivity]
  );

  const deleteCareer = useCallback((id: string) => {
    setCareer((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addSkill = useCallback(
    (s: Omit<Skill, "id">) => {
      setSkills((prev) => [...prev, { ...s, id: genId() }]);
      pushActivity(`${s.name} ajouté aux compétences`, "skill_added");
    },
    [pushActivity]
  );

  const deleteSkill = useCallback((id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateSettings = useCallback(
    (s: SiteSettings) => {
      setSettings(s);
      pushActivity("Paramètres du site mis à jour", "settings_updated");
    },
    [pushActivity]
  );

  const addMedia = useCallback((m: Omit<MediaItem, "id">) => {
    setMedia((prev) => [{ ...m, id: genId() }, ...prev]);
  }, []);

  const deleteMedia = useCallback((id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        projects,
        addProject,
        updateProject,
        deleteProject,
        career,
        addCareer,
        updateCareer,
        deleteCareer,
        skills,
        addSkill,
        deleteSkill,
        settings,
        updateSettings,
        activity,
        media,
        addMedia,
        deleteMedia,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
