import { useEffect, useRef } from "react";
import * as d3 from "d3";

const userTypes = [
  {
    type: "Гость",
    now: new Date("2025-06-28T12:00:00"),
    avgHashrate: 10,
    totalHashes: 5000,
    group: "Низкая активность"
  },
  {
    type: "Аноним",
    now: new Date("2025-06-28T12:05:00"),
    avgHashrate: 25,
    totalHashes: 20000,
    group: "Средняя активность"
  },
  {
    type: "Авторизованный",
    now: new Date("2025-06-28T12:10:00"),
    avgHashrate: 40,
    totalHashes: 50000,
    group: "Средняя активность"
  },
  {
    type: "Реферал",
    now: new Date("2025-06-28T12:15:00"),
    avgHashrate: 55,
    totalHashes: 120000,
    group: "Высокая активность"
  },
  {
    type: "Премиум",
    now: new Date("2025-06-28T12:20:00"),
    avgHashrate: 90,
    totalHashes: 300000,
    group: "Высокая активность"
  }
];

const D3Page = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 700;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 40, left: 60 };

    svg.attr("width", width).attr("height", height);

    const contentWidth = width - margin.left - margin.right;
    const contentHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const timeExtent = d3.extent(userTypes, d => d.now) as [Date, Date];
    const xScale = d3.scaleTime()
      .domain(timeExtent)
      .range([0, contentWidth]);

    const yMax = d3.max(userTypes, d => d.avgHashrate) ?? 100;
    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([contentHeight, 0]);

    const rScale = d3.scaleSqrt()
      .domain([0, d3.max(userTypes, d => d.totalHashes) ?? 1])
      .range([5, 40]);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(["Низкая активность", "Средняя активность", "Высокая активность"])
      .range(["#999", "#1f77b4", "#ff7f0e"]);


      
    // Оси
    g.append("g")
      .attr("transform", `translate(0, ${contentHeight})`)
      
      .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat("%H:%M")));
      

    g.append("g").call(d3.axisLeft(yScale));

    // Пузыри
    g.selectAll("circle")
      .data(userTypes)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.now))
      .attr("cy", d => yScale(d.avgHashrate))
      .attr("r", d => rScale(d.totalHashes))
      .attr("fill", d => colorScale(d.group))
      .attr("opacity", 0.7)
      .append("title")
      .text(d => `${d.type}: ${d.totalHashes} хэшей`);

    // Подписи
    g.selectAll("text.label")
      .data(userTypes)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => xScale(d.now))
      .attr("y", d => yScale(d.avgHashrate) - rScale(d.totalHashes) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text(d => d.type);
  }, []);

  return (
    <div>
      <h2>Bubble Chart: Хэшрейт по времени</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default D3Page;
