
export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { action, accessToken } = JSON.parse(event.body);
    
    if (!accessToken) {
      return { statusCode: 401, body: JSON.stringify({ error: "Access Token is required" }) };
    }

    if (action === 'list') {
      const researchMimeTypes = [
        "mimeType = 'application/vnd.google-apps.document'",
        "mimeType = 'audio/mpeg'",
        "mimeType = 'audio/wav'",
        "mimeType = 'audio/x-wav'",
        "mimeType = 'audio/webm'",
        "mimeType = 'audio/mp4'",
        "mimeType = 'audio/x-m4a'",
        "mimeType = 'text/plain'"
      ].join(" or ");

      const query = `(${researchMimeTypes}) and trashed = false`;
      const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&pageSize=50&fields=files(id,name,mimeType,size,thumbnailLink,modifiedTime)&orderBy=modifiedTime desc`;
      
      const res = await fetch(url, { 
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: AbortSignal.timeout(15000)
      });
      
      if (!res.ok) throw new Error(`Drive Access Denied (${res.status})`);
      const data = await res.json();
      
      const excludedExtensions = [
        '.pdf', '.dat', '.cfg', '.inf', '.ini', '.log', '.bin', 
        '.tmp', '.sys', '.dll', '.exe', '.bat', '.sh',
        '.json', '.xml', '.env', '.gitignore', '.lock', '.manifest', '.msi'
      ];

      const filteredFiles = (data.files || []).filter((file: any) => {
        const name = file.name.toLowerCase();
        const isTechnicalNoise = excludedExtensions.some(ext => name.endsWith(ext));
        const isSystemFile = name.includes('hardwareid') || name.includes('driver') || name.includes('setup') || name.includes('firmware');
        return !isTechnicalNoise && !isSystemFile;
      });
      
      return { 
        statusCode: 200, 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(filteredFiles) 
      };
    }

    return { statusCode: 400, body: JSON.stringify({ error: "Action invalid" }) };
  } catch (error: any) {
    console.error("[Drive Bridge Error]", error.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message || "Cloud Bridge Failure" }) 
    };
  }
};
