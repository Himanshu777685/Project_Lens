# PROJECT_CONTEXT.md

> This document is the source of truth for the ProjectLens project. All future AI coding agents (Claude, Codex, or others) MUST read this file before making any changes to the repository.

---

## 1. PROJECT IDENTITY

| Field | Value |
|---|---|
| Project name | **ProjectLens** |
| Hackathon | **ArchScale Guild Intern Technology Hackathon 2026** |
| Selected challenge | **AS-02 — Communication: Make project communication intelligent, not overwhelming.** |
| Submission deadline | **Midnight IST, 12 September 2026** |
| Category | AI-powered project communication intelligence system |

---

## 2. PRODUCT VISION

ProjectLens turns fragmented project communication into a **traceable project truth**.

```text
Messy project communication
        ↓
AI understanding
        ↓
Project intelligence
        ↓
Project truth
        ↓
Source traceability
```

The product identifies:

- what changed
- what was decided
- what needs action
- what is currently blocked
- what conflicts with other information
- what risks exist
- what dependencies exist

**This is NOT a generic chatbot and NOT a generic project management platform.**

---

## 3. CORE MVP WORKFLOW

```text
Add/paste communication
        ↓
Communication Inbox
        ↓
"Make Sense of This"
        ↓
AI analysis
        ↓
Structured project intelligence
        ↓
Project Truth
        ↓
View sources / traceability
```

Communication is **manually entered** for the MVP — no WhatsApp/Gmail/Outlook integration.

Each communication carries conceptual metadata:

- source
- sender
- date
- content

Possible sources:

- WhatsApp
- Email
- Meeting
- Site
- Supplier
- Drawing
- Voice Note
- Other

---

## 4. DEMO SCENARIO

The application should demonstrate a scenario similar to this (illustrative, not hardcoded):

1. **Client:** "Use the previous marble specification."
2. **Supplier:** "Shade 312 from the previous specification is currently unavailable. We can provide shade 314 instead."
3. **Contractor:** "Need clarification regarding the staircase railing."
4. **Architect:** "REV 05 uploaded. Staircase railing detail updated."
5. **Client:** "Approved everything except the master bathroom."

Expected intelligence extraction (examples of intended behavior, not fixed outputs):

- **Decision:** previous marble specification requested
- **Conflict:** requested marble shade is unavailable
- **Task:** find an alternative marble shade and obtain approval
- **Pending item:** master bathroom approval
- **Change:** drawing revision changed to REV 05
- **Risk:** procurement may be delayed
- **Dependency:** alternative material → approval → procurement → installation

---

## 5. CORE DIFFERENTIATOR

> **AI explains the project, but the original communication remains the source of truth.**

Every important AI-generated insight must be traceable back to the communication record(s) that support it.

```text
Insight
   ↓
View Source
   ↓
Original Communication
```

Rules:

- Do NOT expose or claim to expose hidden chain-of-thought.
- DO provide concise evidence/rationale plus a link to the original source communication.

---

## 6. MVP PRIORITIES

### MUST HAVE

1. Communication input
2. Communication inbox
3. AI analysis
4. Structured project intelligence
5. Decisions
6. Tasks
7. Changes
8. Risks
9. Conflict detection
10. Source traceability
11. Project Truth dashboard

**Especially important:**

- What changed?
- Conflict detection
- Source traceability

### NICE TO HAVE (only if the core system works)

- Dependencies
- Search
- Filters
- Multiple projects
- Voice input

---

## 7. OUT OF SCOPE

Do **not** prioritize or build:

- Real WhatsApp integration
- Gmail integration
- Outlook integration
- Meta APIs
- Real-time collaboration
- Full project management suite
- Complex role/permission systems
- Payments
- Notifications
- Calendar
- Generic chatbot
- Mobile application
- Microservices
- Kubernetes
- Advanced enterprise infrastructure
- Unnecessary analytics
- Unrelated features

The project must stay focused on **communication intelligence**.

---

## 8. TECHNOLOGY STACK

**Frontend**
- React
- TypeScript
- Tailwind CSS

**Backend**
- Node.js
- Express
- TypeScript

**Database**
- MongoDB

**ODM**
- Mongoose

**AI**
- Gemini API

**Version control**
- Git
- GitHub

The architecture should stay simple and appropriate for a hackathon timeline.

---

## 9. ARCHITECTURE

```text
React Frontend
      ↓
Express REST API
      ↓
Backend Services
      ↓
MongoDB / Mongoose
      ↘
       Gemini API
```

### Responsibilities

**Frontend**
- UI
- User interaction
- Displaying project intelligence

**Backend**
- Validation
- Business logic
- AI orchestration
- Persistence
- API handling
- Error handling

**Gemini**
- Analyze communication
- Extract structured intelligence

### Important Constraint

**The LLM must NOT directly mutate the database.**

Preferred flow:

```text
Communication
      ↓
Gemini
      ↓
Structured JSON
      ↓
Backend validation
      ↓
Application logic
      ↓
MongoDB
```

---

## 10. CONCEPTUAL DATA ENTITIES

The following entities are documented conceptually only. Detailed schemas will be designed in a later phase (Phase 2).

- Project
- Communication
- Analysis
- Decision
- Task
- Change
- Risk
- Conflict
- Dependency

---

## 11. PRODUCT AREAS

### 11.1 Project Dashboard
- Project overview
- Communication count
- Task count
- Decision count
- Conflict count
- Risk count
- Recent activity

### 11.2 Communication Inbox
- List of communications
- Source
- Sender
- Date
- Excerpt
- "Add Communication" action
- "Make Sense of This" action

### 11.3 Add Communication
- Source selection
- Sender
- Date
- Communication content
- Save/Add action

### 11.4 AI Processing
Visually communicate processing stages:
- Reading communications
- Identifying decisions
- Extracting tasks
- Detecting changes
- Checking conflicts
- Finding dependencies
- Building project truth

### 11.5 Project Truth
Organized into:
- Overview
- Decisions
- Tasks
- Changes
- Risks
- Conflicts
- Dependencies

### 11.6 Source Traceability
- Every important insight links back to its original communication source.

---

## 12. DEVELOPMENT PRINCIPLES

Priority order:

1. Core functionality
2. Reliability
3. Traceability
4. Clear UX
5. Demo quality
6. Simplicity

Avoid unnecessary engineering complexity. The goal is a **convincing functional prototype**, not production-scale infrastructure.

---

## 13. AI AGENT GOVERNANCE

```text
Owner: Himanshu Kumar
        ↓
Project Lead: ChatGPT
        ↓
Implementation Engineers:
Claude / Codex / other AI tools
```

- The Owner has final authority.
- AI agents must NOT independently redefine the architecture or product scope.
- AI agents may suggest improvements, but implementation must follow the approved project direction.

---

## 14. MULTI-AGENT SAFETY RULES

Whenever an AI coding agent is given access to the repository, it must:

1. Inspect the existing project before modifying anything.
2. Read `PROJECT_CONTEXT.md`.
3. Check the current Git status.
4. Avoid overwriting existing work blindly.
5. Avoid creating duplicate implementations.
6. Avoid introducing frameworks without approval.
7. Follow the established architecture.
8. Make one meaningful feature at a time.
9. Test changes before declaring them complete.
10. Report:
    - Files changed
    - Functionality implemented
    - Tests performed
    - Unresolved issues

Agents must not redesign unrelated parts of the application.

---

## 15. DEVELOPMENT ROADMAP

```text
PHASE 0  — Project definition                COMPLETE
PHASE 1  — Repository + project contract     COMPLETE
PHASE 2  — Database                          COMPLETE
  PHASE 2A — Database architecture           COMPLETE
  PHASE 2B — Mongoose model implementation   COMPLETE (verified)
PHASE 3  — Backend API                       CURRENT
  PHASE 3A — Backend foundation               COMPLETE
  PHASE 3B — Project API                     COMPLETE
  PHASE 3C — Communication API               COMPLETE
  PHASE 3D — AnalysisRun API                 COMPLETE
  PHASE 3E — Insight API                     COMPLETE
PHASE 4  — Frontend foundation               COMPLETE
PHASE 5  — Communication Inbox                COMPLETE
PHASE 6  — Gemini integration
PHASE 7  — Project Intelligence
PHASE 8  — Conflict + Change detection
PHASE 9  — Source Traceability
PHASE 10 — UI/UX polish
PHASE 11 — Testing
PHASE 12 — Deployment
PHASE 13 — Documentation + Demo
PHASE 14 — Final submission
```

---

## 15A. PHASE 6A — AI ANALYSIS CONTRACT

**Status: DOCUMENTED — no Gemini integration is implemented.**

Phase 6A defines the boundary between the future AI adapter and the
existing ProjectLens backend. It does not add an endpoint, change a
schema, execute an `AnalysisRun`, call Gemini, or create `Insight`
documents.

### 15A.1 Analysis input

The backend will build one ordered input envelope from the selected
communications referenced by `AnalysisRun.communicationIds`. Every
communication in the envelope must belong to the `AnalysisRun.projectId`.
The Gemini payload contains only the fields needed to interpret and trace
the source:

```json
{
  "communications": [
    {
      "id": "communication-object-id-1",
      "source": "whatsapp",
      "sender": "Client",
      "date": "2026-09-10T09:00:00.000Z",
      "content": "Use the previous marble specification."
    },
    {
      "id": "communication-object-id-2",
      "source": "supplier",
      "sender": "Supplier",
      "date": "2026-09-10T11:30:00.000Z",
      "content": "Shade 312 from the previous specification is unavailable. We can provide shade 314 instead."
    }
  ]
}
```

The backend retains `projectId` and `analysisRunId` as server-side
context; neither is an AI-controlled output field. For each
communication, `id`, `source`, `sender`, `date`, and `content` are
required. The communication `metadata` field is not part of the contract
by default; future work may explicitly define a safe, necessary subset.
The backend must preserve the selected set and its IDs exactly, because
the IDs are the only source references the AI is permitted to emit.

Multiple communications are sent together so the AI can relate chronology,
responses, contradictions, approvals, and dependencies. The AI must not
infer facts from communications outside this envelope.

### 15A.2 Candidate output

Gemini must return valid JSON with exactly one top-level object:

```json
{
  "insights": [
    {
      "type": "task",
      "title": "Obtain approval for replacement marble shade",
      "description": "Confirm whether shade 314 may replace unavailable shade 312 before procurement.",
      "rationale": "The supplier reports shade 312 is unavailable and offers shade 314.",
      "status": "open",
      "severity": "high",
      "assignee": "Project team",
      "dueDate": "2026-09-14T00:00:00.000Z",
      "sourceCommunicationIds": [
        "communication-object-id-1",
        "communication-object-id-2"
      ],
      "dependsOnInsightIds": []
    }
  ]
}
```

The `insights` array is required and may be empty when there is not enough
evidence for a reliable candidate. Each candidate has these **required**
fields:

- `type`: exactly `decision`, `task`, `change`, `risk`, or `conflict`.
- `title`: non-empty string.
- `description`: non-empty string describing only supported project
  information.
- `status`: a status valid for the selected `type`.
- `sourceCommunicationIds`: a non-empty array of communication ID
  strings.

These fields are **optional**:

- `rationale`: concise evidence-based explanation; it is not hidden
  chain-of-thought.
- `severity`: exactly `low`, `medium`, or `high`.
- `assignee`: non-empty person/team string only when supported by the
  communications.
- `dueDate`: an ISO-8601 date string only when supported by the
  communications; the backend converts it to a `Date`.
- `dependsOnInsightIds`: an array of existing Insight ID strings when a
  dependency on already persisted same-project Insights is supported.
  The AI must not invent IDs. An empty array is acceptable.

The names intentionally match the existing `Insight` model, including
`dependsOnInsightIds` (not a new `dependentInsightIds` field). The backend,
not Gemini, supplies `projectId` and `analysisRunId` when a candidate is
persisted.

The type-specific status contract is:

| Type | Allowed statuses |
| --- | --- |
| `decision` | `proposed`, `confirmed`, `rejected` |
| `task` | `open`, `in_progress`, `completed` |
| `change` | `recorded` |
| `risk` | `open`, `mitigated` |
| `conflict` | `open`, `resolved` |

AI-proposed statuses are suggestions only. The backend rejects any
candidate whose status is not allowed for its type. A conflict should
normally cite at least two communications when the evidence is
contradictory, consistent with the project traceability rules.

### 15A.3 Source traceability and project boundary

Every candidate must include at least one `sourceCommunicationIds` value.
Every value must:

1. be a valid communication ID;
2. occur in the exact `AnalysisRun.communicationIds` input set; and
3. resolve to a Communication whose `projectId` equals the
   `AnalysisRun.projectId`.

The backend rejects missing arrays, empty arrays, malformed IDs, unknown
IDs, IDs not selected for the run, and IDs belonging to another project.
It also rejects an `AnalysisRun` whose selected communications are
missing, mixed-project, or otherwise inconsistent before calling Gemini.
All persisted Insights receive the same `projectId` as the AnalysisRun.
`analysisRunId` is always the actual run being processed. The AI cannot
select or override either ownership field, and `dependsOnInsightIds` must
resolve only to existing Insights in that same project.

### 15A.4 AI and backend responsibilities

Gemini is responsible only for understanding the supplied communications,
identifying possible decisions, tasks, changes, risks, or conflicts,
providing concise evidence-based rationale where useful, and returning
supporting communication IDs.

The backend is authoritative. It is responsible for loading the selected
records, enforcing project ownership, parsing and validating JSON,
validating required fields and enums, validating type/status combinations,
validating dates and optional values, validating source traceability and
dependencies, rejecting duplicates or unsupported values, and deciding
whether any candidate may be persisted. The LLM never writes to MongoDB
and is never treated as Project Truth.

### 15A.5 Ambiguity and fabrication

When the communications do not provide enough evidence, Gemini should
omit the candidate and return no insight for that claim. It must not
fabricate dates, people, approvals, decisions, risks, responsibilities,
material changes, or dependencies. Uncertainty is not evidence: a
candidate with unsupported assertions must be rejected or discarded by
the backend rather than upgraded into an Insight.

### 15A.6 Output validation strategy

The future implementation should validate in this order:

1. Parse the provider response as JSON; reject empty, malformed, or
   unexpected top-level shapes.
2. Validate each candidate against a strict allow-list schema and reject
   missing required fields, wrong JSON types, unknown fields if strict
   mode is enabled, invalid enums, invalid dates, blank strings, and
   unsupported optional values.
3. Validate source IDs against the run input set and database project
   ownership.
4. Validate dependency IDs against existing same-project Insights and
   prevent self-reference.
5. Normalize strings and IDs, then reject duplicate candidates within the
   response (same type plus normalized title and source set) and any
   duplicate that conflicts with an already persisted result for the same
   run.
6. Only after all candidates pass validation may application logic create
   Insights and update `AnalysisRun.insightIds`.

Validation failure is a failed run, not a successful run with
partially-trusted output. Mongoose validation and the existing Insight
API rules remain a final persistence guard.

### 15A.7 AnalysisRun lifecycle and failures

The existing lifecycle remains the only lifecycle:
`pending` → `processing` → `completed` or `failed`.

- Creation stores `pending` and does not call Gemini.
- Processing claims the run and changes it to `processing`.
- A valid response, including an empty `insights` array, followed by
  successful persistence changes it to `completed`, records persisted
  Insight IDs, and sets `completedAt`.
- A Gemini error, timeout, malformed response, validation failure, or
  persistence failure changes it to `failed` and records a useful
  `errorMessage`; it must not be reported as completed.

Persistence should be all-or-nothing for a run. The future implementation
should use a MongoDB transaction where available, or an equivalent
rollback/cleanup strategy, so a database failure cannot leave an
AnalysisRun pointing at an incomplete set of Insights. Retrying a failed
run must be an explicit future policy and must not silently duplicate
Insights.

### 15A.8 Phase boundary

Phase 6A is documentation only. Phase 6B should implement the smallest
backend orchestration that consumes a pending AnalysisRun, constructs this
input envelope, calls Gemini through a server-side adapter, validates the
strict candidate response, persists only validated Insights, and updates
the AnalysisRun lifecycle without changing the four-collection schema or
adding cross-project behavior.

---

## 16. DEADLINE STRATEGY

**Hard target: 12 September 2026, midnight IST.**

Development prioritizes the smallest complete end-to-end workflow.

| Date | Focus |
|---|---|
| Sept 8 | Foundation, project contract, architecture |
| Sept 9 | Database, backend, communication input/inbox |
| Sept 10 | Gemini integration, structured intelligence |
| Sept 11 | Conflict detection, change detection, source traceability, UI polish |
| Sept 12 | Testing, deployment, documentation, demo video, submission |

**Feature creep must be avoided at all costs.**

---

## 17. PHASE 2B — DATABASE MODEL IMPLEMENTATION

**Status: COMPLETE**

### Implemented Mongoose models

- `Project`
- `Communication`
- `AnalysisRun`
- `Insight`

### Implementation details

- Built with TypeScript + Mongoose.
- Four collections/models total, exactly as defined in Phase 2A — no additional collections were introduced.
- `Insight` uses one unified schema representing all five intelligence types: decision, task, change, risk, conflict.
- Type-specific `Insight` status validation is implemented (each type only accepts its own approved status values).
- `sourceCommunicationIds` is required on every `Insight` and must contain at least one `Communication` ID, preserving the source-traceability principle from Section 5.
- `dependsOnInsightIds` is supported on `Insight` for representing dependency relationships, without a separate Dependency collection.
- ObjectId references are configured between related models (`Communication → Project`, `AnalysisRun → Project`/`Communication`, `Insight → Project`/`AnalysisRun`/`Communication`/`Insight`).
- The approved database indexes from Phase 2A are implemented.

### Verification

- `server/scripts/verifyModels.ts` was added.
- Model validation was tested in memory using Mongoose's `.validateSync()`, without requiring a live MongoDB connection. MongoDB connectivity itself was not tested as part of this verification.
- **21 verification checks passed, 0 failed.**

**Verification command:**

```bash
npm run verify:models
```

**Verification result:**

```text
21 passed, 0 failed
```

**Known warning (non-blocking):** the verification script currently produces a Mongoose deprecation warning because it uses `validateSync()`, which Mongoose has flagged for removal in a future major version in favor of the async `.validate()`. This is a warning tied to the verification script's approach, not a Phase 2B failure — it did not cause any verification check to fail.

---

## 18. PHASE 3 — BACKEND API IMPLEMENTATION

### Phase 3A — Backend Foundation

**Status: COMPLETE**

Express app/server separation, environment configuration, MongoDB
connection, JSON/CORS middleware, health endpoint, 404 handling,
centralized error handling, and TypeScript scripts are implemented.

### Phase 3B — Project API

**Status: COMPLETE**

Implemented endpoints:

- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:id`
- `PATCH /api/projects/:id`
- `PATCH /api/projects/:id/archive`

Project validation, controlled updates, idempotent archive behavior, and
invalid/nonexistent ID handling are implemented.

### Phase 3C — Communication API

**Status: COMPLETE**

Implemented endpoints:

- `POST /api/projects/:projectId/communications`
- `GET /api/projects/:projectId/communications`
- `GET /api/communications/:id`

The API validates the parent project, source enum, sender, content, and
date. It keeps communications scoped to their project and returns
project communications newest first.

### Phase 3D — AnalysisRun API

**Status: COMPLETE**

Implementation files:

- `server/controllers/analysis.controller.ts`
- `server/routes/analysis.routes.ts`
- `server/routes/index.ts`

Implemented endpoints:

- `POST /api/projects/:projectId/analysis-runs`
- `GET /api/projects/:projectId/analysis-runs`
- `GET /api/analysis-runs/:id`

The create endpoint validates the project, requires a non-empty
`communicationIds` array, validates and resolves every communication,
enforces project ownership, and always stores new runs with
`status: "pending"`. Client-supplied status values are ignored.

Phase 3D does not call Gemini and does not create Insight documents.
It uses the existing models, `AppError`, centralized error handling,
and direct controller-to-model access. No new collection, repository
layer, or unnecessary service abstraction was introduced.

Verification:

- `npm run typecheck` passed.
- `npm run verify:models` passed with 21 checks passed and 0 failed.
- The project owner completed local server/Postman verification.

### Phase 3E — Insight API

**Status: COMPLETE**

Implementation files:

- `server/controllers/insight.controller.ts`
- `server/routes/insight.routes.ts`
- `server/routes/index.ts`

Implemented endpoints:

- `POST /api/projects/:projectId/insights`
- `GET /api/projects/:projectId/insights`
- `GET /api/insights/:id`

The create endpoint takes `projectId` only from the URL, verifies the
parent Project and AnalysisRun, enforces AnalysisRun project ownership,
and validates every source Communication and dependency Insight against
the same Project. It enforces the approved Insight types and
type-specific statuses, required title/description/source fields, and
optional rationale, assignee, due date, severity, and dependency fields.

The project-scoped list endpoint returns only that Project's Insights,
sorted newest first by `createdAt`. The individual lookup validates the
Insight ID and returns 404 when the Insight does not exist.

Phase 3E uses the existing Insight model, `AppError`, centralized error
handling, and direct controller-to-model access. It does not add Gemini
calls, authentication, pagination, filtering, repositories, services,
new models, or automatic status transitions.

Verification:

- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run verify:models` passed with 21 checks passed and 0 failed.
- The model verification script emits the existing non-blocking
  Mongoose `validateSync()` deprecation warning.
- No live server/Postman verification was performed for Phase 3E.

## 19. CURRENT PROJECT STATE

- Database architecture is **approved** (Phase 2A).
- Mongoose model layer is **implemented** (Phase 2B).
- Model verification is **passing** (21/21 checks, 0 failures).
- Backend foundation, Project API, Communication API, AnalysisRun API,
  and Insight API are implemented (Phases 3A–3E).
- The Phase 4 frontend foundation is implemented in `client/`.
- The Phase 5 Communication Inbox is implemented and runtime-verified.
- The next planned area is Phase 6 Gemini integration.
- Gemini integration, automated API testing, deployment, and final
  documentation remain incomplete.
- Any new agent must inspect the actual repository and confirm the
  current Git status before changing code.

### Phase 4 — Frontend Foundation

**Status: COMPLETE**

The previously empty `client/` directory now contains a minimal
React/TypeScript/Vite frontend foundation:

- Responsive application shell with header/navigation and main content area.
- Routing for the project list and project entry point.
- Environment-driven API base URL via `VITE_API_BASE_URL`.
- Centralized typed request utility for Projects and the future
  Communications, AnalysisRuns, and Insights API surfaces.
- Shared backend resource types for frontend use.
- Minimal reusable loading and error status presentation.

This phase does not add Gemini, Communication Inbox, Project Truth,
AI analysis, fake insights, authentication, or new backend architecture.

Verification:

- `npm install` completed with 0 vulnerabilities.
- `npm run typecheck` passed in `client/`.
- `npm run build` passed in `client/`.
- Vite served the application successfully with HTTP 200.
- With a running backend and configured `VITE_API_BASE_URL`, the browser
  loaded the real `/api/projects` response and rendered the project list.

### Phase 5 — Communication Inbox

**Status: COMPLETE**

The project workspace now uses the existing Communication API to load
and display real project communications and to create new records.

Implemented:

- Project workspace header with project name, description, status, and
  communication count.
- Communication list sorted by the existing backend date ordering.
- Human-readable source, sender, date, and raw content display.
- Add Communication form with the exact supported source values:
  `whatsapp`, `email`, `meeting`, `site`, `supplier`, `drawing`,
  `voice_note`, and `other`.
- Frontend validation for source, sender, date, and non-blank content.
- Submitting state, backend error display, retry action, empty state, and
  refresh-after-create behavior.
- Meeting and voice-note content are treated as user-provided text or
  transcript content; no audio processing is performed.

Runtime verification:

- Real communications loaded from MongoDB through the existing API.
- A real meeting communication was created through the UI.
- The new communication appeared immediately in the inbox.
- Browser reload confirmed the communication remained persisted.
- No fake or mock communication data was used.

Completeness patch:

- The Projects page now exposes the existing `POST /api/projects`
  capability through a minimal Create Project form.
- The form uses only the supported `name` and optional `description`
  fields, validates the required name, refreshes the list after creation,
  and displays the new project without a browser reload.
- Runtime verification confirmed a project could be created through the
  UI, opened into the Communication Inbox, and persisted after refresh.

---

*End of PROJECT_CONTEXT.md*