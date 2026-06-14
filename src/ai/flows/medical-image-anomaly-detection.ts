'use server';
/**
 * @fileOverview A Genkit flow for analyzing medical images (X-rays, CTs, MRIs) or surgical videos
 * to detect anomalies and generate a detailed report.
 *
 * - medicalImageAnomalyDetection - A function that handles the medical image anomaly detection process.
 * - MedicalImageAnomalyDetectionInput - The input type for the medicalImageAnomalyDetection function.
 * - MedicalImageAnomalyDetectionOutput - The return type for the medicalImageAnomalyDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicalImageAnomalyDetectionInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A medical image (X-ray, CT, MRI) or surgical video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  context: z
    .string()
    .optional()
    .describe(
      'Optional clinical context or description related to the medical media.'
    ),
});
export type MedicalImageAnomalyDetectionInput = z.infer<
  typeof MedicalImageAnomalyDetectionInputSchema
>;

const AnomalySchema = z.object({
  type: z
    .string()
    .describe(
      'The type of anomaly detected (e.g., "tumor", "fracture", "lesion", "inflammation", "abnormal vessel").'
    ),
  description: z
    .string()
    .describe('A detailed description of the detected anomaly.'),
  location: z
    .string()
    .describe(
      'The anatomical location or region where the anomaly is found (e.g., "left frontal lobe", "T4 vertebra", "posterior fossa").'
    ),
  severity: z
    .enum(['mild', 'moderate', 'severe', 'critical', 'unknown'])
    .describe('The assessed severity of the anomaly.'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("The AI's confidence (0-1) in detecting this anomaly."),
});

const MedicalImageAnomalyDetectionOutputSchema = z.object({
  overallReport: z
    .string()
    .describe(
      'A comprehensive AI-generated report summarizing the findings from the medical media analysis.'
    ),
  anomaliesDetected: z
    .boolean()
    .describe('True if any anomalies were detected, false otherwise.'),
  anomalies: z
    .array(AnomalySchema)
    .describe('A list of detected anomalies, including their type, description, location, severity, and confidence.'),
});
export type MedicalImageAnomalyDetectionOutput = z.infer<
  typeof MedicalImageAnomalyDetectionOutputSchema
>;

export async function medicalImageAnomalyDetection(
  input: MedicalImageAnomalyDetectionInput
): Promise<MedicalImageAnomalyDetectionOutput> {
  return medicalImageAnomalyDetectionFlow(input);
}

const medicalImageAnomalyDetectionPrompt = ai.definePrompt({
  name: 'medicalImageAnomalyDetectionPrompt',
  input: { schema: MedicalImageAnomalyDetectionInputSchema },
  output: { schema: MedicalImageAnomalyDetectionOutputSchema },
  prompt: `You are an expert medical imaging analysis AI specializing in neurosurgery and neurology.
Your task is to meticulously analyze the provided medical media (image or video) and identify any potential anomalies or areas of interest relevant to neurological conditions.
Based on your analysis, generate a structured report and a list of detected anomalies.

If provided, use the following clinical context to guide your analysis:
Clinical Context: {{{context}}}

Medical Media: {{media url=mediaDataUri}}

Analyze the media for:
- Tumors (benign/malignant)
- Lesions (e.g., demyelinating, infectious, vascular)
- Hemorrhages (e.g., intracranial, subarachnoid)
- Fractures (e.g., skull, vertebral)
- Edema
- Aneurysms or vascular malformations
- Structural abnormalities (e.g., hydrocephalus, atrophy)
- Signs of infection or inflammation
- Any other significant deviations from normal anatomy or expected findings.

For each detected anomaly, provide its type, a detailed description, precise anatomical location, assessed severity, and your confidence level in its detection (a number between 0 and 1).
If no anomalies are detected, set 'anomaliesDetected' to false and provide an 'overallReport' stating that no significant anomalies were found.`,
});

const medicalImageAnomalyDetectionFlow = ai.defineFlow(
  {
    name: 'medicalImageAnomalyDetectionFlow',
    inputSchema: MedicalImageAnomalyDetectionInputSchema,
    outputSchema: MedicalImageAnomalyDetectionOutputSchema,
  },
  async (input) => {
    const { output } = await medicalImageAnomalyDetectionPrompt(input, {
      model: 'googleai/gemini-2.5-flash-image', // Use a multimodal model for image/video analysis
      config: {
        responseModalities: ['TEXT'], // Only need text output for the report
      },
    });
    return output!;
  }
);
