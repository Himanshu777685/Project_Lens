# ProjectLens --- AI Handoff / Current State

## Project Identity

ProjectLens is the user's hackathon project for the ArchScale Guild
Intern Technology Hackathon 2026, challenge AS-02 --- Communication:
"Make project communication intelligent, not overwhelming."

Hard submission deadline: 12 September 2026, midnight IST.

## Roles

-   User = Owner / final decision maker.
-   ChatGPT = Project Lead, reviewer, teacher, architecture guardian.
-   Claude / Codex / other AI agents = implementation engineers.
-   If Claude's usage limit is exhausted, another AI agent or ChatGPT
    can continue implementation.
-   No agent should silently redesign the architecture.

## Core Product

ProjectLens turns fragmented project communication into traceable
project truth.

Core workflow: Communication input → Communication Inbox → "Make Sense
of This" → Gemini analysis → structured intelligence → Project Truth →
source traceability.

Core differentiator: AI explains the project, but original communication
remains the source of truth. Insights must link back to source
communications.

## Demo Scenario

1.  Client: "Use the previous marble specification."
2.  Supplier: "Shade 312 from the previous specification is currently
    unavailable. We can provide shade 314 instead."
3.  Site/Contractor: "Need clarification regarding the staircase
    railing."
4.  Architect/Drawing: "REV 05 uploaded. Staircase railing detail
    updated."
5.  Client: "Approved everything except the master bathroom."

Expected intelligence: - Decision: previous marble specification
requested. - Conflict: requested marble shade unavailable. - Task: find
alternative marble shade and obtain approval. - Pending: master bathroom
approval. - Change: drawing revision changed to REV 05. - Risk:
procurement may be delayed. - Dependency: alternative material →
approval → procurement → installation.

## Approved Tech Stack

-   Frontend: React + TypeScript + Tailwind CSS
-   Backend: Node.js + Express + TypeScript
-   Database: MongoDB
-   ODM: Mongoose
-   AI: Gemini API
-   Git/GitHub

Architecture: React → Express REST API → backend services → MongoDB ↘
Gemini

Backend owns validation, business logic, AI orchestration, persistence,
and errors. LLM must not directly mutate the database. Preferred AI
flow: communication → Gemini → structured JSON → backend validation →
application logic → database.

## Approved Database Architecture

Four collections only: 1. Project 2. Communication 3. AnalysisRun 4.
Insight

Insight is unified with a type discriminator: - decision - task -
change - risk - conflict

Relationships: Project → Communications Project → AnalysisRuns Project →
Insights Insight → sourceCommunicationIds Insight → analysisRunId

Controlled statuses: - Decision: proposed \| confirmed \| rejected -
Task: open \| in_progress \| completed - Change: recorded - Risk: open
\| mitigated - Conflict: open \| resolved

Source traceability: - Insight.sourceCommunicationIds is required and
must contain at least one communication. - Conflict should reference 2+
communications. - Do not add a separate conflictingCommunicationIds
field. - No content-hash/immutability infrastructure for MVP; enforce
behavior at API level.

## Current Repository Structure

Project_Lens/ ├── client/ ├── server/ ├── PROJECT_CONTEXT.md ├──
README.md ├── .gitignore └── package.json

server/ ├── config/ │ ├── env.ts │ └── db.ts ├── controllers/ ├──
middleware/ │ ├── notFound.ts │ └── errorHandler.ts ├── models/ │ ├──
Project.ts │ ├── Communication.ts │ ├── AnalysisRun.ts │ └── Insight.ts
├── routes/ │ ├── health.routes.ts │ ├── project.routes.ts │ ├──
communication.routes.ts │ ├── analysis.routes.ts │ ├── insight.routes.ts
│ └── index.ts ├── scripts/ ├── app.ts ├── server.ts ├── .env ├──
.env.example ├── package.json └── tsconfig.json

## Phase Status --- Wide View

PHASE 0 --- Project Definition: COMPLETE PHASE 1 --- Repository +
Project Contract: COMPLETE PHASE 2 --- Database: COMPLETE - 2A Database
Architecture: COMPLETE - 2B Mongoose Models: COMPLETE PHASE 3 ---
Backend API: CURRENT - 3A Backend Foundation: COMPLETE - 3B Project API:
COMPLETE and locally tested - 3C Communication API: IMPLEMENTED;
typecheck issue was fixed; local verification should be considered
complete only after the user's final local/Postman confirmation - 3D
AnalysisRun API: COMPLETE and typechecked; live HTTP/Postman verification
confirmed by the project owner - 3E Insight API: COMPLETE; typecheck,
build, and model verification passed
PHASE 4 --- Frontend Foundation: COMPLETE PHASE 5 --- Communication
Inbox: COMPLETE PHASE 6 --- Gemini Integration: NOT STARTED PHASE 7
--- Project Intelligence: NOT STARTED PHASE 8 --- Conflict + Change
Detection: NOT STARTED PHASE 9 --- Source Traceability: NOT STARTED
PHASE 10 --- UI/UX Polish: NOT STARTED PHASE 11 --- Testing: NOT STARTED
PHASE 12 --- Deployment: NOT STARTED PHASE 13 --- Documentation + Demo:
NOT STARTED PHASE 14 --- Final Submission: NOT STARTED

## Phase 2 Verification

All four Mongoose models were implemented: - Project - Communication -
AnalysisRun - Insight

Model verification: 21 passed, 0 failed.

Verification used in-memory Mongoose validation. It did not test live
MongoDB connectivity.

Known non-blocking warning: Mongoose warns that validateSync() is
deprecated and recommends async validate(); this is test-only and should
not consume hackathon time unless needed.

## Phase 3A

Backend foundation implemented: - Express app/server separation -
environment config - MongoDB connection - JSON/CORS middleware - health
endpoint - 404 middleware - centralized error handling -
typecheck/build/dev scripts - clean route structure

Local server successfully connected to MongoDB and ran at:
http://localhost:5000

## Phase 3B --- Project API

Implemented: POST /api/projects GET /api/projects GET /api/projects/:id
PATCH /api/projects/:id PATCH /api/projects/:id/archive

Behavior: - create validates name - normal update only allows
name/description - status cannot be changed through normal PATCH -
archive is idempotent - invalid/nonexistent IDs handled

GET /api/projects was confirmed working and returned:
{"success":true,"data":\[\]} before projects were created.

Postman testing was completed by the user.

## Phase 3C --- Communication API

Implemented: POST /api/projects/:projectId/communications GET
/api/projects/:projectId/communications GET /api/communications/:id

Controller: server/controllers/communication.controller.ts

Routes: server/routes/communication.routes.ts

routes/index.ts mounts: - /projects/:projectId/communications -
/communications

Important behavior: - projectId comes from URL, not request body -
project must exist - source must match allowed enum - sender/content
cannot be empty - date must be valid - communications are sorted newest
first - cross-project isolation is required - no Gemini or Insight logic
belongs here

A TypeScript issue occurred because Express params were typed as string
\| string\[\]. It was fixed by explicit string assertions: const
projectId = req.params.projectId as string; const id = req.params.id as
string;

Do not change models just to solve that issue.

## Phase 3D --- AnalysisRun API: COMPLETE

The AnalysisRun API was implemented without changing the existing
Project, Communication, AnalysisRun, or Insight models.

Required endpoints: POST /api/projects/:projectId/analysis-runs GET
/api/projects/:projectId/analysis-runs GET /api/analysis-runs/:id

Creation requirements: - validate projectId - verify project exists -
communicationIds required and non-empty - every communicationId must be
a valid ObjectId - every communication must exist - every communication
must belong to the specified project - status must always start as
"pending" - ignore client-supplied status - do not create Insights - do
not call Gemini

Expected data relationship: Project → AnalysisRun → communicationIds

AnalysisRun later becomes: communications → AnalysisRun → Gemini →
structured insights

Phase 3D should use the existing AnalysisRun, Communication, and Project
models.

Preferred implementation: - controller - route(s) - minimal route
registration - existing AppError/error middleware - no repository
layer - no unnecessary service abstraction

Implementation files:

- `server/controllers/analysis.controller.ts`
- `server/routes/analysis.routes.ts`
- `server/routes/index.ts`

Implemented behavior:

- `POST /api/projects/:projectId/analysis-runs` validates the parent
  project, validates and resolves every communication ID, enforces
  project ownership, and creates the run with `status: "pending"`.
- Any client-supplied `status` is ignored.
- `GET /api/projects/:projectId/analysis-runs` validates the project and
  returns its runs sorted newest first by `startedAt`.
- `GET /api/analysis-runs/:id` validates the run ID and returns the
  matching AnalysisRun.
- All errors use the existing `AppError` and centralized error handler.
- No Gemini call is made and no Insight is created in Phase 3D.
- No repository or service abstraction was added.

Required negative tests: - invalid projectId - nonexistent project -
missing communicationIds - empty communicationIds - invalid
communicationId - nonexistent communication - communication from another
project - invalid analysisRun id - nonexistent analysisRun - client
sends status=completed but stored status remains pending

Verification completed:

- `npm run typecheck` passed.
- `npm run verify:models` passed: 21 checks passed, 0 failed.
- The project owner completed the remaining local server/Postman
  verification successfully.

Phase 3D handoff notes:

- Do not move Gemini orchestration into the AnalysisRun controller.
- Future AI work should consume AnalysisRuns whose status starts as
  `pending`; processing/completion behavior belongs to later work.
- Preserve `communicationIds` as the source set for future analysis and
  preserve source traceability through the existing model relationships.
- Before making further changes, read `PROJECT_CONTEXT.md`, inspect the
  actual repository state, and check Git status.

## Phase 3E — Insight API: COMPLETE

The Insight API was implemented using the existing unified `Insight`
Mongoose model. No model, repository, service, authentication, pagination,
filtering, or Gemini changes were introduced.

Implementation files:

- `server/controllers/insight.controller.ts`
- `server/routes/insight.routes.ts`
- `server/routes/index.ts`

Endpoints:

- `POST /api/projects/:projectId/insights`
- `GET /api/projects/:projectId/insights`
- `GET /api/insights/:id`

Creation validation:

- `projectId` is read only from `req.params.projectId`.
- The parent Project must exist.
- `analysisRunId` must be valid, exist, and belong to the Project.
- `sourceCommunicationIds` must be a non-empty array of valid IDs.
- Every source Communication must exist and belong to the Project.
- `type` and `status` must use the approved type-specific combinations.
- `title` and `description` must be non-empty strings.
- Optional rationale and assignee must be strings.
- Optional dueDate must be a valid date.
- Optional severity must be `low`, `medium`, or `high`.
- Optional dependsOnInsightIds must be valid IDs whose Insights exist in
  the same Project.

The project list is restricted to the requested Project and sorted by
`createdAt` descending. Individual lookup validates the Insight ID and
returns 404 when not found. Errors use `AppError`, centralized error
handling, and the established local `catchAsync` pattern.

Verification:

- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run verify:models` passed: 21 checks passed, 0 failed.
- Model verification continues to emit the existing non-blocking Mongoose
  `validateSync()` deprecation warning.
- No live server/Postman verification was performed for Phase 3E.

## Phase 4 — Frontend Foundation: COMPLETE

The previously empty `client/` directory now contains the minimal
React/TypeScript/Vite frontend foundation.

Implemented:

- Application shell with responsive header/navigation and main content area.
- React Router routes for `/` and `/projects/:projectId`.
- Environment-driven API base URL using `VITE_API_BASE_URL`.
- Centralized typed API request utility for `/api/projects`, with resource
  types prepared for communications, AnalysisRuns, and Insights.
- Reusable minimal loading/error status component.
- Project entry screen that loads and displays real backend Projects.

Files are under:

- `client/src/components/`
- `client/src/pages/`
- `client/src/api.ts`
- `client/src/types.ts`
- `client/src/App.tsx`
- `client/src/main.tsx`
- `client/src/styles.css`

Verification:

- `npm install` completed with 0 vulnerabilities.
- `npm run typecheck` passed in `client/`.
- `npm run build` passed in `client/`.
- Vite served successfully with HTTP 200.
- Browser verification confirmed the configured frontend API URL reached
  the running backend and rendered the real project list.

Not implemented in Phase 4:

- Gemini or any AI API
- Communication Inbox
- Project Truth
- AI analysis workflows
- Conflict/change/source-traceability UI
- Authentication
- New backend endpoints or architecture

## Phase 5 — Communication Inbox: COMPLETE

The frontend project workspace now provides a real Communication Inbox
using the existing backend API. It loads the selected Project and its
communications, displays raw source records, and supports creating new
communications without any AI processing.

Frontend implementation:

- `client/src/pages/ProjectPage.tsx`
- `client/src/components/CommunicationForm.tsx`
- `client/src/api.ts`
- `client/src/types.ts`
- `client/src/styles.css`

Exact endpoints used:

- `GET /api/projects/:projectId`
- `GET /api/projects/:projectId/communications`
- `POST /api/projects/:projectId/communications`

The form uses only the approved Communication source values and validates
source, sender, date, and non-blank content before submitting. Backend
errors are shown to the user. Loading, empty, retry, and duplicate-submit
states are handled. Successful creation refreshes the list without a
full browser reload and closes/resets the form.

Runtime verification:

- Communications loaded from the real MongoDB-backed API.
- A real meeting communication was created through the UI.
- The new record appeared in the inbox.
- Browser refresh confirmed persistence.
- No fake/mock communication data was used.

Not implemented:

- Gemini or any AI API
- AI processing or Insight generation
- Audio transcription
- External WhatsApp/email integrations
- New backend endpoints or models

Phase 5 completeness patch:

- `client/src/components/ProjectForm.tsx` exposes the existing
  `POST /api/projects` endpoint from the Projects page.
- The form sends only `name` and optional `description`; project status
  remains backend-controlled.
- Successful creation refreshes the project list without a full reload.
- Runtime verification created a real project, opened its empty
  Communication Inbox, and confirmed persistence after browser refresh.

## Development Rules

1.  One phase at a time.
2.  Do not add features outside the current phase.
3.  Preserve existing models and architecture.
4.  No Gemini until the backend foundation is ready.
5.  No frontend work until backend contracts are stable enough.
6.  No authentication, realtime, microservices, Kubernetes, payments, or
    external integrations for MVP.
7.  Never claim local verification unless the user actually ran it.
8.  Claude Browser cannot inspect or modify the user's local repository;
    provide code/patches for the user to apply.
9.  After each major phase, verify locally before moving on.
10. Update PROJECT_CONTEXT.md after a phase is actually completed.
11. Keep source traceability central to the product.
12. The user is the final decision maker.

## Learning Mode

The project is heavily AI-assisted/vibe-coded, but the user wants to
learn. For important implementations, explain: - what the code does -
data flow - why the architecture is chosen - how to test it - likely
failure cases

Use Explain → Predict → Verify. Do not overwhelm the user with
unnecessary theory.

## Important Agent Handoff Rule

If Claude becomes unavailable: - Do NOT restart the architecture. - Read
this handoff plus PROJECT_CONTEXT.md. - Continue from the current
phase. - Inspect the actual local code/output supplied by the user
before changing anything. - ChatGPT can act as the implementation
engineer if needed. - Another AI can implement the same phase using the
exact scope above. - Only one implementation agent should make
architectural changes at a time.

## Immediate Next Action

Phase 5 is complete. The next planned area is Phase 6, Gemini
integration. Before making further changes: 1. read `PROJECT_CONTEXT.md`
and this handoff 2. inspect Git status and the existing frontend/backend
structure 3. confirm the approved Phase 6 scope 4. implement only that
scope 5. run the smallest relevant verification commands 6. report
changed files, behavior, tests, and unresolved issues.

Do not jump directly to Gemini or redesign the backend architecture
without explicit project-lead authorization.

## Phase 6A — AI Analysis Contract: COMPLETE

Phase 6A is documentation-only. The exact future Gemini boundary is
recorded in `PROJECT_CONTEXT.md` Section 15A. No Gemini SDK, API key,
endpoint, schema, frontend behavior, AnalysisRun execution, or
AI-created Insight was added.

The contract is:

- Input is an ordered envelope of the selected communications, including
  `id`, `source`, `sender`, `date`, and `content`. All records must belong
  to the AnalysisRun's project.
- Output is strict JSON shaped as `{ "insights": [...] }`. Candidates
  use the existing Insight fields: required `type`, `title`,
  `description`, `status`, and non-empty `sourceCommunicationIds`;
  optional `rationale`, `severity`, `assignee`, `dueDate`, and
  `dependsOnInsightIds`.
- The only accepted types are `decision`, `task`, `change`, `risk`, and
  `conflict`. Existing type-specific status values and severity values
  remain authoritative.
- Every source ID must be valid, selected for the run, and owned by the
  same project. The backend supplies `projectId` and `analysisRunId`;
  Gemini cannot create cross-project references.
- Ambiguous or unsupported claims produce no candidate rather than
  fabricated facts. Gemini is never the source of truth.
- The backend parses and validates the complete response, rejects
  malformed JSON, invalid fields/enums/dates, missing or unknown source
  IDs, cross-project references, invalid dependencies, and duplicate
  candidates before persistence.
- The existing AnalysisRun lifecycle remains `pending` → `processing` →
  `completed`/`failed`. Provider, timeout, malformed-output, validation,
  and persistence failures are failed runs, never successful partial
  runs.

### Phase 6B handoff

Implement only the backend orchestration described in the contract:
consume a pending run, build the input envelope, call Gemini through a
server-side adapter, validate the strict output, persist validated
Insights, and update the AnalysisRun lifecycle. Preserve the existing
four-collection schema and routes unless a later phase explicitly
authorizes a change.
