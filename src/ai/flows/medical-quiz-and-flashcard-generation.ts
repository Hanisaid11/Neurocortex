'use server';
/**
 * @fileOverview A Genkit flow for generating medical quiz questions and flashcards.
 *
 * - generateMedicalQuizAndFlashcards - A function that handles the generation process.
 * - MedicalQuizAndFlashcardGenerationInput - The input type for the function.
 * - MedicalQuizAndFlashcardGenerationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicalQuizAndFlashcardGenerationInputSchema = z.object({
  topic: z.string().describe('The primary medical topic for the quiz and flashcards.'),
  chapters: z.array(z.string()).optional().describe('Specific chapters or sub-topics to focus on within the main topic.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium').describe('The difficulty level of the generated questions and flashcards.'),
  numberOfQuestions: z.number().int().min(1).max(20).default(5).describe('The number of multiple-choice questions to generate.'),
  numberOfFlashcards: z.number().int().min(1).max(20).default(5).describe('The number of flashcards to generate.'),
});
export type MedicalQuizAndFlashcardGenerationInput = z.infer<typeof MedicalQuizAndFlashcardGenerationInputSchema>;

const MedicalQuizAndFlashcardGenerationOutputSchema = z.object({
  multipleChoiceQuestions: z.array(
    z.object({
      question: z.string().describe('The multiple-choice question.'),
      options: z.array(z.string()).describe('An array of possible answers for the question.'),
      correctAnswer: z.string().describe('The correct answer from the options.'),
      explanation: z.string().optional().describe('An optional explanation for the correct answer.'),
    })
  ).describe('A list of generated multiple-choice questions.'),
  flashcards: z.array(
    z.object({
      front: z.string().describe('The front side of the flashcard (question or term).'),
      back: z.string().describe('The back side of the flashcard (answer or definition).'),
    })
  ).describe('A list of generated flashcards.'),
});
export type MedicalQuizAndFlashcardGenerationOutput = z.infer<typeof MedicalQuizAndFlashcardGenerationOutputSchema>;

export async function generateMedicalQuizAndFlashcards(
  input: MedicalQuizAndFlashcardGenerationInput
): Promise<MedicalQuizAndFlashcardGenerationOutput> {
  return medicalQuizAndFlashcardGenerationFlow(input);
}

const quizFlashcardPrompt = ai.definePrompt({
  name: 'quizFlashcardPrompt',
  input: { schema: MedicalQuizAndFlashcardGenerationInputSchema },
  output: { schema: MedicalQuizAndFlashcardGenerationOutputSchema },
  prompt: `You are an expert medical educator specializing in neurosurgery and neurology.

Generate {{numberOfQuestions}} board-style multiple-choice questions and {{numberOfFlashcards}} flashcards based on the following medical topic and chapters.

Ensure the content is accurate, relevant to board exams, and appropriate for a {{difficulty}} difficulty level.

Topic: {{{topic}}}
{{#if chapters}}Chapters/Sub-topics: {{{chapters.join ", "}}}{{/if}}

---

Instructions for Multiple-Choice Questions:
- Each question should have exactly 4 options (A, B, C, D).
- Clearly indicate the correct answer.
- Provide a concise explanation for the correct answer.

Instructions for Flashcards:
- Each flashcard should have a 'front' (question/term) and a 'back' (answer/definition).

Output in JSON format matching the provided schema, with questions under 'multipleChoiceQuestions' and flashcards under 'flashcards'.`,
});

const medicalQuizAndFlashcardGenerationFlow = ai.defineFlow(
  {
    name: 'medicalQuizAndFlashcardGenerationFlow',
    inputSchema: MedicalQuizAndFlashcardGenerationInputSchema,
    outputSchema: MedicalQuizAndFlashcardGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await quizFlashcardPrompt(input);
    return output!;
  }
);
