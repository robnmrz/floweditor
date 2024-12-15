import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { AddPropertyToJsonTask } from "./add-property-to-json";
import { ClickElementTask } from "./click-element";
import { DeliverViaWebhookTask } from "./deliver-via-webhook";
import { ExtractTextFromElementTask } from "./extract-from-element";
import { FillInputTask } from "./fill-input";
import { LaunchBrowserTask } from "./launch-browser";
import { LlmDataExtractionTask } from "./llm-data-extraction";
import { NavigateUrlTask } from "./navigate-page";
import { PageToHTMLTask } from "./page-to-html";
import { ReadPropertyFromJsonTask } from "./read-property-from-json";
import { ScrollToElementTask } from "./scroll-to-element";
import { WaitForElementTask } from "./wait-for-element";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHTMLTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
  LLM_DATA_EXTRACTION: LlmDataExtractionTask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonTask,
  NAVIGATE_URL: NavigateUrlTask,
  SCROLL_TO_ELEMENT: ScrollToElementTask,
};
