'use server';
/**
 * @fileOverview This file implements a Genkit flow for the Smart Medical Literature Search,
 * acting as a Retrieval-Augmented Generation (RAG) system for neurological questions.
 *
 * - smartMedicalLiteratureSearch - A function to query the simulated medical literature library.
 * - SmartMedicalLiteratureSearchInput - The input type for the smartMedicalLiteratureSearch function.
 * - SmartMedicalLiteratureSearchOutput - The return type for the smartMedicalLiteratureSearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SmartMedicalLiteratureSearchInputSchema = z.object({
  question: z.string().describe('The natural language question about neurological conditions or procedures.'),
});
export type SmartMedicalLiteratureSearchInput = z.infer<typeof SmartMedicalLiteratureSearchInputSchema>;

const SmartMedicalLiteratureSearchOutputSchema = z.object({
  answer: z.string().describe('The concise, evidence-based answer to the question, as if retrieved from medical literature.'),
  citations: z.array(z.string()).describe('A list of simulated citations from medical textbooks or journals that support the answer.'),
});
export type SmartMedicalLiteratureSearchOutput = z.infer<typeof SmartMedicalLiteratureSearchOutputSchema>;

export async function smartMedicalLiteratureSearch(input: SmartMedicalLiteratureSearchInput): Promise<SmartMedicalLiteratureSearchOutput> {
  return smartMedicalLiteratureSearchFlow(input);
}

const smartMedicalLiteratureSearchPrompt = ai.definePrompt({
  name: 'smartMedicalLiteratureSearchPrompt',
  input: { schema: SmartMedicalLiteratureSearchInputSchema },
  output: { schema: SmartMedicalLiteratureSearchOutputSchema },
  prompt: `You are an expert neurosurgeon and AI assistant, tasked with providing concise, evidence-based answers to natural language questions about neurological conditions or procedures.
You have access to a massive, indexed library of over 20 core neurosurgery textbooks, journals, and clinical guidelines.
When answering, strictly pull information from this hypothetical medical literature base.
Your answer must be highly accurate, clinically relevant, and directly address the user's question.
For each answer, you MUST provide at least 2-3 simulated citations to medical textbooks, journals, or guidelines to support the information. These citations should look realistic but can be fictional, as you are simulating a RAG system.

Question: {{{question}}}`,
});

const smartMedicalLiteratureSearchFlow = ai.defineFlow(
  {
    name: 'smartMedicalLiteratureSearchFlow',
    inputSchema: SmartMedicalLiteratureSearchInputSchema,
    outputSchema: SmartMedicalLiteratureSearchOutputSchema,
  },
  async (input) => {
    const { output } = await smartMedicalLiteratureSearchPrompt(input);
    return output!;
  }
);
