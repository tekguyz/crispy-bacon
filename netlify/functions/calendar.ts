
export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { accessToken } = JSON.parse(event.body);
    
    if (!accessToken) {
      return { statusCode: 400, body: JSON.stringify({ error: "Access Token is required. Please re-authenticate." }) };
    }

    // Fetch events starting from 1 hour ago to catch meetings currently in progress
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const timeMax = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${oneHourAgo}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
    const tasksUrl = `https://tasks.googleapis.com/tasks/v1/lists/@default/tasks?showCompleted=false&dueMin=${oneHourAgo}&dueMax=${timeMax}`;

    const [calendarRes, tasksRes] = await Promise.all([
      fetch(calendarUrl, { headers: { Authorization: `Bearer ${accessToken}` } }),
      fetch(tasksUrl, { headers: { Authorization: `Bearer ${accessToken}` } }).catch(() => null)
    ]);

    // Handle Google Calendar Errors (API Disabled or Scopes Missing)
    if (!calendarRes.ok) {
      const err = await calendarRes.json();
      const status = calendarRes.status;
      
      let message = "Google Workspace connection refused.";
      if (status === 403) message = "Permission Denied: Ensure 'Google Calendar API' is enabled in GCP and you have re-signed in.";
      if (status === 401) message = "Session Expired: Please Sign Out and Sign In again.";
      
      return { 
        statusCode: status, 
        body: JSON.stringify({ error: err.error?.message || message, code: status }) 
      };
    }

    const calendarData = await calendarRes.json();
    const tasksData = tasksRes?.ok ? await tasksRes.json() : { items: [] };

    const tasks = (tasksData.items || []).map((t: any) => ({
      title: t.title,
      due: t.due ? new Date(t.due).getTime() : null
    }));

    const events = (calendarData.items || []).map((item: any) => {
      const start = new Date(item.start?.dateTime || item.start?.date).getTime();
      const linkedTasks = tasks
        .filter((t: any) => t.due && Math.abs(t.due - start) < 2 * 60 * 60 * 1000)
        .map((t: any) => t.title);

      return {
        id: item.id,
        summary: item.summary || "Untitled Event",
        start: item.start?.dateTime || item.start?.date,
        end: item.end?.dateTime || item.end?.date,
        location: item.location,
        description: item.description,
        linkedTasks: linkedTasks.length > 0 ? linkedTasks : undefined
      };
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(events),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal Server Error" }),
    };
  }
};
