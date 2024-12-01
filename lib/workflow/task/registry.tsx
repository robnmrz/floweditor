import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { ExtractTextFromElementTask } from "./extract-from-element";
import { LaunchBrowserTask } from "./launch-browser";
import { PageToHTMLTask } from "./page-to-html";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHTMLTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
};
