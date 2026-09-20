import OpenAI from 'openai';

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY || '',
});

type GenerateTextOptions = {
   model?: string;
   instructions?: string;
   input: string;
   temperature?: number;
   maxToken?: number;
   previousResponseId?: string;
};

type GenerateTextResult = {
   id: string;
   text: string;
};

export const llmClient = {
   async generateText({
      model = 'gpt-4.1-mini',
      instructions,
      input,
      temperature = 0.2,
      maxToken = 300,
      previousResponseId,
   }: GenerateTextOptions): Promise<GenerateTextResult> {
      const response = await client.responses.create({
         model,
         instructions,
         input,
         temperature,
         max_output_tokens: maxToken,
         previous_response_id: previousResponseId,
      });

      return {
         id: response.id,
         text: response.output_text,
      };
   },
};
