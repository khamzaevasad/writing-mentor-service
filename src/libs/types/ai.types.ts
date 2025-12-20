export interface SimpleWritingTask {
  type: "SIMPLE";
  prompt: string;
}

export interface ChartWritingTask {
  type: "CHART";
  prompt: string;
  chartData: object | null;
}

// export type AIGeneratedTask = SimpleWritingTask | ChartWritingTask;

export type AIGeneratedTask =
  | {
      type: "CHART";
      prompt: string;
      chartData: {
        type: "bar" | "line" | "pie";
        title: string;
        data: Record<string, any>;
      };
    }
  | {
      type: "SIMPLE";
      prompt: string;
    };
