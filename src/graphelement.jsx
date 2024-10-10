import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

function IterationTable() {
  const [initialValue1, setInitialValue1] = useState(0.08); // Initial value 1
  const [initialValue2, setInitialValue2] = useState(0.22); // Initial value 2
  const [iterations1, setIterations1] = useState([]);
  const [iterations2, setIterations2] = useState([]);

  const A = 50000;
  const P = 273400;
  const n = 14;

  const svgRef = useRef();

  useEffect(() => {
    iterateValues(initialValue1, setIterations1);
    iterateValues(initialValue2, setIterations2);
  }, [initialValue1, initialValue2]);

  useEffect(() => {
    if (iterations1.length > 0 && iterations2.length > 0) {
      drawCombinedLineChart(iterations1, iterations2, svgRef);
    }
  }, [iterations1, iterations2]);

  const iterateValues = (initialValue, setIterations) => {
    let currentValue = initialValue;
    let prevValue;
    let iterationCount = 0;
    const tempIterations = [];

    // Push the initial value as the first point
    tempIterations.push({
      iteration: iterationCount,
      oldValue: currentValue.toFixed(5),
      newValue: currentValue.toFixed(5),
    });

    do {
      prevValue = currentValue;
      currentValue = nextIteration(prevValue);

      tempIterations.push({
        iteration: iterationCount + 1,
        oldValue: prevValue.toFixed(5),
        newValue: currentValue.toFixed(5),
      });

      iterationCount++;
    } while (Math.abs(currentValue - prevValue) > 0.00001);

    setIterations(tempIterations);
  };

  const nextIteration = (value) => {
    return (A / P) * ((Math.pow(1 + value, n) - 1) / Math.pow(1 + value, n));
  };

  const drawCombinedLineChart = (iterations1, iterations2, svgRef) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const width = 500;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    const maxIterations = Math.max(
      d3.max(iterations1, (d) => d.iteration),
      d3.max(iterations2, (d) => d.iteration)
    );

    const xScale = d3
      .scaleLinear()
      .domain([0, maxIterations])
      .range([margin.left, width - margin.right]);

    // Set yScale to start from 0
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max([...iterations1, ...iterations2], (d) => +d.newValue)]) // Y-axis starts from 0
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x((d) => xScale(d.iteration))
      .y((d) => yScale(d.newValue));

    // Plot line for initial value 1
    svg
      .append("path")
      .datum(iterations1)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Plot line for initial value 2
    svg
      .append("path")
      .datum(iterations2)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("d", line);

    // X-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .append("text")
      .attr("fill", "black")
      .attr("x", width / 2)
      .attr("y", margin.bottom - 10)
      .text("Iterations");

    // Y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(10))
      .append("text")
      .attr("fill", "black")
      .attr("x", -height / 2)
      .attr("y", -35)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Iterated Value");

    // Add legend
    svg
      .append("rect")
      .attr("x", width - margin.right - 100)
      .attr("y", 10)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "blue");

    svg
      .append("text")
      .attr("x", width - margin.right - 80)
      .attr("y", 22)
      .text("Initial Value 1");

    svg
      .append("rect")
      .attr("x", width - margin.right - 100)
      .attr("y", 30)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "red");

    svg
      .append("text")
      .attr("x", width - margin.right - 80)
      .attr("y", 42)
      .text("Initial Value 2");
  };

  return (
    <div>
      <h3>Comparison of Iterations for Initial Values (0.08 and 0.22)</h3>

      {/* Display Table 1 */}
      <h4 style={{ textAlign: "center" }}>Table for Initial Value: 0.08</h4>
      <table
        style={{
          margin: "0 auto",
          borderCollapse: "collapse",
          border: "1px solid black",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>Iteration</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Old Value</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>New Value</th>
          </tr>
        </thead>
        <tbody>
          {iterations1.map((iter, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid black", padding: "8px" }}>{iter.iteration}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>{iter.oldValue}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>{iter.newValue}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Display Table 2 */}
      <h4 style={{ textAlign: "center" }}>Table for Initial Value: 0.22</h4>
      <table
        style={{
          margin: "0 auto",
          borderCollapse: "collapse",
          border: "1px solid black",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>Iteration</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Old Value</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>New Value</th>
          </tr>
        </thead>
        <tbody>
          {iterations2.map((iter, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid black", padding: "8px" }}>{iter.iteration}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>{iter.oldValue}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>{iter.newValue}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Combined Line Chart */}
      <h4 style={{ textAlign: "center" }}>Line Graph: Iterations for Initial Values 0.08 and 0.22</h4>
      <svg ref={svgRef} width={500} height={400}></svg>
    </div>
  );
}

export default IterationTable;
