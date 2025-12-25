export interface SubTask {
  text: string;
  done: boolean;
}

export interface Goal {
  id: number;
  text: string;
  type: string; // 'Realistic' | 'Stretch' | 'Bold'
  subTasks?: SubTask[];
}

export interface VisionData {
  // 🟢 NEW: These two fields were missing
  isGuest: boolean; 
  streak: number; 

  lifeStage: string;
  areas: string[];
  finalGoals: Goal[];
  visionStatement: string;
  answers?: Record<string, string>;
}

export interface VisionContextType {
  data: VisionData;
  updateData: <K extends keyof VisionData>(key: K, value: VisionData[K]) => void;
  toggleSubTask: (goalId: number, subTaskIndex: number) => void;
  toggleArea: (area: string) => void;
  getSuggestions: () => Goal[];
  addSubTask: (goalId: number, taskText: string) => void;
}