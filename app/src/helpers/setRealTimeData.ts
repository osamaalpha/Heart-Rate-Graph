import { IHeartBeatMeasurement } from "@/types";

const maxHeartBeatsInOneTenSec = 16;

const getLengthOfElementsToCompare = (arr: []) =>
  arr.length > maxHeartBeatsInOneTenSec ? maxHeartBeatsInOneTenSec : arr.length;

export const setRealTimeData = (
  prev: IHeartBeatMeasurement[],
  parsedData: IHeartBeatMeasurement[]
) => {
  if (prev.length === 0) return [...parsedData];
  const elementsToSliceFromPrev = getLengthOfElementsToCompare(prev as []);
  const elementsToSliceFromNew = getLengthOfElementsToCompare(parsedData as []);

  const slicedPrev = prev.slice(-elementsToSliceFromPrev);

  const uniqueElements = parsedData
    .slice(-elementsToSliceFromNew)
    .filter((obj: IHeartBeatMeasurement) => {
      const isElementUnique = !slicedPrev.some(
        ({ timestamp }: Record<string, number>) => obj.timestamp === timestamp
      );
      return isElementUnique;
    });

  return [...prev, ...uniqueElements];
};
