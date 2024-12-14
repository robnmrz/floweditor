import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/types/workflow";

const indicatorColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: "bg-slate-400",
  RUNNING: "bg-yellow-400",
  COMPLETED: "bg-emerald-600",
  FAILED: "bg-red-400",
  CANCELLED: "bg-orange-400",
};

function ExecutionStatusIndicator({
  status,
}: {
  status: WorkflowExecutionStatus;
}) {
  return (
    <div className={cn("w-2 h-2 rounded-full", indicatorColors[status])} />
  );
}

export default ExecutionStatusIndicator;

const labelColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: "text-slate-400",
  RUNNING: "text-yellow-400",
  COMPLETED: "text-emerald-600",
  FAILED: "text-red-400",
  CANCELLED: "text-orange-400",
};

export function ExecutionStatusLabel({
  status,
}: {
  status: WorkflowExecutionStatus;
}) {
  return <span className={cn("lowercase", labelColors[status])}>{status}</span>;
}
