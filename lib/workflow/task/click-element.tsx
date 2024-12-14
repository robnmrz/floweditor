import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { MousePointerClickIcon } from "lucide-react";

export const ClickElementTask = {
  type: TaskType.CLICK_ELEMENT,
  label: "Click element",
  icon: (props) => (
    <MousePointerClickIcon {...props} className="stroke-orange-400" />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const,
} satisfies WorkflowTask;
