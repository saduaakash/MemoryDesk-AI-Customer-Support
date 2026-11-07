# MemoryDesk

An AI customer-support demo that uses Hindsight for persistent customer memory and Groq for response generation.

## Prerequisites

- Node.js 18+
- A Groq API key
- A Hindsight Cloud API key and an available Hindsight memory bank / workspace

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env`.

   Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   macOS/Linux:

   ```bash
   cp .env.example .env
   ```

3. Add your real `GROQ_API_KEY` and `HINDSIGHT_API_KEY` in `.env`. Keep `.env` private; never commit it.

4. In Hindsight, confirm your Cloud API base URL, API key, and memory bank configuration. Set `HINDSIGHT_BANK_ID` to your chosen bank prefix.

5. Start the application:

   ```bash
   npm run dev
   ```

6. Open http://localhost:3000.

## Demo flow

1. Keep customer ID `rahul-01`.
2. Send: "My order 7842 was delayed and I prefer updates by email."
3. Send another message: "What do you remember about my previous issue?"
4. Check the Memory Insights panel.
5. Switch to a different customer ID and verify that customer memories are separated.

## Architecture

Browser UI -> Express API -> Hindsight recall -> Groq response -> Hindsight retain -> Browser UI.

The backend uses Hindsight's official JavaScript SDK. API keys stay on the server.

## Important notes

- This is a hackathon MVP starter, not a production-ready support platform.
- Verify the Hindsight Cloud bank/API setup in your account before the demo.
- The demo must show real Hindsight recall and retain operations; do not present mock memories as real.
- Add authentication, rate limiting, validation, audit logging, and secure customer data handling before production use.
- Do not use real sensitive customer information in the demo.
