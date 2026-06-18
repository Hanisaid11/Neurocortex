'use server';
/**
 * @fileOverview A Genkit flow for high-level neurosurgical case discussion.
 * - unifiedMedicalChat - Handles multi-modal inputs, memory-aware reasoning, and RAG.
 * - Now includes bidirectional audio response for Live Audio Sessions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as wav from 'wav';
import { Buffer } from 'buffer';

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
    language: z.enum(['en', 'ar']).default('en'),
  }),
  generateAudio: z.boolean().optional().describe('Whether to generate a spoken audio response.'),
});

const UnifiedChatOutputSchema = z.object({
  response: z.string().describe('The primary medical response with inline citations.'),
  audioResponse: z.string().optional().describe('Base64 encoded WAV audio of the response.'),
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

// Helper function to convert PCM audio buffer to WAV format
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

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
5. LANGUAGE: Respond in the user's preferred language: {{{userProfile.language}}}.

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
- Type: {{{type}}}
{{#if (eq type "text")}}Content: {{{content}}}{{else}}Media Part Provided{{/if}}
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
    // Step 1: Generate Text Response
    const { output } = await unifiedChatPrompt(input);
    const finalOutput = output!;

    // Step 2: Generate Audio if requested
    if (input.generateAudio) {
      try {
        const { media } = await ai.generate({
          model: ai.model('googleai/gemini-2.5-flash-preview-tts'),
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { 
                  // Use a voice that sounds appropriate for the language
                  voiceName: input.userProfile.language === 'ar' ? 'Achernar' : 'Algenib' 
                },
              },
            },
          },
          prompt: finalOutput.response.substring(0, 500), // Keep it concise for audio
        });

        if (media) {
          const audioBuffer = Buffer.from(
            media.url.substring(media.url.indexOf(',') + 1),
            'base64'
          );
          const wavBase64 = await toWav(audioBuffer);
          finalOutput.audioResponse = 'data:audio/wav;base64,' + wavBase64;
        }
      } catch (err) {
        console.warn('Audio generation failed, returning text only.', err);
      }
    }

    return finalOutput;
  }
);
