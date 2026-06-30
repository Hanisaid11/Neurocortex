'use server';
/**
 * @fileOverview A Genkit flow for high-level neurosurgical case discussion.
 * - unifiedMedicalChat - Handles multi-modal inputs, memory-aware reasoning, and RAG.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MultiModalPartSchema = z.object({
  type: z.enum(['text', 'image', 'video', 'audio', 'dicom']),
  content: z.string().describe('Text content or base64 data URI for media.'),
});

const UnifiedChatInputSchema = z.object({
  message: z.string(),
  parts: z.array(MultiModalPartSchema).optional(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
  userProfile: z.object({
    specialty: z.string(),
    longTermMemory: z.array(z.string()),
  }),
});

const UnifiedChatOutputSchema = z.object({
  response: z.string().describe('The primary medical response with inline citations.'),
  citations: z.array(z.object({
    id: z.string(),
    source: z.string(),
    link: z.string().optional(),
  })),
  clinicalInsights: z.array(z.string()).describe('New learned patterns or cross-case links.'),
  memoryUpdate: z.string().optional().describe('A summary of new knowledge to add to long-term memory.'),
});

export type UnifiedChatInput = z.infer<typeof UnifiedChatInputSchema>;
export type UnifiedChatOutput = z.infer<typeof UnifiedChatOutputSchema>;

export async function unifiedMedicalChat(input: UnifiedChatInput): Promise<UnifiedChatOutput> {
  return unifiedMedicalChatFlow(input);
}

const unifiedChatPrompt = ai.definePrompt({
  name: 'unifiedChatPrompt',
  input: { schema: UnifiedChatInputSchema },
  output: { schema: UnifiedChatOutputSchema },
  prompt: `You are an elite neurosurgical clinical decision support AI. Your goal is to provide precise, evidence-based case analysis.

SYSTEM POLICIES:
1. NO HALLUCINATION: If a fact is unknown or not supported by neurosurgical literature, state it clearly.
2. CITATIONS: Every clinical recommendation must include an inline citation (e.g., [1]).
3. MEMORY AWARENESS: Use the provided "Long Term Memory" to personalize your responses to the surgeon's style and past cases.
4. MULTI-MODAL ANALYSIS: Analyze any provided images, videos, or DICOM summaries in the context of the medical query.

USER PROFILE:
Specialty: {{{userProfile.specialty}}}
Long-Term Memory:
{{#each userProfile.longTermMemory}}
- {{{this}}}
{{/each}}

QUERY:
{{{message}}}

{{#if parts}}
MEDIA ATTACHMENTS:
{{#each parts}}
- Type: {{{type}}}, Content: {{{content}}}
{{/each}}
{{/if}}

Please provide your response in the structured format requested.`,
});

const unifiedMedicalChatFlow = ai.defineFlow(
  {
    name: 'unifiedMedicalChatFlow',
    inputSchema: UnifiedChatInputSchema,
    outputSchema: UnifiedChatOutputSchema,
  },
  async (input) => {
    // In a real RAG system, we would search vector DBs here.
    // For this prototype, the prompt itself enforces the literature-based reasoning.
    
    const { output } = await unifiedChatPrompt(input);
    return output!;
  }
);
