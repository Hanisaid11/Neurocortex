'use server';
/**
 * @fileOverview This file implements a Genkit flow for a hands-free voice assistant
 * that answers medical questions in real-time, suitable for use in an operating room.
 *
 * - orVoiceAssistantMedicalQuery - A function that handles a medical question,
 *   provides a concise text answer, and converts it into an audible WAV format.
 * - MedicalQuestionInput - The input type for the orVoiceAssistantMedicalQuery function.
 * - MedicalQuestionOutput - The return type for the orVoiceAssistantMedicalQuery function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as wav from 'wav';
import { Buffer } from 'buffer';

const MedicalQuestionInputSchema = z
  .string()
  .describe('The medical question asked by the surgeon.');
export type MedicalQuestionInput = z.infer<typeof MedicalQuestionInputSchema>;

const MedicalQuestionOutputSchema = z.object({
  textResponse: z
    .string()
    .describe('The concise text answer to the medical question.'),
  audioResponse: z
    .string()
    .describe(
      "The audio response as a data URI ('data:audio/wav;base64,<encoded_data>') to the medical question."
    ),
});
export type MedicalQuestionOutput = z.infer<typeof MedicalQuestionOutputSchema>;

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

const medicalQuestionPrompt = ai.definePrompt({
  name: 'medicalQuestionPrompt',
  input: { schema: MedicalQuestionInputSchema },
  output: { schema: z.string().describe('Concise medical answer.') }, // Output is just text for this prompt
  prompt: `You are a highly knowledgeable medical assistant specializing in neurosurgery and neurology.\nA neurosurgeon in an operating room is asking a question and needs a concise, accurate, and audible answer.\nProvide a direct and brief answer to the following medical question. Do not include conversational filler or extensive explanations.\nKeep the answer under 50 words.\n\nQuestion: {{{input}}}`,
});

const orVoiceAssistantMedicalQueryFlow = ai.defineFlow(
  {
    name: 'orVoiceAssistantMedicalQueryFlow',
    inputSchema: MedicalQuestionInputSchema,
    outputSchema: MedicalQuestionOutputSchema,
  },
  async (question) => {
    // Step 1: Get the concise text response from the LLM
    const { output: textResponse } = await medicalQuestionPrompt(question);

    if (!textResponse) {
      throw new Error('Failed to get a text response for the medical question.');
    }

    // Step 2: Convert the text response to speech using TTS model
    const { media } = await ai.generate({
      model: ai.model('googleai/gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // Using a suitable voice from the example
          },
        },
      },
      prompt: textResponse, // Use the text response from the first step as prompt for TTS
    });

    if (!media) {
      throw new Error('No audio media returned from TTS model.');
    }

    // Extract base64 audio data and convert to WAV
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);

    return {
      textResponse: textResponse,
      audioResponse: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

export async function orVoiceAssistantMedicalQuery(
  input: MedicalQuestionInput
): Promise<MedicalQuestionOutput> {
  return orVoiceAssistantMedicalQueryFlow(input);
}
