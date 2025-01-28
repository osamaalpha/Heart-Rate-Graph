"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IHeartBeatMeasurement } from "@/types";
import createHeartBeatGraph from "@/graphs/createHeartBeatGraph";
import { pagePaths, usernameStorageKey } from "@/constants";
import { setRealTimeData } from "@/helpers/setRealTimeData";
import styles from "./style.module.css";

const HeartBeatGraph = () => {
  const [data, setData] = useState<IHeartBeatMeasurement[]>([]);
  const [previousStrokeDash, setPreviousStrokeDash] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem(usernameStorageKey);
    if (!storedUsername) router.push(pagePaths.signin);

    const eventSource = new EventSource(
      `/api/heartBeat?username=${storedUsername}`
    );

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data).measurements;

      if (parsedData) {
        setData((prev) => setRealTimeData(prev, parsedData));
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    if (data.length < 1) return;

    const tooltip = createHeartBeatGraph({
      data,
      previousStrokeDash,
      setPreviousStrokeDash,
    });

    return () => {
      eventSource.close();
      tooltip.remove();
    };
  }, [data]);
  return (
    <>
      <div className={styles.heartGraphContainer}>
        <p>Monitoring heart rate</p>
        <svg id="heart-rate-graph" />
      </div>
    </>
  );
};

export default HeartBeatGraph;
