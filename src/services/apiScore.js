import { supabase } from "../utils/supabase";

export async function getScoreList() {
  const { data, error } = await supabase.from("score").select("*");
  if (error) {
    console.error("Error fetching scores:", error);
    throw new Error("Failed to fetch scores");
  }
  return data;
}

export async function createScore(newScore) {
  const { data, error } = await supabase
    .from("score")
    .insert([newScore])
    .select();
  if (error) {
    console.log(error.message);
    return;
  }
  return data;
}

export async function getScoreByScoreId(scoreId) {
  let { data: score, error } = await supabase
    .from("score")
    .select("*")
    .eq("id", scoreId);

  if (error) {
    console.log(error.message);
    return;
  }
  return score;
}

export async function updataScore(scoreId, newScore) {
  const { data, error } = await supabase
    .from("score")
    .update(newScore)
    .eq("id", scoreId)
    .select();
  if (error) {
    console.log(error.message);
    return;
  }
  return data;
}

export async function deleteScore(scoreId) {
  const { error } = await supabase
    .from("score")
    .delete()
    .eq("id", scoreId);

  if (error) {
    console.error("Error deleting score:", error);
    throw new Error("Failed to delete score");
  }
}
