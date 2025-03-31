import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get server IP from environment variable
    const serverIP = process.env.SERVERIP;
    
    if (!serverIP) {
      return NextResponse.json({ error: "Server IP not found in environment variables" }, { status: 500 });
    }
    
    // Determine which endpoint to call based on the URL path
    const url = new URL(request.url);
    const endpoint = url.searchParams.get('endpoint');
    
    if (endpoint === 'search') {
      // Handle search request
      const body = await request.json();
      const input_string = body.input_string;
      
      if (!input_string) {
        return NextResponse.json({ error: "Search input_string is required" }, { status: 400 });
      }
      
      // Forward the request to the search endpoint
      const response = await fetch(`http://${serverIP}:80/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_string: input_string }),
      });
      
      // Get the response data
      const data = await response.json();
      
      // Return the response
      return NextResponse.json(data);
    } else {
      // Default to decipher request
      const body = await request.json();
      
      // Ensure input_string is provided
      if (!body.input_string) {
        return NextResponse.json({ error: "input_string is required" }, { status: 400 });
      }
      
      // Forward the request to the decipher endpoint
      const response = await fetch(`http://${serverIP}:80/decipher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_string: body.input_string
        }),
      });
      
      // Get the response data
      const data = await response.json();
      
      // Return the response
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 });
  }
}
