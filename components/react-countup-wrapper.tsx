"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";

function ReactCountWrapper({ value }: { value: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  if (!mounted) {
    return "-";
  }

  return <CountUp duration={0.5} preserveValue end={value} decimals={0} />;
}

export default ReactCountWrapper;
