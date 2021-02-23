export interface State {
  data: Task[];
  [index: string]: Task[];
}

export interface Task {
  name: string;
  isAllDone: boolean;
  task: SubTask[];
}

export interface SubTask {
  name: string;
  idDone: boolean;
}

/**
|--------------------------------------------------
| ACTION TYPE
|--------------------------------------------------
*/
export type ActionType =
  | { type: 'createTask'; payload: Task }
  | { type: 'duplicate'; payload: number }
  | { type: 'delete'; payload: number }
  | { type: 'addsubtask'; payload: { index: number; value: string } };
