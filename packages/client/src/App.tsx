import { useState } from 'react';
import ChatBot from './components/chat/ChatBot';
import ReviewList from './components/reviews/ReviewList';
import { Button } from './components/ui/button';

const tabs = ['chat', 'reviews'] as const;

function App() {
   const [tab, setTab] = useState<(typeof tabs)[number]>('chat');
   const show = (t: string) =>
      tab === t ? 'flex-1 min-h-0 overflow-y-auto' : 'hidden';

   return (
      <div className="flex flex-col p-4 h-screen w-full">
         <div className="flex gap-2 mb-4">
            {tabs.map((t) => (
               <Button
                  key={t}
                  variant={tab === t ? 'default' : 'outline'}
                  onClick={() => setTab(t)}
                  className="capitalize cursor-pointer"
               >
                  {t}
               </Button>
            ))}
         </div>
         <div className={show('chat')}>
            <ChatBot />
         </div>
         <div className={show('reviews')}>
            <ReviewList productId={2} />
         </div>
      </div>
   );
}

export default App;
