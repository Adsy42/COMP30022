// src/lib/api.ts
const API_BASE = "http://localhost:5000";
const USE_MOCK = true;

function delay(ms: number) { return new Promise(res => setTimeout(res, ms)); }

// ---- Generic HTTP helper
async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

// ---- Public API

export async function startChat() {
  if (USE_MOCK) {
    await delay(350);
    return { chat_id: "chat_mock_123" };
  }
  return api<{ chat_id: string }>("/chats", { method: "POST" });
}

export async function getTemplate(template: "common" | "simple" | "complex") {
  if (USE_MOCK) {
    await delay(250);

    if (template === "common") {
      return [
        { id: "q_name",    question: "What is your name?",           type: "freeform", options: null },
        { id: "q_role",    question: "What is your role?",            type: "single",
          options: [{ label: "Researcher" }, { label: "Sponsor" }, { label: "Administrator" }] },
        { id: "q_faculty", question: "Which faculty are you in?",     type: "single",
          options: [{ label: "MDHS" }, { label: "Engineering" }, { label: "Science" }] },
      ];
    }

    if (template === "simple") {
      // Short, realistic “simple” path (no uploads in MVP)
      return [
        {
          id: "q_simple_topic",
          question: "Which topic best matches your question?",
          type: "single",
          options: [{ label: "Templates" }, { label: "Signatures" }, { label: "Turnaround time" }]
        },
        {
          id: "q_simple_details",
          question: "Add any brief details to help us answer.",
          type: "freeform",
          options: null
        }
      ];
    }

    // complex
    return [
      {
        id: "q_stage",
        question: "What’s the stage of your query?",
        type: "single",
        options: [{ label: "Pre-Award" }, { label: "Post-Award" }]
      },
      {
        id: "q_topics",
        question: "Which topics apply? (select all that apply)",
        type: "multi",
        options: [{ label: "Indemnity" }, { label: "IP" }, { label: "Data sharing" }]
      },
      {
        id: "q_query",
        question: "What is your complex query? (You may upload attachments)",
        type: "freeform",
        options: null
      }
    ];
  }

  return api(`/templates?template=${template}`, { method: "GET" });
}

export async function submitAnswers(chat_id: string, body: any) {
  if (USE_MOCK) {
    await delay(200);
    return { ok: true };
  }
  return api(`/chats/${chat_id}/answers`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function uploadFile(chat_id: string, file: File) {
  if (USE_MOCK) {
    await delay(200);
    return {
      fileId: `f_mock_${Math.random().toString(36).slice(2,8)}`,
      name: file.name, size: file.size, mime: file.type
    };
  }
  const fd = new FormData();
  fd.append("chat_id", chat_id);
  fd.append("file", file);
  const res = await fetch(`${API_BASE}/uploads`, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// ---- Finalize & Escalate
export type FinalizeResponse = {
  chat_id: string;
  status: "simple" | "complex";
  ai_response: string | null;
};

export async function finalize(
  chat_id: string,
  expected: "simple" | "complex"
): Promise<FinalizeResponse> {
  if (USE_MOCK) {
    await delay(400);
    return expected === "simple"
      ? {
          chat_id,
          status: "simple",
          ai_response:
            "Here’s the guidance: contracts under $10K may be signed by the department head. For exceptions, consult the policy sheet."
        }
      : {
          chat_id,
          status: "complex",
          ai_response: null
        };
  }
  // In prod we ignore `expected` and just call the real API
  return api<FinalizeResponse>(`/chats/${chat_id}/finalize`, { method: "POST" });
}

export type EscalateResponse = { ok: true } | { ok: false; error?: string };

export async function escalate(chat_id: string, reason?: string): Promise<EscalateResponse> {
  if (USE_MOCK) {
    await delay(400);
    return { ok: true };
  }
  return api<EscalateResponse>(`/escalations`, {
    method: "POST",
    body: JSON.stringify({ chat_id, escalate: true, reason }),
  });
}
