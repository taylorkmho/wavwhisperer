# Wave Whisperer

Wave Whisperer is a Next.js application that forecasts surf conditions by fetching data from NOAA, generating surf-themed limericks using OpenAI, and creating audio narrations with ElevenLabs. This project serves as an exploration of OpenAI's API capabilities, particularly focusing on multi-shot prompting techniques to generate context-aware, metered poetry from structured forecast data.

## Features

- **Daily Surf Data**: Fetches and parses surf data from NOAA's XML feed.
- **Limerick Generation**: Uses OpenAI to create surf-themed limericks based on NOAA discussions. Implements the persona-instruction-context prompting pattern, inspired by Chapter 6 of "Hands-on Large Language Models" (Alammar & Grootendorst).
- **Audio Narration**: Converts limericks into audio using ElevenLabs and stores them in Supabase.
- **Interactive 3D UI**: Features a physics-based crystal ball using Three.js, React Three Fiber, and Framer Motion for fluid animations and interactions. Includes real-time mesh deformation, dynamic lighting, and audio playback controls.

```mermaid
sequenceDiagram
    participant Cron as Vercel Cron
    participant NOAA as NOAA XML Feed
    participant Backend as Wave Whisperer API
    participant OpenAI as OpenAI API
    participant ElevenLabs as ElevenLabs API
    participant Supabase as Supabase
    participant Frontend as Wave Whisperer UI

    Cron->>Backend: Trigger daily update
    Backend->>NOAA: Fetch surf data
    NOAA-->>Backend: Return XML feed
    Backend->>Backend: Parse surf data
    Backend->>OpenAI: Generate limerick
    OpenAI-->>Backend: Return limerick
    Backend->>Supabase: Store initial data
    Supabase-->>Backend: Return report ID
    Backend->>ElevenLabs: Convert to speech
    ElevenLabs-->>Backend: Return audio file
    Backend->>Supabase: Update with audio path
    Frontend->>Supabase: Fetch latest report
    Supabase-->>Frontend: Return data & audio URL
    Frontend->>Frontend: Display report & play audio
```

## Getting Started

To get started with Wave Whisperer, follow these steps:

### 1. Clone the Repository

First, clone the repository to your local machine and navigate into the project directory:

```bash
git clone https://github.com/taylorkmho/wavewhisperer.git
cd wavewhisperer
```

### 2. Install Dependencies

First ensure you have pnpm installed (`npm install -g pnpm` if you don't have it).

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory of the project. This file will store all the necessary environment variables required for the application to function correctly. Add the following variables:

- `CRON_SECRET`: Used to authenticate cron jobs for scheduled tasks.
- `ELEVENLABS_API_KEY`: API key for ElevenLabs to generate audio narrations.
- `OPENAI_API_KEY` and `OPENAI_ORG_ID`: Credentials for accessing OpenAI's API to generate limericks.
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for Supabase, used for server-side operations requiring elevated permissions.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public credentials for accessing Supabase, used for client-side operations.

### 4. Set Up Database

Using the Supabase dashboard or SQL editor, create the necessary database tables:

```sql
-- Create the surf_reports table
CREATE TABLE surf_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_build_date TEXT NOT NULL,
    discussion TEXT[] NOT NULL,
    wave_heights JSONB NOT NULL,
    raw_xml TEXT,
    poem TEXT[] NOT NULL,
    model TEXT NOT NULL,
    audio_path TEXT
);

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('voiceover', 'voiceover', true);

-- Set up storage policy for public access to audio files
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'voiceover');
```

### 5. Run the Development Server

Start the development server to run the application locally:

```bash
pnpm dev
```

This command will start the Next.js development server, typically accessible at [http://localhost:3000](http://localhost:3000).

### 6. Open the Application

Visit [http://localhost:3000](http://localhost:3000) in your browser to view and interact with the application. You can explore the surf forecasts, listen to generated limericks, and enjoy the interactive UI.
