import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VisionData, Goal } from '../types/vision';
import { saveVisionToBackend, fetchVisionFromBackend } from '../lib/api'; // <--- IMPORTED FETCH

// Define the Interface for the Context
interface VisionContextType {
  data: VisionData;
  updateData: <K extends keyof VisionData>(field: K, value: VisionData[K]) => void;
  toggleArea: (area: string) => void;
  getSuggestions: () => Goal[];
  addSubTask: (goalId: number, taskText: string) => void;
  toggleSubTask: (goalId: number, taskIndex: number) => void;
  save: () => Promise<void>;
  saveWithData: (overrides: Partial<VisionData>) => Promise<void>; // <--- ATOMIC SAVE
  refresh: () => Promise<void>;
}

const VisionContext = createContext<VisionContextType | undefined>(undefined);

export function VisionProvider({ children }: { children: ReactNode }) {
  // Initialize State
  const [data, setData] = useState<VisionData>(() => {
    const saved = localStorage.getItem('visionData');
    return saved ? JSON.parse(saved) : {
      userId: "local-user",
      isGuest: true,
      lifeStage: '',
      streak: 5,
      areas: [],
      visionStatement: '',
      finalGoals: [
        {
          id: 1,
          text: "Launch MVP in 30 Days",
          type: "Realistic",
          subTasks: [
            { text: "Design Database Schema", done: true },
            { text: "Build React Frontend", done: false }
          ]
        }
      ]
    };
  });

  // Persistence (Local Storage)
  useEffect(() => {
    localStorage.setItem('visionData', JSON.stringify(data));
  }, [data]);

  // --- NEW: LOAD DATA FROM BACKEND ON STARTUP ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      refresh(); // If user is logged in, fetch their data immediately
    }
  }, []);

  // --- ACTIONS ---

  // NEW: REFRESH FUNCTION (Call this after Login!)
  const refresh = async () => {
    try {
      console.log("Fetching data from backend...");
      const cloudData = await fetchVisionFromBackend();

      if (cloudData) {
        // Update state with the data from the cloud
        setData(cloudData);
        console.log("Sync complete: Loaded data for", cloudData.userId);
      }
    } catch (error) {
      console.error("Sync failed:", error);
      // We don't throw here to avoid breaking the UI on load errors
    }
  };

  const updateData = <K extends keyof VisionData>(field: K, value: VisionData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArea = (area: string) => {
    setData(prev => {
      const exists = prev.areas.includes(area);
      return {
        ...prev,
        areas: exists ? prev.areas.filter(a => a !== area) : [...prev.areas, area]
      };
    });
  };

  const getSuggestions = (): Goal[] => {
    const suggestions: Goal[] = [];
    if (data.areas.includes('Career')) suggestions.push({ id: 101, text: "Complete 2 Portfolio Projects", type: "Realistic", subTasks: [] });
    if (data.areas.includes('Income')) suggestions.push({ id: 102, text: "Reach ₹50k Monthly Income", type: "Stretch", subTasks: [] });
    if (data.areas.includes('Health')) suggestions.push({ id: 103, text: "Workout 4x per Week", type: "Realistic", subTasks: [] });
    if (suggestions.length === 0) suggestions.push({ id: 999, text: "Plan your first week", type: "Realistic", subTasks: [] });
    return suggestions;
  };

  const addSubTask = (goalId: number, taskText: string) => {
    const newGoals = data.finalGoals.map(goal => {
      if (goal.id === goalId) {
        return { ...goal, subTasks: [...(goal.subTasks || []), { text: taskText, done: false }] };
      }
      return goal;
    });
    setData(prev => ({ ...prev, finalGoals: newGoals }));
  };

  const toggleSubTask = (goalId: number, taskIndex: number) => {
    const newGoals = data.finalGoals.map(goal => {
      if (goal.id === goalId) {
        const newTasks = [...goal.subTasks];
        newTasks[taskIndex].done = !newTasks[taskIndex].done;
        return { ...goal, subTasks: newTasks };
      }
      return goal;
    });
    setData(prev => ({ ...prev, finalGoals: newGoals }));
  };

  const save = async () => {
    await saveWithData({});
  };

  // ATOMIC SAVE: Merges new data, updates state, and saves to backend in one go
  const saveWithData = async (overrides: Partial<VisionData>) => {
    try {
      const newData = { ...data, ...overrides };
      setData(newData); // Optimistic UI update

      console.log("Saving to backend...", newData);
      await saveVisionToBackend(newData);
      console.log("Save complete!");
    } catch (error) {
      console.error("Failed to save vision:", error);
      throw error;
    }
  };

  return (
    <VisionContext.Provider value={{
      data, updateData, toggleArea, getSuggestions, addSubTask, toggleSubTask, save, saveWithData, refresh
    }}>
      {children}
    </VisionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useVision() {
  const context = useContext(VisionContext);
  if (context === undefined) throw new Error('useVision must be used within a VisionProvider');
  return context;
}