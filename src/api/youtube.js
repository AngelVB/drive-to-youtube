export const youtubeApi = {
  async listChannels(token) {
    const res = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,id&mine=true&maxResults=50",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.items || [];
  },

  async initResumableUpload(token, blob, meta) {
    const res = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Upload-Content-Type": blob.type || "video/*",
          "X-Upload-Content-Length": String(blob.size),
        },
        body: JSON.stringify({
          snippet: { title: meta.title, description: meta.description, categoryId: "22" },
          status:  { privacyStatus: meta.privacy },
        }),
      }
    );

    if (!res.ok) {
      let reason = null, message = null;
      try {
        const err = await res.json();
        reason  = err?.error?.errors?.[0]?.reason;
        message = err?.error?.message;
      } catch (_) {}
      throw { status: res.status, reason, message };
    }

    return res.headers.get("Location");
  },

  uploadBlob(uploadUrl, blob, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", blob.type || "video/*");
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
        else reject({ status: xhr.status, text: xhr.responseText.slice(0, 120) });
      };
      xhr.onerror = () => reject({ network: true });
      xhr.send(blob);
    });
  },
};
