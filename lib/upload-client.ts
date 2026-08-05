export async function uploadImageFile(file: File, folder: string): Promise<string> {
  const payload = new FormData();
  payload.append("file", file);
  payload.append("folder", folder);

  const response = await fetch("/api/uploads/general", { method: "POST", body: payload });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Gagal upload file.");
  }

  const url = result?.data?.url ?? "";
  if (!url) {
    throw new Error("URL hasil upload kosong.");
  }
  return url;
}

export async function deleteImageByUrl(url: string): Promise<void> {
  try {
    await fetch("/api/uploads/general", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    // ignore deletion errors
  }
}
