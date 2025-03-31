'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useState } from 'react';
import Image from 'next/image';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col w-full max-w-md py-14 mx-auto stretch space-y-4">
      <div className="text-center text-4xl">Pi-Finder</div>
      <div className="text-center text-lg">Find your favorite no in everything</div>
      <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap p-3 rounded-lg shadow-md bg-gray-100">
            <strong>{m.role === 'user' ? 'You: ' : 'AI: '}</strong>
            {m.content}
            <div className="mt-2">
              {m?.experimental_attachments
                ?.filter(attachment =>
                  attachment?.contentType?.startsWith('image/'),
                )
                .map((attachment, index) => (
                  <Image
                    key={`${m.id}-${index}`}
                    src={attachment.url}
                    width={500}
                    height={500}
                    alt={attachment.name ?? `attachment-${index}`}
                    className="rounded-lg"
                  />
                ))}
            </div>
          </div>
        ))}
        <div className="h-24 w-full"></div>
      </div>

      <form
        className="fixed rounded-xl bottom-0 w-full max-w-md p-4 bg-white border-t border-gray-300 shadow-xl space-y-3"
        onSubmit={event => {
          handleSubmit(event, {
            experimental_attachments: files,
          });

          setFiles(undefined);

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      >
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept="image/*"
            placeholder='upload image'
            className="flex-1 border rounded-lg text-center border-gray-300  p-2"
            onChange={event => {
              if (event.target.files) {
                setFiles(event.target.files);
              }
            }}
            multiple
            ref={fileInputRef}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            className="flex-1 border border-gray-300 rounded p-2"
            value={input}
            placeholder="Type here ..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}