
# ProjectLens

### From fragmented project communication to a traceable Project Truth.

ProjectLens is an AI-powered project communication intelligence system that transforms scattered project communication into structured, actionable, and traceable project intelligence.

In real-world projects, important information is distributed across WhatsApp messages, emails, meetings, voice notes, site updates, supplier communication, and drawing revisions. ProjectLens brings this fragmented information together, analyzes it using AI, and converts it into a single structured view of the project's current truth.

---

## 🚧 Project Status

**Prototype Complete — Ready for Demonstration**

The core ProjectLens workflow has been implemented and tested:

- User authentication
- Project management
- Project ownership and authorization
- Communication management
- AI-powered communication analysis
- Decisions
- Tasks
- Changes
- Risks
- Conflicts
- Source traceability
- Frontend dashboard
- Login / Signup / Logout
- End-to-end testing

---

# 🎯 The Problem

Project communication is fragmented.

A single project may involve communication through:

- WhatsApp
- Email
- Meetings
- Voice notes
- Site updates
- Supplier messages
- Drawing revisions
- Other project documents

This creates a serious information-management problem.

Important information can become buried inside hundreds of messages and conversations.

### Common problems

- Important decisions are difficult to find.
- Action items get forgotten.
- Project changes may not reach everyone.
- Conflicting instructions can go unnoticed.
- Risks are identified too late.
- Teams spend time manually searching through communication history.
- There is often no clear connection between a decision and the communication that caused it.

The problem is not the lack of information.

> **The problem is fragmented information.**

---

# 💡 The Solution

ProjectLens converts fragmented project communication into structured project intelligence.

Instead of simply summarizing conversations, ProjectLens analyzes communication and identifies the information that matters to the project.

It extracts:

- Decisions
- Tasks
- Changes
- Risks
- Conflicts

Most importantly, generated insights remain connected to their original communication sources.

This creates a traceable:

> **Project Truth**

---

# 🔄 How ProjectLens Works

```text
 ┌──────────────┐
 │   WhatsApp   │
 └──────┬───────┘
        │
 ┌──────▼───────┐
 │    Email     │
 └──────┬───────┘
        │
 ┌──────▼───────┐
 │   Meetings   │
 └──────┬───────┘
        │
 ┌──────▼───────┐
 │  Voice Notes │
 └──────┬───────┘
        │
 ┌──────▼───────┐
 │ Site Updates │
 └──────┬───────┘
        │
 ┌──────▼───────┐
 │   Suppliers  │
 └──────┬───────┘
        │
 ┌──────▼───────┐
 │   Drawings   │
 └──────┬───────┘
        │
        ▼
┌─────────────────────┐
│     ProjectLens     │
│     AI Analysis     │
└──────────┬──────────┘
           │
           ▼
 ┌────────────────────┐
 │   Project Truth    │
 └─────────┬──────────┘
           │
     ┌─────┼─────┬────────┐
     ▼     ▼     ▼        ▼
 Decisions Tasks Changes  Risks
                         │
                         ▼
                     Conflicts
                         │
                         ▼
                Source Traceability
````

---

# 🧠 What ProjectLens Generates

## 1. Decisions

ProjectLens identifies decisions, approvals, rejections, and confirmed instructions.

Example:

> Client confirmed that the original living room partition position should be retained.

ProjectLens records this as a decision and connects it to the communication that established it.

---

## 2. Tasks

ProjectLens identifies actionable work items from communication.

Example:

> Re-mark the living room partition on site according to Revision C.

This becomes a structured task instead of remaining buried inside a message.

---

## 3. Changes

ProjectLens identifies changes to project requirements, layouts, materials, drawings, and instructions.

Example:

> Revision C restores the living room partition to its original position.

---

## 4. Risks

ProjectLens identifies potential project risks and unresolved issues.

Example:

> Partial dismantling of the partition wall may cause rework and schedule delay.

Another example:

> Switchboard delivery requires 7–10 days, while quantities cannot be finalized until the final layout is confirmed.

---

## 5. Conflicts

ProjectLens identifies contradictory instructions or information across multiple communications.

Example:

```text
Architect:
Shift partition wall by 300mm.

        VS

Client:
Keep original partition position.

        ↓

ProjectLens

        ↓

CONFLICT DETECTED
```

ProjectLens can then identify how the conflict was resolved through later communication.

---

# 🔗 Source Traceability

One of the core ideas behind ProjectLens is **traceability**.

AI-generated information should not become an unexplained black box.

Every important insight is linked to the communication sources that contributed to it.

```text
AI Insight
    │
    ├── Communication #12
    ├── Communication #17
    └── Communication #21
```

Users can inspect the original communication behind an insight and verify the reasoning context themselves.

This allows ProjectLens to answer:

> **"Why does the system believe this is a risk/decision/task/conflict?"**

rather than only:

> **"What happened?"**

---

# 📌 Example

Suppose a project contains the following communications:

### Communication 1

> Architect proposes shifting the living room partition wall by 300mm in Revision B.

### Communication 2

> Client instructs the team to retain the original wall position.

### Communication 3

> Contractor reports that construction has already started according to Revision B.

### Communication 4

> Architect issues Revision C restoring the original wall position.

ProjectLens can connect these communications and generate:

```text
                    COMMUNICATIONS
                          │
                          ▼
                 ┌─────────────────┐
                 │ Conflict        │
                 │ detected        │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Decision        │
                 │ Original layout │
                 │ retained        │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Change          │
                 │ Revision C      │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Task            │
                 │ Re-mark wall    │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Risk            │
                 │ Rework + delay  │
                 └─────────────────┘
```

Instead of four disconnected messages, the team gets a connected understanding of what happened.

---

# 🏗️ Core Workflow

```text
Create Project
      │
      ▼
Add Project Communications
      │
      ▼
Run AI Analysis
      │
      ▼
Analyze Communication
      │
      ▼
Extract Project Intelligence
      │
      ├── Decisions
      ├── Tasks
      ├── Changes
      ├── Risks
      └── Conflicts
      │
      ▼
View Project Truth
      │
      ▼
Trace Insights to Sources
```

---

# ✨ Features

## Authentication

* User registration
* User login
* User logout
* JWT-based authentication
* HttpOnly authentication cookies
* Protected API routes
* Current-user session handling

---

## Project Management

* Create projects
* View projects
* Update projects
* Archive projects
* Delete projects
* Project ownership
* User-specific project lists

---

## Communication Management

ProjectLens supports multiple communication sources:

* WhatsApp
* Email
* Meetings
* Site updates
* Suppliers
* Drawing revisions
* Voice notes
* Other sources

Each communication can contain:

* Source
* Sender
* Date
* Content
* Project association
* Additional metadata

---

## AI Analysis

ProjectLens analyzes project communications and extracts structured intelligence:

* Decisions
* Tasks
* Changes
* Risks
* Conflicts

The analysis is performed across project communication rather than treating every message as an isolated piece of information.

---

## Source Traceability

Insights maintain references to their supporting communications.

Users can inspect the source communications behind generated insights.

---

## Authorization

ProjectLens enforces project ownership.

Users can only access resources belonging to their projects.

Authorization is applied across:

* Projects
* Communications
* Analysis Runs
* Insights

Unauthorized users cannot access another user's project data.

---

# 🏛️ Architecture

```text
                        ┌─────────────────────┐
                        │      Frontend       │
                        │      React UI       │
                        └──────────┬──────────┘
                                   │
                                   │ REST API
                                   ▼
                        ┌─────────────────────┐
                        │     Express API     │
                        │     TypeScript      │
                        └──────────┬──────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
       Authentication        Project Data          AI Analysis
              │                    │                    │
              ▼                    ▼                    ▼
             JWT               MongoDB              Gemini
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   │
                                   ▼
                         Structured Insights
                                   │
                                   ▼
                            Project Truth
```

---

# 🗂️ Data Model

The core data relationships are:

```text
User
 │
 └── Projects
       │
       ├── Communications
       │
       ├── Analysis Runs
       │
       └── Insights
             │
             └── Source Communications
```

### User

Represents an authenticated ProjectLens user.

---

### Project

Represents a project and contains ownership information.

---

### Communication

Represents an individual piece of project communication.

---

### AnalysisRun

Represents an AI analysis execution over project communications.

---

### Insight

Represents structured intelligence generated from communication.

Insight types include:

* Decision
* Task
* Change
* Risk
* Conflict

---

# 🛠️ Technology Stack

## Frontend

* React
* React Router
* Tailwind CSS

## Backend

* Node.js
* Express
* TypeScript

## Database

* MongoDB
* Mongoose
* MongoDB Atlas

## Authentication

* JSON Web Tokens
* HttpOnly Cookies
* Password hashing

## AI

* Google Gemini

## Deployment

* Vercel
* Render
* MongoDB Atlas

---

# 🔐 Security

ProjectLens includes several security measures:

* Password hashing
* JWT authentication
* HttpOnly cookies
* SameSite cookie protection
* Protected API routes
* Server-side ownership validation
* Resource-level authorization
* User-specific project queries

Client-provided ownership information is not trusted.

When a project is created, ownership is determined from the authenticated user.

---

# 🔌 API Overview

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

---

## Projects

```http
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
PATCH  /api/projects/:id/archive
DELETE /api/projects/:id
```

---

## Communications

```http
POST /api/projects/:projectId/communications
GET  /api/projects/:projectId/communications
GET  /api/communications/:id
```

---

## Analysis Runs

```http
POST /api/projects/:projectId/analysis-runs
GET  /api/projects/:projectId/analysis-runs
GET  /api/analysis-runs/:id
POST /api/analysis-runs/:id/execute
```

---

## Insights

```http
POST  /api/projects/:projectId/insights
GET   /api/projects/:projectId/insights
GET   /api/insights/:id
PATCH /api/insights/:id
```

Protected resources require authentication and appropriate project ownership.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* MongoDB or MongoDB Atlas
* Gemini API key
* Git

---

# 📥 Clone the Repository

```bash
git clone <repository-url>

cd Project_Lens
```

---

# ⚙️ Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGODB_URI=<your-mongodb-uri>

JWT_SECRET=<your-jwt-secret>

JWT_EXPIRES_IN=1h

GEMINI_API_KEY=<your-gemini-api-key>
```

Start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

# 🎨 Frontend Setup

Navigate to the frontend directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Configure the backend API URL in the frontend environment variables.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

---

# 🧪 Development Validation

Backend type checking:

```bash
npm run typecheck
```

Model verification:

```bash
npm run verify:models
```

The backend was also tested using local MongoDB-backed authentication and authorization smoke tests.

---

# 🧪 Testing

ProjectLens was tested across the major application workflows.

### Authentication

* Registration
* Login
* Logout
* Current-user authentication
* Invalid credentials
* Duplicate email handling
* Cookie-based authentication

### Authorization

* Owner project access
* Non-owner project access
* Non-owner project modification
* Non-owner project deletion
* Non-owner communication access
* Non-owner analysis access
* Non-owner insight access
* Unauthenticated access

### Core Workflow

* Project creation
* Communication creation
* Analysis run creation
* AI analysis
* Insight generation
* Source traceability

---

# 📊 Example Project Intelligence

A ProjectLens analysis may produce a result such as:

```text
DECISIONS
├── Retain original living room partition position
└── Reject Revision B wall shift

TASKS
├── Issue Revision C drawing
└── Re-mark living room partition on site

CHANGES
└── Restore original living room wall layout

RISKS
├── Schedule delay and masonry rework
└── Switchboard delivery lead time

CONFLICTS
└── Revision B wall position vs client instruction
```

The important part is that these aren't simply independent AI-generated labels.

They are connected to the underlying project communications.

---

# 🎥 Demo Flow

The recommended demonstration follows the actual ProjectLens workflow:

### 1. Login

Log into the ProjectLens application.

### 2. Create a Project

Create a new project.

### 3. Add Communications

Add multiple communications from different sources.

For example:

* Client message
* Architect communication
* Supplier update
* Site update
* Drawing revision

### 4. Run Analysis

Run ProjectLens AI analysis.

### 5. View Project Truth

Review:

* Decisions
* Tasks
* Changes
* Risks
* Conflicts

### 6. Trace an Insight

Open an insight and inspect the original communications behind it.

This demonstrates the core value of ProjectLens:

> **From fragmented communication to traceable project intelligence.**

---

# 🎯 Design Philosophy

ProjectLens is not intended to be another traditional project-management system.

Traditional project-management software generally starts with structured information:

```text
Task
Deadline
Assignee
Status
```

ProjectLens focuses on what happens **before** information becomes structured.

```text
Conversation
     ↓
Unstructured Information
     ↓
AI Understanding
     ↓
Project Intelligence
     ↓
Structured Project Truth
```

The goal is to reduce the gap between:

> **What people communicate**

and

> **What the project actually needs to know.**

---

# 📦 Current Scope

The current prototype focuses on the core intelligence workflow.

Communication sources are currently represented through manual input.

The prototype does **not** require direct integrations with WhatsApp, email, meeting platforms, or other external communication systems.

This keeps the current implementation focused on demonstrating the core problem:

> **Understanding fragmented project communication and converting it into traceable project intelligence.**

---

# 🔮 Future Improvements

Potential future development includes:

* Direct WhatsApp/business messaging integrations
* Email ingestion
* Meeting transcription
* Voice-note processing
* Document analysis
* Drawing/PDF analysis
* Automatic communication ingestion
* Project timeline reconstruction
* Dependency graphs
* Automated follow-ups
* Advanced risk prediction
* Notifications
* Role-based collaboration
* Team-level project access
* Additional AI models

These features are outside the scope of the current prototype.

---

# 🏆 Why ProjectLens?

Project teams already have enormous amounts of information.

The challenge is turning that information into something useful.

ProjectLens aims to make project communication:

**Understandable.**

**Actionable.**

**Traceable.**

Instead of asking:

> "Where was that discussed?"

ProjectLens aims to provide:

> "Here is what was decided, what changed, what needs to happen next, what risks exist, and which communications support each conclusion."

---

# 👨‍💻 Project

**Project:** ProjectLens

**Category:** AI / Project Communication Intelligence

**Built for:** ArchScale Guild Technology Hackathon 2026

---

# 📄 License

This project is currently developed as a hackathon prototype.

Add the appropriate license here if the repository is intended to be open source.

````

### Before you commit this

There are **3 placeholders I would replace before pushing**:

```md
<repository-url>
````

```md
VITE_API_URL=...
```


