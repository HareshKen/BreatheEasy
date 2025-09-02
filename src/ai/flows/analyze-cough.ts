'use server';
/**
 * @fileOverview A flow that uses generative AI to analyze a user's cough from an audio recording.
 *
 * - analyzeCough - A function that analyzes cough audio.
 * - AnalyzeCoughInput - The input type for the analyzeCough function.
 * - AnalyzeCoughOutput - The return type for the analyzeCough function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCoughInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio recording of a cough, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeCoughInput = z.infer<typeof AnalyzeCoughInputSchema>;

const AnalyzeCoughOutputSchema = z.object({
  coughType: z.enum(['Productive', 'Non-productive', 'Uncertain']).describe("The type of cough, classified as either 'Productive' (wet, mucousy) or 'Non-productive' (dry, hacking)."),
  characteristics: z.string().describe("A comma-separated list of acoustic characteristics observed (e.g., harsh, wheezy, barking, sharp)."),
  summary: z.string().describe('A brief, one-sentence summary of the analysis.'),
});
export type AnalyzeCoughOutput = z.infer<typeof AnalyzeCoughOutputSchema>;

export async function analyzeCough(
  input: AnalyzeCoughInput
): Promise<AnalyzeCoughOutput> {
  return analyzeCoughFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCoughPrompt',
  input: {schema: AnalyzeCoughInputSchema},
  output: {schema: AnalyzeCoughOutputSchema},
  prompt: `You are an AI assistant with expertise in analyzing respiratory sounds. Your task is to provide a detailed, descriptive analysis of a cough from an audio recording.

  Analyze the following audio data and describe its acoustic characteristics. Consider aspects like:
  - Is it a productive (wet, mucousy) or non-productive (dry, hacking) cough?
  - What are its primary characteristics? (e.g., harsh, brassy, wheezy, barking, sharp)

  Return the analysis in the specified structured format. The summary should be a very brief, single sentence.

  IMPORTANT: Do not provide any medical advice, diagnosis, or suggest potential conditions. Your analysis must be strictly limited to the sounds you hear in the audio.

  Audio: {{media url=audioDataUri}}
  `,
});

const analyzeCoughFlow = ai.defineFlow(
  {
    name: 'analyzeCoughFlow',
    inputSchema: AnalyzeCoughInputSchema,
    outputSchema: AnalyzeCoughOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
