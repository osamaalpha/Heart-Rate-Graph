import { heartBeatZones } from "@/constants";
import addHours from "@/helpers/addHours";
import { IHeartBeatMeasurement } from "@/types";
import * as d3 from "d3";

type IHeartBeatGraphArguments = {
  data: IHeartBeatMeasurement[];
  previousStrokeDash: number;
  setPreviousStrokeDash: React.Dispatch<React.SetStateAction<number>>;
};

const createHeartBeatGraph = ({
  data,
  previousStrokeDash,
  setPreviousStrokeDash,
}: IHeartBeatGraphArguments) => {
  const svg = d3.select("#heart-rate-graph");
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  svg.selectAll("*").remove();

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const minDate = d3.min(data, (d) => new Date(d.timestamp)) ?? new Date();
  const maxDate =
    d3.max(data, (d) => addHours(new Date(d.timestamp), 0.0005)) ?? new Date();

  const xScale = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([40, 180])
    .range([height * 0.8, 0]);

  const timeFormat = d3.timeFormat("%H:%M:%S");

  // Line generator
  const line = d3
    .line<IHeartBeatMeasurement>()
    .x((d) => xScale(new Date(d.timestamp)))
    .y((d) => yScale(d.heartRate))
    .curve(d3.curveCatmullRom.alpha(0.5));

  const area = d3
    .area<IHeartBeatMeasurement>()
    .x((d) => xScale(new Date(d.timestamp)))
    .y0(height)
    .y1((d) => yScale(d.heartRate))
    .curve(d3.curveCatmullRom);

  // Tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "white")
    .style("border", "1px solid black")
    .style("padding", "5px")
    .style("border-radius", "5px")
    .style("visibility", "hidden")
    .style("font-size", "12px");

  // Add X Axis
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(xScale)
        .ticks(5)
        .tickFormat((d) =>
          timeFormat(d instanceof Date ? d : new Date(d.toString()))
        )
    );

  g.append("g").call(d3.axisLeft(yScale));

  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#C78A5F")
    .attr("stroke-width", 2)
    .attr("d", line)
    .attr("stroke-dasharray", function () {
      setPreviousStrokeDash(this.getTotalLength());
      return this.getTotalLength();
    })
    .attr("stroke-dashoffset", function () {
      setPreviousStrokeDash(this.getTotalLength());
      return this.getTotalLength() - previousStrokeDash;
    })
    .transition()
    .duration(700)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);
  svg
    .append("g")
    .call(d3.axisLeft(yScale))
    .selectAll("path, line")
    .attr("stroke", "white");

  svg.selectAll(".tick text").attr("fill", "white");

  g.append("linearGradient")
    .attr("id", "line-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0)
    .attr("y1", yScale(180))
    .attr("x2", 0)
    .attr("y2", yScale(40))
    .selectAll("stop")
    .data([
      { offset: "0%", color: "rgb(48, 35, 23)" },
      { offset: "100%", color: "#000" },
    ])
    .enter()
    .append("stop")
    .attr("offset", (d) => d.offset)
    .attr("stop-color", (d) => d.color);

  g.append("path")
    .datum(data)
    .attr("fill", "url(#line-gradient)")
    .attr("d", area);

  svg
    .append("linearGradient")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", 0)
    .attr("height", height);

  // Invisible overlay for hover interaction over the entire graph
  g.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "transparent")
    .on("mousemove", (event) => {
      const [mouseX] = d3.pointer(event, g.node());
      const mouseDate = xScale.invert(mouseX);

      const closestData = data.reduce((prev, curr) => {
        return Math.abs(
          new Date(curr.timestamp).getSeconds() - mouseDate.getSeconds()
        ) <
          Math.abs(
            new Date(prev.timestamp).getSeconds() - mouseDate.getSeconds()
          )
          ? curr
          : prev;
      });

      const zone = heartBeatZones.find(
        (z) =>
          closestData.heartRate >= z.range[0] &&
          closestData.heartRate <= z.range[1]
      );

      tooltip
        .style("visibility", "visible")
        .style("top", `${event.pageY + 10}px`)
        .style("left", `${event.pageX + 10}px`)
        .html(
          `<strong>Zone:</strong> ${zone?.name || "N/A"}<br />
           <strong>BPM:</strong> ${closestData.heartRate}<br />
           <strong>Time:</strong> ${d3.timeFormat("%H:%M:%S")(
             new Date(closestData.timestamp)
           )}`
        );
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });

  return tooltip;
};

export default createHeartBeatGraph;
