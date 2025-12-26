import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VisionData, Goal } from '../types/vision'; 
import { saveVisionToBackend } from '../lib/api'; // <--- IMPORT API HELPER

// Define the Interface for the Context
interface VisionContextType {
  data: VisionData;
  updateData: <K extends keyof VisionData>(field: K, value: VisionData[K]) => void;
  toggleArea: (area: string) => void;
  getSuggestions: () => Goal[];
  addSubTask: (goalId: number, taskText: string) => void;
  toggleSubTask: (goalId: number, taskIndex: number) => void;
  save: () => Promise<void>; // <--- NEW SAVE FUNCTION TYPE
}

const VisionContext = createContext<VisionContextType | undefined>(undefined);

export function VisionProvider({ children }: { children: ReactNode }) {
  // Initialize State
  const [data, setData] = useState<VisionData>(() => {
    const saved = localStorage.getItem('visionData');
    return saved ? JSON.parse(saved) : {
      userId: "local-user", // <--- ENSURE USERID EXISTS FOR BACKEND
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

  // --- ACTIONS ---

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
    if(suggestions.length === 0) suggestions.push({ id: 999, text: "Plan your first week", type: "Realistic", subTasks: [] });
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

  // --- NEW: SAVE TO BACKEND FUNCTION ---
  const save = async () => {
    try {
      console.log("Saving to backend...", data);
      await saveVisionToBackend(data);
      console.log("Save complete!");
    } catch (error) {
      console.error("Failed to save vision:", error);
      throw error; // Re-throw so the UI component knows it failed
    }
  };

  return (
    <VisionContext.Provider value={{ 
      data, updateData, toggleArea, getSuggestions, addSubTask, toggleSubTask, save 
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