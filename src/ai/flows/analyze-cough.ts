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
  analysis: z.string().describe('A brief analysis of the cough, indicating if it sounds wet or dry.'),
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
  prompt: `You are an AI assistant that analyzes audio recordings of coughs.

  Analyze the following audio data and determine if the cough sounds wet or dry. Provide a very brief, one-sentence analysis.
  Do not provide any medical advice or diagnosis.

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
