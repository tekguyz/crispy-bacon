
import { CalendarEvent } from '../types';
import { DriveFile } from '../store/types';

/**
 * GOOGLE WORKSPACE BRIDGE
 * Handles the secure communication with Google APIs via Netlify Functions.
 */

export const getCalendarEvents = async (accessToken: string): Promise<CalendarEvent[]> => {
  const response = await fetch("/.netlify/functions/calendar", { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ accessToken }),
    signal: AbortSignal.timeout(15000)
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Calendar Sync Failed");
  }
  
  return await response.json();
};

export const listDriveFiles = async (accessToken: string): Promise<DriveFile[]> => {
  const response = await fetch("/.netlify/functions/drive", { 
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ action: 'list', accessToken }),
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Drive Access Failed");
  }

  return await response.json();
};

export const downloadDriveFile = async (fileId: string, accessToken: string, mimeType?: string): Promise<Blob | string> => {
  let url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  
  // Handle Google Docs export
  if (mimeType === 'application/vnd.google-apps.document') {
    url = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`;
  }

  const response = await fetch(url, { 
    headers: { Authorization: `Bearer ${accessToken}` } 
  });

  if (!response.ok) throw new Error("File Download Blocked");

  if (mimeType === 'application/vnd.google-apps.document') {
    return await response.text();
  }
  
  return await response.blob();
};