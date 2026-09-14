import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import z from 'zod';

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt cannot be empty')
      .max(1000, 'Prompt cannot exceed 1000 characters'),
   conversationId: z.uuid(),
});

export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parseResult = chatSchema.safeParse(req.body);

      if (!parseResult.success) {
         return res
            .status(400)
            .json({ error: z.flattenError(parseResult.error) });
      }

      const { prompt, conversationId } = req.body;

      try {
         const response = await chatService.sendMessage(prompt, conversationId);
         res.json({ message: response.message });
      } catch (error) {
         console.error('Error generating response:', error);
         res.status(500).json({
            error: 'An error occurred while generating the response.',
         });
      }
   },
};
