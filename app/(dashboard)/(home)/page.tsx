import { getPeriods } from "@/server/analytics/get-periods";

function HomePage() {
  return <div>HomePage</div>;
}

async function PeriodSelectorWrapper() {
  const periods = await getPeriods();
  return <pre>{JSON.stringify(periods, null, 4)}</pre>;
}

export default HomePage;
