<template>
    <svg style="width: 100%; height: 100%" ref="chartRef"></svg>
</template>

<script setup>
    import { ref, onMounted, watch } from "vue";
    import * as d3 from "d3";

    const props = defineProps({
        data: {
            type: Array,
            required: true,
        },
        point: {
            type: Object,
            required: true,
        },
    });

    const chartRef = ref(null);

    onMounted(renderChart);
    watch(() => [props.data, props.point], renderChart);

    function renderChart() {
        const svg = d3.select(chartRef.value);
        svg.selectAll("*").remove();

        const width = parseInt(chartRef.value.clientWidth, 10);
        const height = parseInt(chartRef.value.clientHeight, 10);
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        // define x and y scales
        const xScale = d3
            .scaleLinear()
            .domain(
                d3.extent(
                    props.data.flatMap((d) => d.values),
                    (d) => d.x
                )
            )
            .range([0, chartWidth]);

        const yScale = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(
                    props.data.flatMap((d) => d.values),
                    (d) => d.y
                ),
            ])
            .range([chartHeight, 0]);

        // define line generators
        const line = d3
            .line()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y));

        const areaXScale = d3
            .scaleLinear()
            .domain(
                d3.extent(
                    props.data.flatMap((d) => d.values),
                    (d) => d.x
                )
            )
            .range([margin.left, chartWidth + margin.left]);

        const areaYScale = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(
                    props.data.flatMap((d) => d.values),
                    (d) => d.y
                ),
            ])
            .range([chartHeight + margin.top, margin.top]);

        const area = d3
            .area()
            .x((d) => areaXScale(d.x))
            .y0(areaYScale(0))
            .y1((d) => areaYScale(d.y));

        // add x axis
        svg.append("g")
            .attr(
                "transform",
                `translate(${margin.left}, ${margin.top + chartHeight})`
            )
            .call(d3.axisBottom(xScale));

        // add y axis
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(d3.axisLeft(yScale));

        // add area between first and last line
        svg.append("path")
            .datum(props.data[0].values.concat(props.data[2].values.reverse()))
            .attr("class", "area")
            .attr("d", area)
            .attr("fill", "pink")
            .attr("opacity", 0.9);

        // add lines to chart
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .selectAll(".line")
            .data(props.data)
            .join("path")
            .attr("class", "line")
            .attr("d", (d) => line(d.values))
            .attr("stroke", (d) => d.color)
            .attr("stroke-width", 1)
            .attr("fill", "none");

        // add point to chart
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .selectAll(".dot")
            .data([props.point])
            .join("circle")
            .attr("class", "dot")
            .attr("cx", (d) => xScale(d.x))
            .attr("cy", (d) => yScale(d.y))
            .attr("r", 4)
            .attr("fill", "black")
            .attr("stroke", "white")
            .attr("stroke-width", 2);
    }
</script>
