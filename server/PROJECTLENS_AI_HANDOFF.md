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
communication.routes.ts │ └── index.ts ├── scripts/ ├── app.ts ├──
server.ts ├── .env ├── .env.example ├── package.json └── tsconfig.json

## Phase Status --- Wide View

PHASE 0 --- Project Definition: COMPLETE PHASE 1 --- Repository +
Project Contract: COMPLETE PHASE 2 --- Database: COMPLETE - 2A Database
Architecture: COMPLETE - 2B Mongoose Models: COMPLETE PHASE 3 ---
Backend API: CURRENT - 3A Backend Foundation: COMPLETE - 3B Project API:
COMPLETE and locally tested - 3C Communication API: IMPLEMENTED;
typecheck issue was fixed; local verification should be considered
complete only after the user's final local/Postman confirmation - 3D
AnalysisRun API: NEXT / CURRENT IMPLEMENTATION TARGET - 3E: not started
PHASE 4 --- Frontend Foundation: NOT STARTED PHASE 5 --- Communication
Inbox: NOT STARTED PHASE 6 --- Gemini Integration: NOT STARTED PHASE 7
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

## Phase 3D --- CURRENT NEXT TASK

Implement AnalysisRun API only.

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

Required negative tests: - invalid projectId - nonexistent project -
missing communicationIds - empty communicationIds - invalid
communicationId - nonexistent communication - communication from another
project - invalid analysisRun id - nonexistent analysisRun - client
sends status=completed but stored status remains pending

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

Complete Phase 3D --- AnalysisRun API. After implementation: 1. user
applies code locally 2. run typecheck 3. run build 4. run verify:models
5. run server 6. perform Postman tests 7. user reports results 8.
ChatGPT reviews and approves/rejects 9. update PROJECT_CONTEXT.md 10.
then move to Phase 3E

Do not jump directly to Gemini.
