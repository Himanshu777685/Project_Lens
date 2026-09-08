/**
 * verifyModels.ts
 * ---------------
 * Verifies that all four Mongoose models load correctly and that the
 * Insight status/traceability validation rules behave as specified.
 *
 * This uses Mongoose's built-in `.validateSync()`, which runs schema
 * validation in memory WITHOUT needing a live MongoDB connection or
 * a `.save()` call. It's the fastest way to confirm the rules are
 * correct before wiring up a real database.
 *
 * Run with:
 *   npx ts-node scripts/verifyModels.ts
 */

import { Types } from "mongoose";
import { Project } from "../models/Project";
import { Communication } from "../models/Communication";
import { AnalysisRun } from "../models/AnalysisRun";
import { Insight } from "../models/Insight";

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean): void {
  if (condition) {
    console.log(`  PASS  ${label}`);
    passed += 1;
  } else {
    console.log(`  FAIL  ${label}`);
    failed += 1;
  }
}

console.log("1. All four models imported successfully");
check("Project model is defined", !!Project);
check("Communication model is defined", !!Communication);
check("AnalysisRun model is defined", !!AnalysisRun);
check("Insight model is defined", !!Insight);

console.log("\n2. Project schema works");
{
  const doc = new Project({ name: "Riverside Villa Renovation" });
  const err = doc.validateSync();
  check("Valid project passes validation", !err);
  check("Default status is 'active'", doc.status === "active");

  const badDoc = new Project({});
  const badErr = badDoc.validateSync();
  check("Project without a name is rejected", !!badErr?.errors["name"]);
}

console.log("\n3. Communication schema works");
{
  const doc = new Communication({
    projectId: new Types.ObjectId(),
    source: "email",
    sender: "Client",
    date: new Date(),
    content: "Use the previous marble specification.",
  });
  const err = doc.validateSync();
  check("Valid communication passes validation", !err);

  const badSourceDoc = new Communication({
    projectId: new Types.ObjectId(),
    source: "carrier_pigeon" as any,
    sender: "Client",
    date: new Date(),
    content: "Test",
  });
  const badSourceErr = badSourceDoc.validateSync();
  check("Invalid source enum is rejected", !!badSourceErr?.errors["source"]);
}

console.log("\n4. AnalysisRun schema works");
{
  const doc = new AnalysisRun({
    projectId: new Types.ObjectId(),
    communicationIds: [new Types.ObjectId()],
  });
  const err = doc.validateSync();
  check("Valid analysis run passes validation", !err);
  check("Default status is 'pending'", doc.status === "pending");

  const badDoc = new AnalysisRun({
    projectId: new Types.ObjectId(),
    communicationIds: [new Types.ObjectId()],
    status: "archived" as any,
  });
  const badErr = badDoc.validateSync();
  check("Invalid status enum is rejected", !!badErr?.errors["status"]);
}

console.log("\n5. Insight schema works (base case)");
{
  const doc = new Insight({
    projectId: new Types.ObjectId(),
    analysisRunId: new Types.ObjectId(),
    type: "decision",
    title: "Previous marble specification requested",
    description: "Client asked to reuse the marble spec from the earlier phase.",
    sourceCommunicationIds: [new Types.ObjectId()],
    status: "confirmed",
  });
  const err = doc.validateSync();
  check("Valid decision insight passes validation", !err);
}

console.log("\n6. Insight type/status combinations");
{
  const validTask = new Insight({
    projectId: new Types.ObjectId(),
    analysisRunId: new Types.ObjectId(),
    type: "task",
    title: "Find alternative marble shade",
    description: "Get client approval on shade 314.",
    sourceCommunicationIds: [new Types.ObjectId()],
    status: "open",
  });
  check("task/open is accepted", !validTask.validateSync());

  const validTaskCompleted = new Insight({
    projectId: new Types.ObjectId(),
    analysisRunId: new Types.ObjectId(),
    type: "task",
    title: "Find alternative marble shade",
    description: "Get client approval on shade 314.",
    sourceCommunicationIds: [new Types.ObjectId()],
    status: "completed",
  });
  check("task/completed is accepted", !validTaskCompleted.validateSync());

  const invalidTask = new Insight({
    projectId: new Types.ObjectId(),
    analysisRunId: new Types.ObjectId(),
    type: "task",
    title: "Find alternative marble shade",
    description: "Get client approval on shade 314.",
    sourceCommunicationIds: [new Types.ObjectId()],
    status: "mitigated" as any,
  });
  const invalidTaskErr = invalidTask.validateSync();
  check("task/mitigated is REJECTED", !!invalidTaskErr?.errors["status"]);

  const validRisk = new Insight({
    projectId: new Types.ObjectId(),
    analysisRunId: new Types.ObjectId(),
    type: "risk",
    title: "Procurement may be delayed",
    description: "Substitution and approval cycle could push back procurement.",
    sourceCommunicationIds: [new Types.ObjectId()],
    status: "mitigated",
  });
  check("risk/mitigated is accepted", !validRisk.validateSync());

  const invalidRisk = new Insight({
    projectId: new Types.ObjectId(),
    analysisRunId: new Types.ObjectId(),
    type: "risk",
    title: "Procurement may be delayed",
    description: "Substitution and approval cycle could push back procurement.",
    sourceCommunicationIds: [new Types.ObjectId()],
    status: "completed" as any,
  });
  const invalidRiskErr = invalidRisk.validateSync();
  check("risk/completed is REJECTED", !!invalidRiskErr?.errors["status"]);

  const validConflict = new Insight({
    projectId: new Types.ObjectId(),
    analysisRunId: new Types.ObjectId(),
    type: "conflict",
    title: "Requested marble shade is unavailable",
    description: "Client requested a shade the supplier cannot provide.",
    sourceCommunicationIds: [new Types.ObjectId(), new Types.ObjectId()],
    status: "resolved",
  });
  check("conflict/resolved is accepted", !validConflict.validateSync());
}

console.log("\n7. Source traceability enforcement");
{
  const missingField = new Insight({
    projectId: new Types.ObjectId(),
    analysisRunId: new Types.ObjectId(),
    type: "decision",
    title: "Test",
    description: "Test",
    status: "proposed",
    // sourceCommunicationIds intentionally omitted
  });
  const missingErr = missingField.validateSync();
  check(
    "Insight without sourceCommunicationIds is REJECTED",
    !!missingErr?.errors["sourceCommunicationIds"]
  );

  const emptyArray = new Insight({
    projectId: new Types.ObjectId(),
    analysisRunId: new Types.ObjectId(),
    type: "decision",
    title: "Test",
    description: "Test",
    sourceCommunicationIds: [],
    status: "proposed",
  });
  const emptyErr = emptyArray.validateSync();
  check(
    "Insight with empty sourceCommunicationIds array is REJECTED",
    !!emptyErr?.errors["sourceCommunicationIds"]
  );
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}