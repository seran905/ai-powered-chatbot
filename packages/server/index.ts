import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

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

app.post('/api/chat', async (req: Request, res: Response) => {
   const { prompt } = req.body;

   try {
      const response = await openaiClient.responses.create({
         model: 'gpt-4.1-mini',
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 100,
      });

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
