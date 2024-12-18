import { SetupUser } from "@/server/billing/setup-user";

export default async function SetupPage() {
  return await SetupUser();
}
