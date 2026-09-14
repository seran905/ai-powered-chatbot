import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';

dotenv.config();

const openaiClient = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY || '',
});

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send('Hello, World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello from the API!' });
});

// let lastResponseId: string | null = null;
const conversations = new Map<string, string>(); // Map to store conversation IDs and their last response IDs

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt cannot be empty')
      .max(1000, 'Prompt cannot exceed 1000 characters'),
   conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = chatSchema.safeParse(req.body);
   if (!parseResult.success) {
      return res.status(400).json({ error: z.flattenError(parseResult.error) });
   }

   const { prompt, conversationId } = req.body;

   try {
      const response = await openaiClient.responses.create({
         model: 'gpt-4.1-mini',
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 100,
         previous_response_id: conversations.get(conversationId) || undefined, // Use the last response ID if available
      });

      conversations.set(conversationId, response.id); // Store the last response ID for this conversation

      res.json({ message: response.output_text });
   } catch (error) {
      console.error('Error generating response:', error);
      res.status(500).json({
         error: 'An error occurred while generating the response.',
      });
   }
});

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
