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
PHASE 4  — Frontend foundation
PHASE 5  — Communication Inbox
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

## 18. CURRENT PROJECT STATE

- Database architecture is **approved** (Phase 2A).
- Mongoose model layer is **implemented** (Phase 2B).
- Model verification is **passing** (21/21 checks, 0 failures).
- The project is **ready to begin Phase 3A — Backend Foundation**.

Phase 3A has not been started. Implementation planning for Phase 3A will follow in a separate step, per the governance rules in Section 13 and the safety rules in Section 14.

---

*End of PROJECT_CONTEXT.md*