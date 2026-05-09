'use client'

import React, { createContext, useContext, useRef } from 'react';
import { createStore, useStore } from 'zustand';
import { Project } from '../types';

/**
 * Project State Interface
 */
interface ProjectProps {
  projects: Project[];
  activeProject: Project | null;
  isLoading: boolean;
}

interface ProjectState extends ProjectProps {
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  setActiveProject: (projectId: string) => void;
  clearActiveProject: () => void;
}

type ProjectStore = ReturnType<typeof createProjectStore>;

/**
 * Create the actual Zustand store logic for Projects
 * SECURITY NOTE: The UI state respects workspace/project isolation logic, 
 * but the backend database MUST enforce RLS checking `auth.uid() = user_id`.
 */
const createProjectStore = (initProps?: Partial<ProjectProps>) => {
  const DEFAULT_PROPS: ProjectProps = {
    projects: [],
    activeProject: null,
    isLoading: false,
  };

  return createStore<ProjectState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    
    // Completely overwrite projects list (e.g. on initial data fetch)
    setProjects: (projects: Project[]) => set({ projects }),
    
    // Add a single created project and make it active
    addProject: (project: Project) => set((state) => ({ 
      projects: [...state.projects, project],
      activeProject: project 
    })),
    
    // Switch between existing projects
    setActiveProject: (projectId: string) => set((state) => ({
      activeProject: state.projects.find((p) => p.id === projectId) || null
    })),
    
    // Used when leaving project screen or logging out
    clearActiveProject: () => set({ activeProject: null }),
  }));
};

/**
 * React Context for dependency injection
 */
const ProjectContext = createContext<ProjectStore | null>(null);

/**
 * Provider Component to isolate store instance per request
 */
export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ProjectStore>();

  if (!storeRef.current) {
    storeRef.current = createProjectStore();
  }

  return (
    <ProjectContext.Provider value={storeRef.current}>
      {children}
    </ProjectContext.Provider>
  );
}

/**
 * Custom hook to consume the Project Context
 */
export function useProjectContext<T>(selector: (state: ProjectState) => T): T {
  const store = useContext(ProjectContext);
  if (!store) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return useStore(store, selector);
}
