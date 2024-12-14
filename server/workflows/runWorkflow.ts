"use server";

import prisma from "@/lib/prisma";
import { executeWorkflow } from "@/lib/workflow/execute-workflow";
import { FlowToExecutionPlan } from "@/lib/workflow/execution-plan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
  WorkflowStatus,
} from "@/types/workflow";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function runWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const user = await currentUser();

  if (!user) {
    throw new Error("unauthenticated");
  }

  const { workflowId, flowDefinition } = form;
  if (!workflowId) {
    throw new Error("workflowId is required");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId: user.id,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  let executionPlan: WorkflowExecutionPlan;
  let workflowDefinition = flowDefinition;
  if (workflow.status === WorkflowStatus.PUBLISHED) {
    // if the workflow is published, use the execution plan
    // saved in for the workflow from the time of publishing
    if (!workflow.executionPlan) {
      throw new Error("No execution plan found in published workflow");
    }
    executionPlan = JSON.parse(workflow.executionPlan);
    workflowDefinition = workflow.definition;
  } else {
    // otherwise gernate it from flow definition
    if (!flowDefinition) {
      throw new Error("flowDefinition is not defined");
    }

    const flow = JSON.parse(flowDefinition);
    const result = FlowToExecutionPlan(flow.nodes, flow.edges);
    if (result.error) {
      throw new Error("flow definition not valid");
    }

    if (!result.executionPlan) {
      throw new Error("no execution plan generated");
    }

    // until here this function doesn't actually run the workflow
    // it only generates the execution plan which can then be used
    // for executing the workflow with any approach (e.g. pyhton API)
    executionPlan = result.executionPlan;
  }

  // use execution plan to run the workflow
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId: workflowId,
      userId: user.id,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: workflowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId: user.id,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          });
        }),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("Failed to create workflow execution");
  }

  executeWorkflow(execution.id); // run this in background
  redirect(`/workflow/runs/${workflowId}/${execution.id}`);
}
