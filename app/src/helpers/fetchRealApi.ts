import { IHeartBeatMeasurement } from "@/types";

type IFetchRealApiReturn = {
  parsedData: IHeartBeatMeasurement[] | undefined;
  eventSource: EventSource;
};

export const fetchRealApi = (url: string): IFetchRealApiReturn => {
  let parsedData;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    parsedData = JSON.parse(event.data);
  };

  eventSource.onerror = (err) => {
    console.error("EventSource failed:", err);
    eventSource.close();
  };

  return { parsedData, eventSource };
};
