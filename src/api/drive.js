export const driveApi = {
  async listVideos(token) {
    let all = [], pageToken = null;
    do {
      const params = new URLSearchParams({
        q: "mimeType contains 'video/' and trashed = false",
        fields: "nextPageToken,files(id,name,size,thumbnailLink,createdTime)",
        pageSize: "50",
        orderBy: "createdTime desc",
      });
      if (pageToken) params.set("pageToken", pageToken);

      const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      all = [...all, ...(data.files || [])];
      pageToken = data.nextPageToken;
    } while (pageToken);
    return all;
  },

  async downloadBlob(token, fileId) {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw { status: res.status };
    return res.blob();
  },
};
