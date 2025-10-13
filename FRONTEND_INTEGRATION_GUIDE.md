# Frontend Hardcoded Values & Backend Integration Guide

## 🔍 Hardcoded Values Found in Frontend

### 1. **Login Page** (`frontend/src/app/login/page.tsx`)

**Hardcoded Authentication:**
```typescript
// Line 23-26
if (email === 'admin@grants2contracts.example' && password === 'password') {
  router.push('/admin')
} else {
  throw new Error('Invalid credentials')
}
```

**What needs to change:**
- Replace with actual API call to `POST /login` endpoint
- Store JWT token in localStorage/sessionStorage
- Use token for subsequent authenticated requests

### 2. **Chat Page** (`frontend/src/app/chat/page.tsx`)

**Hardcoded Chat Messages:**
```typescript
// Lines 87-108 - Static chat bubbles
<ChatBubble role="bot" text="what's your name?" />
<ChatBubble role="user" text="Sarah Johnson" />
<ChatBubble role="bot" text="Thanks, Sarah. What's your email address? (required)" />
<ChatBubble role="user" text="sarah.johnson@unimelb.edu.au" />
<ChatBubble role="bot" text="Great — which Grants team are you from? (required)" />
<ChatBubble role="user" text="RDS" />
<ChatBubble role="bot" text="Got it, What's the stage of your query? (required)" />
// + Lorem ipsum test message
```

**Hardcoded Question Data:**
```typescript
// Line 46 - Currently uses hardcoded state
const [q_type, setQType] = useState<'freeform' | 'single' | 'multi'>('single')

// Line 117 - Hardcoded options
options={['Pre-Award', 'Post-Award', OTHER]}
```

**Comment indicating missing integration:**
```typescript
// Line 5: "WIP. Needs chat bubbles and API wiring."
```

### 3. **ChatInput Component** (`frontend/src/components/ChatInput.tsx`)

**Fake Bot Reply:**
```typescript
// Lines 76-79
// TODO: Remove this later. Fake bot reply after 1s → re-enable
setTimeout(() => {
  toggleOff()
}, 1000)
```

**What needs to change:**
- Remove timeout, replace with actual backend response handling
- Wait for real API response before re-enabling input

### 4. **Admin & Form Config Pages**

**Empty Stub Pages:**
- `frontend/src/app/admin/page.tsx` - Just renders "Admin page"
- `frontend/src/app/admin/form-config/page.tsx` - Just renders "Form page"

These need to be built out to use backend APIs.

## 🔌 Backend Endpoints to Integrate

### Public Endpoints (No Auth Required)

#### 1. **Get Templates**
```typescript
// GET /templates?template=common|simple|complex
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/templates?template=common`
)
const questions = await response.json()
// Returns array of Question objects with id, question, type, options
```

#### 2. **Create Chat Session**
```typescript
// POST /chats
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats`, {
  method: 'POST'
})
const { chat_id } = await response.json()
// Store chat_id for subsequent requests
```

#### 3. **Submit Answers**
```typescript
// POST /chats/{chat_id}/answers
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}/answers`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      template: 'common', // or 'simple' or 'complex'
      answers: [
        { q_id: 'q_name', ans: 'Sarah Johnson' },
        { q_id: 'q_role', ans: 'Researcher' }
      ],
      attachments: [] // optional file IDs
    })
  }
)
```

#### 4. **Upload File**
```typescript
// POST /uploads
const formData = new FormData()
formData.append('chat_id', chatId)
formData.append('file', fileObject)

const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads`, {
  method: 'POST',
  body: formData
})
const { fileId, name, size, mime } = await response.json()
```

#### 5. **Finalize Chat**
```typescript
// POST /chats/{chat_id}/finalize
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}/finalize`,
  {
    method: 'POST'
  }
)
const { chat_id, status, ai_response } = await response.json()
// status: 'simple' or 'complex'
// ai_response: string (optional, present for simple queries)
```

### Admin Endpoints (Require JWT Token)

#### 1. **Login**
```typescript
// POST /login
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
})
const { success, token } = await response.json()

if (success) {
  // Store token for authenticated requests
  localStorage.setItem('auth_token', token)
}
```

#### 2. **Authenticated Request Pattern**
```typescript
const token = localStorage.getItem('auth_token')

const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kpis`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

#### 3. **Get KPIs**
```typescript
// GET /kpis?start_time=01/09/2025&end_time=01/10/2025
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/kpis?start_time=01/09/2025&end_time=01/10/2025`,
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
)
const { total_queries, simple_queries, ai_resolved_queries } = await response.json()
```

#### 4. **Save Template**
```typescript
// POST /templates/save?template=common
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/templates/save?template=common`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([
      {
        id: 'q_name',
        question: 'What is your name?',
        type: 'freeform',
        options: null
      },
      // ... more questions
    ])
  }
)
```

## 📝 Implementation Checklist

### Chat Page Integration
- [ ] Fetch template questions from `GET /templates`
- [ ] Create chat session on page load with `POST /chats`
- [ ] Store `chat_id` in component state
- [ ] Replace hardcoded chat bubbles with dynamic message array
- [ ] Map template questions to ChoiceGroup options
- [ ] Submit answers via `POST /chats/{id}/answers`
- [ ] Implement file upload with `POST /uploads`
- [ ] Call `POST /chats/{id}/finalize` when user completes flow
- [ ] Display AI response from finalize endpoint
- [ ] Remove fake setTimeout in ChatInput

### Login Page Integration
- [ ] Replace hardcoded auth with `POST /login` API call
- [ ] Store JWT token in localStorage
- [ ] Add token expiration handling
- [ ] Redirect to admin dashboard on success
- [ ] Show proper error messages from API

### Admin Dashboard Integration
- [ ] Build out admin dashboard UI
- [ ] Fetch and display KPIs
- [ ] Create analytics charts/tables
- [ ] Add date range picker for analytics
- [ ] Implement Excel export download

### Form Configuration Integration
- [ ] Fetch current templates from `GET /templates`
- [ ] Build form editor UI
- [ ] Support adding/editing/removing questions
- [ ] Support nested follow-up questions
- [ ] Submit changes via `POST /templates/save`

### Email Configuration
- [ ] Add UI to update escalation email
- [ ] Integrate with `PUT /config/email-recipient`

## 🔐 Authentication Flow

```typescript
// 1. Login
const { success, token } = await login(username, password)
if (success) {
  localStorage.setItem('auth_token', token)
  router.push('/admin')
}

// 2. Authenticated Request
const makeAuthRequest = async (url: string, options = {}) => {
  const token = localStorage.getItem('auth_token')
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  })
}

// 3. Handle 401 Unauthorized
if (response.status === 401) {
  localStorage.removeItem('auth_token')
  router.push('/login')
}
```

## 🛠️ Recommended API Client Structure

Create `frontend/src/lib/api.ts`:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  // Public endpoints
  async getTemplates(template: 'common' | 'simple' | 'complex') {
    const response = await fetch(`${API_URL}/templates?template=${template}`)
    return response.json()
  }

  async createChat() {
    const response = await fetch(`${API_URL}/chats`, { method: 'POST' })
    return response.json()
  }

  async submitAnswers(chatId: string, data: any) {
    const response = await fetch(`${API_URL}/chats/${chatId}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async finalizeChat(chatId: string) {
    const response = await fetch(`${API_URL}/chats/${chatId}/finalize`, {
      method: 'POST'
    })
    return response.json()
  }

  // Auth endpoints
  async login(username: string, password: string) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    return response.json()
  }

  // Admin endpoints
  async getKPIs(startTime: string, endTime: string) {
    const response = await fetch(
      `${API_URL}/kpis?start_time=${startTime}&end_time=${endTime}`,
      { headers: this.getAuthHeaders() }
    )
    return response.json()
  }

  async saveTemplate(template: string, questions: any[]) {
    const response = await fetch(`${API_URL}/templates/save?template=${template}`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(questions)
    })
    return response.json()
  }
}

export const api = new ApiClient()
```

## 🌐 Environment Setup

Create `frontend/.env.local` (copy from `.env.local.example`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
```

**Note:** Backend endpoints don't use `/api` prefix, they're at root level:
- ❌ `http://localhost:5000/api/templates` 
- ✅ `http://localhost:5000/templates`

## 🧪 Testing Integration

1. Start backend: `docker-compose up backend mongo`
2. Seed database: `docker-compose exec backend python seed_db.py`
3. Start frontend: `docker-compose up frontend`
4. Test endpoints in browser DevTools Network tab

## 📊 Backend Data Structures

### Question Object
```typescript
interface Question {
  id: string
  question: string
  type: 'freeform' | 'single' | 'multi'
  options?: Option[] | null
}

interface Option {
  label: string
  followUp?: Question | null
}
```

### Answer Object
```typescript
interface Answer {
  q_id: string
  ans: string | string[]  // string for single/freeform, array for multi
}
```

## 🎯 Priority Order

1. **High Priority** (Core functionality)
   - Chat flow integration (create chat, submit answers, finalize)
   - Template fetching and rendering
   - Login authentication

2. **Medium Priority** (Admin features)
   - Admin dashboard with KPIs
   - Template editor/configuration

3. **Low Priority** (Enhancements)
   - Analytics charts
   - Excel export
   - Email configuration UI

---

**Next Step:** Create `frontend/src/lib/api.ts` with the API client class above and start replacing hardcoded values with real API calls!
