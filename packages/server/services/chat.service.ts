import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';
import template from '../prompts/chatbot.txt';

const openaiClient = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY || '',
});

const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
   'utf-8'
);
const instructions = template.replace('parkInfo', parkInfo);

type ChatResponse = {
   id: string;
   message: string;
};

export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await openaiClient.responses.create({
         model: 'gpt-4.1-mini',
         input: prompt,
         instructions,
         temperature: 0.2,
         max_output_tokens: 100,
         previous_response_id:
            conversationRepository.getLastResponseId(conversationId), // Use the last response ID if available
      });

      conversationRepository.setLastResponseId(conversationId, response.id); // Store the last response ID for this conversation

      return {
         id: response.id,
         message: response.output_text,
      };
   },
};
