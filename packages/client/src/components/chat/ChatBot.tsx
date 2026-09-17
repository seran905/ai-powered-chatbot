import axios from 'axios';
import { useRef, useState } from 'react';
import TypingIndicator from './TypingIndicator';
import type { Message } from './ChatMessage';
import ChatMessage from './ChatMessage';
import ChatInput, { type ChatFormData } from './ChatInput';
import popSound from '@/assets/sounds/pop.mp3';
import notificationSound from '@/assets/sounds/notification.mp3';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false); // State to track if the bot is typing
   const [error, setError] = useState<string | null>('');
   const conversationId = useRef(crypto.randomUUID());

   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setError(''); // Clear any previous errors
         popAudio.play();

         setIsBotTyping(true); // Set the bot as typing
         const { data } = await axios.post<ChatResponse>('api/chat', {
            prompt,
            conversationId: conversationId.current,
         });
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
         notificationAudio.play();
      } catch (err) {
         setError('Something went wrong. Please try again.');
         console.error(err);
      } finally {
         setIsBotTyping(false); // Ensure the bot is not typing in case of an error
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
            <ChatMessage messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {error && (
               <div className="px-3 py-1 rounded-xl bg-red-100 text-red-700 self-start">
                  {error}
               </div>
            )}
         </div>
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBot;
