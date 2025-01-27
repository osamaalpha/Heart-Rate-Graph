"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IHeartBeatMeasurement } from "@/types";
import createHeartBeatGraph from "@/graphs/createHeartBeatGraph";
import { pagePaths, usernameStorageKey } from "@/constants";

const HeartBeatGraph = () => {
  const [data, setData] = useState<IHeartBeatMeasurement[]>([]);
  const [previousStrokeDash, setPreviousStrokeDash] = useState(0);

  const router = useRouter();

  console.log(data);

  useEffect(() => {
    const storedUsername = localStorage.getItem(usernameStorageKey);
    if (!storedUsername) router.push(pagePaths.signin);

    const eventSource = new EventSource(
      `/api/heartBeat?username=${storedUsername}`
    );

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data).measurements;

      if (parsedData) {
        setData([...parsedData]);
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
      <div style={{ marginTop: "50px" }}>
        <svg
          style={{
            backgroundColor: "black",
            borderRadius: "20px",
            marginLeft: "200px", // Adjust for desired rounding
          }}
          id="heart-rate-graph"
          width="800"
          height="500"
        />
      </div>
    </>
  );
};

export default HeartBeatGraph;
