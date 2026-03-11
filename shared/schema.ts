import { z } from "zod";

export const quizSchema = z.object({
  id: z.number(),
  question: z.string(),
  options: z.array(z.string()),
  correct: z.number(),
  type: z.enum(["base", "intermedio", "business", "marina"]),
});

export const quizResultSchema = z.object({
  studentName: z.string(),
  quizType: z.string(),
  score: z.number(),
  total: z.number(),
  correct: z.number(),
  timestamp: z.number(),
});

export const contactMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  course: z.string(),
  message: z.string().min(1),
});

export type Quiz = z.infer<typeof quizSchema>;
export type QuizResult = z.infer<typeof quizResultSchema>;
export type ContactMessage = z.infer<typeof contactMessageSchema>;
