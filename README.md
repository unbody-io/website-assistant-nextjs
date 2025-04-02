# Next.js Website AI Assistant

A modern, real-time AI assistant for websites built with Next.js and powered by [Unbody](https://unbody.io/). This project showcases Unbody's capabilities in creating intelligent, context-aware chat interfaces with RAG (Retrieval-Augmented Generation) capabilities.

## About Unbody

[Unbody](https://unbody.io/) is a powerful AI platform that enables developers to build intelligent applications with advanced natural language processing and knowledge retrieval capabilities. This project demonstrates how to leverage Unbody's features to create a sophisticated chat interface that can understand, search, and respond to user queries in real-time.

## Features

- 🤖 Real-time AI chat interface with streaming responses powered by Unbody
- 🔍 RAG (Retrieval-Augmented Generation) for accurate, context-aware responses
- 🎨 Beautiful, responsive UI with Framer Motion animations
- 📱 Mobile-friendly design
- 🔄 Real-time status updates during processing
- 💬 Thread-based conversation management
- 🖼️ Support for web and image results from Unbody's knowledge base
- ⚡ Server-sent events for streaming responses

## Tech Stack

- **Core Technology**: [Unbody](https://unbody.io/) for AI and RAG capabilities
- **Framework**: Next.js 14 with App Router
- **UI**: Tailwind CSS, Framer Motion, Lucide Icons
- **State Management**: React Hooks
- **Type Safety**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animation**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- [Unbody API Key](https://unbody.io/) (sign up at unbody.io)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/next-js-website-ai-assistant.git
cd next-js-website-ai-assistant
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Unbody API key:
```env
UNBODY_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── chat/             # Chat-related components
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and shared logic
│   └── unbody/          # Unbody integration utilities
├── public/              # Static assets
└── types/               # TypeScript type definitions
```

## Key Components

### Chat Interface
- `RagChat`: Main chat component that manages the conversation flow
- `ChatMessages`: Displays the message thread
- `ChatInput`: Handles user input and message sending
- `CurrentResponse`: Shows the current processing state

### Status Indicators
- `StatusIndicator`: Shows detailed processing status
- `MiniStatusIndicator`: Compact status display for mobile

### Hooks
- `useThread`: Manages conversation state and message handling
- `useRag`: Handles RAG processing and state management

## Features in Detail

### Real-time Processing
The assistant uses Unbody's streaming capabilities to provide immediate feedback to users, with server-sent events for real-time updates.

### Status Updates
Users can see the current processing stage:
- Understanding the question (using Unbody's NLP)
- Searching for relevant information (Unbody's knowledge retrieval)
- Generating the response (Unbody's response generation)

### Message Thread
- Maintains conversation history
- Supports follow-up questions
- Shows processing status for each message

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Powered by [Unbody](https://unbody.io/)
- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/) 