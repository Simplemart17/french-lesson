import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse } from "@/types/api";
import { PronunciationExercise as ImportedPronunciationExercise } from "@/services/api/pronunciationApiService";
import { supabase, TABLES } from "@/lib/supabase";

// Extended PronunciationPhrase interface for the database data
interface PronunciationPhrase {
  id: number;
  text: string;
  translation: string;
  audioUrl: string;
  phonetics: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  focusSounds: string[];
}

// Extended PronunciationExercise interface for the database data
interface PronunciationExercise extends ImportedPronunciationExercise {
  phrases: PronunciationPhrase[];
}

// Helper function to map database difficulty to API format
function mapDifficultyLevel(
  dbDifficulty: string
): "beginner" | "intermediate" | "advanced" {
  switch (dbDifficulty) {
    case "A1":
    case "A2":
      return "beginner";
    case "B1":
    case "B2":
      return "intermediate";
    case "C1":
    case "C2":
      return "advanced";
    default:
      return "beginner";
  }
}

// Mock data for pronunciation phrases
const mockPronunciationPhrases: Record<string, PronunciationPhrase[]> = {
  beginner: [
    {
      id: 1,
      text: "Bonjour, comment allez-vous?",
      translation: "Hello, how are you?",
      audioUrl: "/audio/pronunciation/bonjour.mp3",
      phonetics: "bɔ̃.ʒuʁ kɔ.mɑ̃ t‿a.le vu",
      difficulty: "beginner",
      focusSounds: ["ɔ̃", "ʁ"],
    },
    {
      id: 2,
      text: "Je m'appelle Marie.",
      translation: "My name is Marie.",
      audioUrl: "/audio/pronunciation/je-mappelle.mp3",
      phonetics: "ʒə ma.pɛl ma.ʁi",
      difficulty: "beginner",
      focusSounds: ["ʒ", "ɛ"],
    },
    {
      id: 3,
      text: "Merci beaucoup.",
      translation: "Thank you very much.",
      audioUrl: "/audio/pronunciation/merci-beaucoup.mp3",
      phonetics: "mɛʁ.si bo.ku",
      difficulty: "beginner",
      focusSounds: ["ɛʁ", "u"],
    },
  ],
  intermediate: [
    {
      id: 4,
      text: "Je voudrais réserver une table pour deux personnes.",
      translation: "I would like to reserve a table for two people.",
      audioUrl: "/audio/pronunciation/reserver-table.mp3",
      phonetics: "ʒə vu.dʁɛ ʁe.zɛʁ.ve yn tabl puʁ dø pɛʁ.sɔn",
      difficulty: "intermediate",
      focusSounds: ["ʁ", "ø", "ɛʁ"],
    },
    {
      id: 5,
      text: "Pourriez-vous me dire où se trouve la gare?",
      translation: "Could you tell me where the train station is?",
      audioUrl: "/audio/pronunciation/ou-est-la-gare.mp3",
      phonetics: "pu.ʁje vu mə diʁ u sə tʁuv la gaʁ",
      difficulty: "intermediate",
      focusSounds: ["u", "ʁ", "tʁ"],
    },
    {
      id: 6,
      text: "J'aimerais acheter un billet pour Paris.",
      translation: "I would like to buy a ticket to Paris.",
      audioUrl: "/audio/pronunciation/billet-paris.mp3",
      phonetics: "ʒɛ.mə.ʁɛ a.ʃə.te œ̃ bi.jɛ puʁ pa.ʁi",
      difficulty: "intermediate",
      focusSounds: ["ɛ", "œ̃", "j"],
    },
  ],
  advanced: [
    {
      id: 7,
      text: "Les feuilles des arbres bruissent dans le vent d'automne.",
      translation: "The leaves of the trees rustle in the autumn wind.",
      audioUrl: "/audio/pronunciation/feuilles-arbres.mp3",
      phonetics: "le fœj de.z‿aʁbʁ bʁɥis dɑ̃ lə vɑ̃ do.tɔn",
      difficulty: "advanced",
      focusSounds: ["œ", "ɥi", "ʁ", "ɑ̃"],
    },
    {
      id: 8,
      text: "Ce vieux monsieur a un accent particulièrement charmant.",
      translation: "This old gentleman has a particularly charming accent.",
      audioUrl: "/audio/pronunciation/accent-charmant.mp3",
      phonetics: "sə vjø mə.sjø a œ̃.n‿ak.sɑ̃ paʁ.ti.ky.ljɛʁ.mɑ̃ ʃaʁ.mɑ̃",
      difficulty: "advanced",
      focusSounds: ["œ̃", "ɑ̃", "ʁ"],
    },
    {
      id: 9,
      text: "La prononciation française nécessite beaucoup de pratique.",
      translation: "French pronunciation requires a lot of practice.",
      audioUrl: "/audio/pronunciation/prononciation-francaise.mp3",
      phonetics: "la pʁɔ.nɔ̃.sja.sjɔ̃ fʁɑ̃.sɛz ne.se.sit bo.ku də pʁa.tik",
      difficulty: "advanced",
      focusSounds: ["ɔ̃", "ɑ̃", "ɛ"],
    },
  ],
};

// Mock pronunciation exercises
const mockPronunciationExercises: PronunciationExercise[] = [
  {
    id: 1,
    title: "Basic Greetings",
    description: "Practice basic French greetings and introductions.",
    difficulty: "beginner",
    phrases: mockPronunciationPhrases.beginner.slice(0, 3),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Travel Phrases",
    description: "Common phrases for traveling in French-speaking countries.",
    difficulty: "intermediate",
    phrases: mockPronunciationPhrases.intermediate.slice(0, 3),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Advanced Expressions",
    description:
      "Complex sentences with challenging sounds for advanced learners.",
    difficulty: "advanced",
    phrases: mockPronunciationPhrases.advanced.slice(0, 3),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PronunciationExercise>>
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: {
        message: "Method not allowed",
      },
    });
  }

  try {
    // Get the exercise ID from the URL
    const { id } = req.query;
    const exerciseId = parseInt(id as string, 10);

    if (isNaN(exerciseId)) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid exercise ID",
        },
      });
    }

    // Get the pronunciation exercise from database
    const { data: exercise, error } = await supabase
      .from(TABLES.PRONUNCIATION_EXERCISES)
      .select("*")
      .eq("id", exerciseId)
      .single();

    if (error || !exercise) {
      // Find the exercise by ID
      const exercise = mockPronunciationExercises.find(
        (ex) => ex.id === exerciseId
      );
      // If no exercise found in database, return mock data
      return res.status(200).json({
        success: true,
        data: exercise,
      });
    }

    // Transform database data to API format
    const pronunciationExercise: PronunciationExercise = {
      id: exercise.id,
      title: exercise.title || `Pronunciation Exercise ${exercise.id}`,
      description: exercise.description || "Practice French pronunciation",
      difficulty: mapDifficultyLevel(exercise.difficulty),
      phrases: [
        {
          id: exercise.id,
          text: exercise.text,
          translation: exercise.translation || "",
          audioUrl:
            exercise.audio_url ||
            `/audio/pronunciation/exercise-${exercise.id}.mp3`,
          phonetics: exercise.phonetics || "",
          difficulty: mapDifficultyLevel(exercise.difficulty),
          focusSounds: exercise.focus_sounds
            ? exercise.focus_sounds.split(",")
            : [],
        },
      ],
      createdAt: exercise.created_at || new Date().toISOString(),
      updatedAt: exercise.updated_at || new Date().toISOString(),
    };

    // Return the exercise
    return res.status(200).json({
      success: true,
      data: pronunciationExercise,
    });
  } catch (error) {
    console.error("Error in pronunciation exercise API:", error);
    return res.status(500).json({
      success: false,
      error: {
        message: "Internal server error",
      },
    });
  }
}
