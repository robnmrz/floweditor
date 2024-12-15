import { symmetricDecrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { ExecutionEnvironment } from "@/types/executor";
import OpenAI from "openai";
import { LlmDataExtractionTask } from "../task/llm-data-extraction";

export async function LlmDataExtractionExecutor(
  environment: ExecutionEnvironment<typeof LlmDataExtractionTask>
): Promise<boolean> {
  try {
    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("input->content not defined");
    }
    const credentials = environment.getInput("Credentials");
    if (!credentials) {
      environment.log.error("input->credentials not defined");
    }
    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("input->prompt not defined");
    }

    // get credentials from database
    const credentialsValue = await prisma.credential.findUnique({
      where: {
        id: credentials,
      },
    });

    if (!credentialsValue) {
      environment.log.error("credentials not found");
      return false;
    }

    const plainCredentialsValue = symmetricDecrypt(credentialsValue.value);
    if (!plainCredentialsValue) {
      environment.log.error("can't decrypt credentials");
      return false;
    }

    const openai = new OpenAI({
      apiKey: plainCredentialsValue,
    });

    // TODO: make system prompt a separate node that inputs into this node
    // NOTE: make standard system prompt available as node for plug and play
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a valid JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text.",
        },
        {
          role: "user",
          content: content,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 1,
    });

    environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
    environment.log.info(
      `Completion tokens: ${response.usage?.completion_tokens}`
    );

    const result = response.choices[0].message.content;
    if (!result) {
      environment.log.error("Empty response from LLM");
      return false;
    }

    environment.setOutput("Extracted data", result);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
