export interface SimpleWritingTask {
  type: "SIMPLE";
  prompt: string;
}

export interface ChartWritingTask {
  type: "CHART";
  prompt: string;
  chartData: object | null;
}

export type AIGeneratedTask = SimpleWritingTask | ChartWritingTask;
