import { ExecutionEnvironment } from "@/types/executor";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { ClickElementExecutor } from "./click-element-executor";
import { DeliverViaWebhookExecutor } from "./deliver-via-webhook-executor";
import { ExtractTextFromElementExecutor } from "./extract-text-from-element-executor";
import { FillInputExecutor } from "./fill-input-executor";
import { LaunchBrowserExecutor } from "./launch-browser-executor";
import { LlmDataExtractionExecutor } from "./llm-data-extraction-executor";
import { PageToHTMLExecutor } from "./page-to-html-executor";
import { WaitForElementExecutor } from "./wait-for-element-executor";

type ExecutorFn<T extends WorkflowTask> = (
  environment: ExecutionEnvironment<T>
) => Promise<boolean>;

type RegistryType = {
  // this type ensures that every task type has an executor
  // where the executor generic type matches the key so e.g.
  // LaunchBrowserExecutor must be of type TaskType.LAUNCH_BROWSER
  [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>;
};

export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHTMLExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor,
  LLM_DATA_EXTRACTION: LlmDataExtractionExecutor,
};
