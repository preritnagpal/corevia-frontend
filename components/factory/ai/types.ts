export type ChatMessage = {
  role: "user" | "ai";
  text: string;
  time: string;        // display time
  createdAt: string;   // ISO string (for Today / Yesterday)
};
