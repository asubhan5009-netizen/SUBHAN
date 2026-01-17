
export enum ToolType {
  STUDY = 'STUDY',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  sources?: any[];
}

export interface GeneratedAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: number;
}