// src/types/vision.ts

export interface SubTask {
  text: string;
  done: boolean;
}

export interface Goal {
  id: number;
  text: string;
  type: string;
  subTasks: SubTask[];
}

// 🟢 FIX: We explicitly add 'userId' here. 
// Now TypeScript knows it exists, so we don't need 'any'.
export interface VisionData {
  userId: string;       
  isGuest?: boolean;
  visionStatement: string;
  areas: string[];
  finalGoals: Goal[];
  streak?: number;
  lifeStage?: string;
}