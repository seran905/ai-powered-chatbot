// Implementation Details
const conversations = new Map<string, string>(); // Map to store conversation IDs and their last response IDs

export const conversationRepository = {
   getLastResponseId(conversationId: string): string | undefined {
      return conversations.get(conversationId);
   },

   setLastResponseId(conversationId: string, responseId: string): void {
      conversations.set(conversationId, responseId);
   },
};
