import fs from 'fs';
import path from 'path';
import { conversationRepository } from '../repositories/conversation.repository';
import template from '../llm/prompts/chatbot.txt';
import { llmClient } from '../llm/client';

const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'llm', 'prompts', 'WonderWorld.md'),
   'utf-8'
);
const instructions = template.replace('{{parkInfo}}', parkInfo);

type ChatResponse = {
   id: string;
   message: string;
};

export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await llmClient.generateText({
         model: 'gpt-4.1-mini',
         input: prompt,
         instructions,
         temperature: 0.2,
         maxToken: 100,
         previousResponseId:
            conversationRepository.getLastResponseId(conversationId), // Use the last response ID if available
      });

      conversationRepository.setLastResponseId(conversationId, response.id); // Store the last response ID for this conversation

      return {
         id: response.id,
         message: response.text,
      };
   },
};
