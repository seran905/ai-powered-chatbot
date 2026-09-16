import type { KeyboardEvent } from 'react';
import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

export type ChatFormData = {
   prompt: string;
};

type ChatInputProps = {
   onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit }: ChatInputProps) => {
   const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

   const submit = handleSubmit((data) => {
      reset({ prompt: '' }); // Reset the form after submission
      onSubmit(data);
   });

   const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         submit();
      }
   };

   return (
      <form
         onSubmit={submit}
         onKeyDown={onKeyDown}
         className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
         <textarea
            {...register('prompt', {
               required: true,
               validate: (value) => value.trim().length > 0,
            })}
            autoFocus
            className="w-full border-0 focus:outline-0 resize-none"
            placeholder="Ask me anything..."
            maxLength={1000}
         />
         <Button
            disabled={!formState.isValid}
            type="submit"
            className="rounded-full w-9 h-9"
         >
            <FaArrowUp />
         </Button>
      </form>
   );
};

export default ChatInput;
