import { ExecutionEnvironment } from "@/types/executor";
import { PageToHTMLTask } from "../task/page-to-html";

export async function PageToHTMLExecutor(
  environment: ExecutionEnvironment<typeof PageToHTMLTask>
): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content();
    environment.setOuput("HTML", html);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
