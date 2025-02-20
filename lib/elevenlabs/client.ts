import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "stream";
import { supabaseAdmin } from "../supabase/admin-client";

if (!process.env.ELEVENLABS_API_KEY) {
  throw new Error("Missing ELEVENLABS_API_KEY");
}

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

// Convert Readable stream to Buffer
const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

// Function to generate audio and upload to Supabase
export async function generateAudio(
  text: string,
  reportId: string
): Promise<string> {
  const defaultVoiceId = "GBv7mTt0atIp3Br8iCZE"; // Set your default voice ID here

  try {
    console.log("Generating audio with text:", text); // Log the text
    console.log("Using voice ID:", defaultVoiceId); // Log the voice ID

    // Use the function to get the buffer
    const audioBuffer = await streamToBuffer(
      await client.textToSpeech.convert(defaultVoiceId, {
        output_format: "mp3_22050_32",
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 1,
          similarity_boost: 1,
          style: 0.45,
          use_speaker_boost: true,
        },
      })
    );

    console.log("Audio buffer size:", audioBuffer.byteLength);

    console.log("Audio buffer received, creating Blob...");
    const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });

    // Use the reportId for the filename
    const filename = `audio_${reportId}.mp3`;

    console.log("Uploading audio to Supabase...");
    // Upload the audio file to Supabase storage
    const { data, error } = await supabaseAdmin.storage
      .from("voiceover")
      .upload(filename, audioBlob, {
        contentType: "audio/mpeg",
      });

    if (error) {
      throw new Error(`Error uploading to Supabase: ${error.message}`);
    }

    console.log("Audio file uploaded successfully:", data);
    return data.path; // Return the path of the uploaded file
  } catch (error) {
    console.error("Error in generateAudio:", error);
    throw error;
  }
}
