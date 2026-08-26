"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function updateVideo(formData: FormData) {
  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const tips = getString(formData, "tips");

  if (!id) {
    redirect("/videos");
  }

  if (!title || !description || !tips) {
    redirect(`/videos/${id}/edit?error=missing-fields`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("videos")
    .update({ title, description, tips })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Supabase video update failed", error);
    redirect(`/videos/${id}/edit?error=update`);
  }

  revalidatePath(`/videos/${id}`);
  revalidatePath("/videos");
  redirect(`/videos/${id}`);
}

export async function deleteVideo(formData: FormData) {
  const id = getString(formData, "id");

  if (!id) {
    redirect("/videos");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: video } = await supabase
    .from("videos")
    .select("video_path,user_id")
    .eq("id", id)
    .single();

  if (!video || video.user_id !== user.id) {
    redirect("/videos");
  }

  const { data: images } = await supabase.from("video_images").select("image_path").eq("video_id", id);

  const imagePaths = (images ?? []).map((image) => image.image_path);

  await supabase.from("video_images").delete().eq("video_id", id);

  const { error: deleteError } = await supabase.from("videos").delete().eq("id", id).eq("user_id", user.id);

  if (deleteError) {
    console.error("Supabase video delete failed", deleteError);
    redirect(`/videos/${id}/edit?error=delete`);
  }

  await Promise.all([
    supabase.storage.from("videos").remove([video.video_path]),
    imagePaths.length > 0 ? supabase.storage.from("images").remove(imagePaths) : Promise.resolve(null),
  ]);

  revalidatePath("/videos");
  redirect("/videos");
}
