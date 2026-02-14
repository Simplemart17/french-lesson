import { supabase, supabaseAdmin, TABLES } from "@/lib/supabase";

interface DbUserProfile {
  id: string;
  name: string;
  email: string;
  level: string;
  points: number;
  streak_days: number;
  joined_at: string;
  learning_goals: string[];
  completed_lessons: number;
  last_active: string;
  daily_goal: number;
  notifications: boolean;
  theme: "light" | "dark";
}

interface UserProfileResult {
  data: DbUserProfile | null;
  error: { message: string } | null;
}

async function getAuthUserById(userId: string): Promise<{ email?: string; name?: string }> {
  try {
    if (!supabaseAdmin) return {};
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (error || !data.user) return {};
    const metaName = data.user.user_metadata?.name;
    return {
      email: data.user.email,
      name: typeof metaName === "string" ? metaName : undefined,
    };
  } catch {
    return {};
  }
}

export async function getOrCreateUserProfile(userId: string): Promise<UserProfileResult> {
  const dbClient = supabaseAdmin || supabase;
  const { data: existingProfile, error: fetchError } = await dbClient
    .from(TABLES.USERS)
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (fetchError) {
    return {
      data: null,
      error: { message: `Failed to fetch user profile: ${fetchError.message}` },
    };
  }

  if (existingProfile) {
    return { data: existingProfile as DbUserProfile, error: null };
  }

  const authUser = await getAuthUserById(userId);
  const email = authUser.email ?? `${userId}@local.invalid`;
  const name = (authUser.name && authUser.name.trim()) || email.split("@")[0] || "Learner";
  const now = new Date().toISOString();

  const { data: createdProfile, error: createError } = await dbClient
    .from(TABLES.USERS)
    .insert({
      id: userId,
      name,
      email,
      level: "A1",
      points: 0,
      streak_days: 0,
      joined_at: now,
      learning_goals: [],
      completed_lessons: 0,
      last_active: now,
      daily_goal: 15,
      notifications: true,
      theme: "light",
    })
    .select("*")
    .single();

  if (!createError && createdProfile) {
    return { data: createdProfile as DbUserProfile, error: null };
  }

  // Handle concurrent create attempts.
  const { data: profileAfterRace, error: raceError } = await dbClient
    .from(TABLES.USERS)
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (raceError || !profileAfterRace) {
    return {
      data: null,
      error: {
        message: `Failed to create user profile: ${createError?.message || raceError?.message || "unknown error"}`,
      },
    };
  }

  return { data: profileAfterRace as DbUserProfile, error: null };
}

