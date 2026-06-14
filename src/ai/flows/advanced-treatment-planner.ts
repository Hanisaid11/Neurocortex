'use server';
/**
 * @fileOverview A Genkit flow for the "History-to-Protocol" Clinical Simulator.
 * Synthesizes multi-layered management frameworks based on complex patient history.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AdvancedTreatmentPlannerInputSchema = z.object({
  history: z.string().describe('The primary medical and surgical history.'),
  complaints: z.string().describe('Current subjective complaints and symptoms.'),
  age: z.number().int().describe('Patient age.'),
  sex: z.enum(['male', 'female', 'other']).describe('Patient biological sex.'),
});
export type AdvancedTreatmentPlannerInput = z.infer<typeof AdvancedTreatmentPlannerInputSchema>;

const ManagementPathwaySchema = z.object({
  title: z.string().describe('The name of the management strategy (e.g., Option A: Conservative).'),
  strategy: z.string().describe('Detailed surgical or clinical strategy.'),
  pharmacology: z.array(z.object({
    drug: z.string().describe('Drug name.'),
    dosage: z.string().describe('Exact dosage.'),
    duration: z.string().describe('Duration of use.'),
    rationale: z.string().describe('Reason for this specific choice in this case.'),
  })),
  followUp: z.string().describe('Long-term clinical follow-up protocol.'),
});

const AdvancedTreatmentPlannerOutputSchema = z.object({
  clinicalSummary: z.string().describe('A brief AI-synthesized summary of the patient profile.'),
  pathways: z.array(ManagementPathwaySchema).describe('Multi-layered clinical pathways.'),
  evidenceBase: z.array(z.string()).describe('Authoritative neurosurgical literature or guidelines referenced.'),
});
export type AdvancedTreatmentPlannerOutput = z.infer<typeof AdvancedTreatmentPlannerOutputSchema>;

export async function advancedTreatmentPlanner(input: AdvancedTreatmentPlannerInput): Promise<AdvancedTreatmentPlannerOutput> {
  return advancedTreatmentPlannerFlow(input);
}

const plannerPrompt = ai.definePrompt({
  name: 'advancedTreatmentPlannerPrompt',
  input: { schema: AdvancedTreatmentPlannerInputSchema },
  output: { schema: AdvancedTreatmentPlannerOutputSchema },
  prompt: `You are an elite neurosurgical consultant AI. You are presented with a complex clinical case:

PATIENT PROFILE:
Age: {{{age}}}
Sex: {{{sex}}}
Subjective Complaints: {{{complaints}}}
Medical/Surgical History: {{{history}}}

TASK:
Synthesize a comprehensive, multi-layered management framework. Provide at least three distinct clinical pathways (e.g., Conservative, Aggressive Surgical, Adjuvant/Hybrid).
Each pathway must include a detailed pharmacological schedule, itemizing exact dosages and durations, cross-referencing standard neuro-critical care medications.
Append a "References" section citing authoritative neurosurgical journals (e.g., JNS, Neurosurgery) or textbooks (e.g., Youmans).

Be precise, clinical, and evidence-based. Avoid conversational fillers.`,
});

const advancedTreatmentPlannerFlow = ai.defineFlow(
  {
    name: 'advancedTreatmentPlannerFlow',
    inputSchema: AdvancedTreatmentPlannerInputSchema,
    outputSchema: AdvancedTreatmentPlannerOutputSchema,
  },
  async (input) => {
    const { output } = await plannerPrompt(input);
    return output!;
  }
);
