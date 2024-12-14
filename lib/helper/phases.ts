import { ExecutionPhase } from "@prisma/client";

// simply to make the function a bit more generic
// this can be used on different function that use the ExecutionPhase
type Phase = Pick<ExecutionPhase, "creditsConsumed">;

export function getPhasesTotalCost(phases: Phase[]) {
  return phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0);
}
