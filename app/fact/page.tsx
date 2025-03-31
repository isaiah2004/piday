'use client';

import { useChat } from '@ai-sdk/react';
import { Facts } from '@/components/facts';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/facts',
  });

  return (
    <div className="flex flex-col w-full max-w-md py-14 mx-auto stretch space-y-4">
      <div className="text-center text-4xl">Pi Facts</div>
      <div className="text-center text-lg">Discover amazing facts about Pi</div>
      <div className="space-y-4">
        {messages.map(message => (
          <div key={message.id} className="whitespace-pre-wrap p-3 rounded-lg shadow-md bg-gray-100">
            <strong>{message.role === 'user' ? 'You: ' : 'AI: '}</strong>
            {message.content}

            <div className="mt-2">
              {message.toolInvocations?.map(toolInvocation => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === 'result') {
                  if (toolName === 'FactTool') {
                    const { result } = toolInvocation;
                    return (
                      <div key={toolCallId} className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Facts title="Pi Fact" Content={result.fact} />
                      </div>
                    );
                  }
                } else {
                  return (
                    <div key={toolCallId} className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {toolName === 'FactTool' ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading Pi fact...
                        </div>
                      ) : null}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}
        <div className="h-24 w-full"></div>
      </div>

      <form 
        className="fixed rounded-xl bottom-0 w-full max-w-md p-4 bg-white border-t border-gray-300 shadow-xl"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center space-x-2">
          <input
            className="flex-1 border border-gray-300 rounded p-2"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about Pi..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}