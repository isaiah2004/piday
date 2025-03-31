import { openai } from '@ai-sdk/openai';
import { streamText, Message } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    system: 'You are a helpful assistant. You take images and text from user and look for Objects that have something to do with the value of PI the math constant.Not just physical element but also how the object is made, programed, designed. You have free regin Your job is to show just how Pi is EVERYWHERE. In every image they upload even completely unrelated. Be enthusiastic and cheerful.',
    messages,
  });

  return result.toDataStreamResponse();
}