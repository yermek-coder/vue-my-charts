<script setup>
    import { watch, ref, defineProps, onMounted } from "vue";
    import * as d3 from "d3";
    import { boxplot, boxplotStats } from "d3-boxplot";

    const props = defineProps({
        data: {
            type: Array,
            required: true,
        },
    });

    const svgRef = ref(null);
    const margin = { top: 20, right: 20, bottom: 20, left: 60 };

    watch(
        () => props.data,
        () => {
            renderChart();
        }
    );

    onMounted(function () {
        renderChart();
    });

    function renderChart() {
        const width = svgRef.value.clientWidth - margin.left - margin.right;
        const height = svgRef.value.clientHeight - margin.top - margin.bottom;

        svgRef.value.innerHTML = "";
        const root = d3.select(svgRef.value);
        root.append("g").attr("class", "plots");

        const { data } = props;
        const stats = data.map(function (d) {
            return boxplotStats(d.points);
        });

        const colors = d3.schemeCategory10;

        function getDomain(arr) {
            return arr
                .map((item) => item.points)
                .flat()
                .reduce(
                    function (acc, val) {
                        const min = Math.min(acc[0], val);
                        const max = Math.max(acc[1], val);
                        return [min, max];
                    },
                    [Infinity, -Infinity]
                );
        }

        const scale = d3
            .scaleLinear()
            .domain(getDomain(data))
            .range([margin.left, width - margin.left - margin.right]);

        const band = d3
            .scaleBand()
            .domain(d3.range(stats.length))
            .range([margin.top, height]);

        const plot = boxplot()
            .showInnerDots(false)
            .scale(scale)
            .bandwidth(0)
            .boxwidth(12)
            .key((d) => d.points);

        root.select("g.plots")
            .attr("transform", "translate(" + [margin.left, margin.top] + ")")
            .selectAll(".plot")
            .data(stats)
            .join("g")
            .attr("class", "plot")
            .attr("transform", (_, i) => `translate(${[0, band(i)]})`)
            .attr("color", (_, i) => colors[(i / 1) | 0])
            .call(plot);

        root.append("g")
            .attr("style", "transform: translateY(" + [margin.top + 5] + "px)")
            .selectAll("text")
            .data(data.map((item) => item.title))
            .join("text")
            .attr("class", "title")
            .attr("transform", (_, i) => `translate(${[0, band(i)]})`)
            .attr("fill", "black")
            .text(function (d) {
                return d;
            });

        // titles
        root.append("g")
            .attr("style", "transform: translateY(" + [margin.top + 5] + "px)")
            .selectAll("text")
            .data(data.map((item) => item.title))
            .join("text")
            .attr("class", "title")
            .attr("transform", (_, i) => `translate(${[0, band(i)]})`)
            .attr("fill", "black")
            .text(function (d) {
                return d;
            });

        // your firm dots
        root.append("g")
            .classed("firm-dots", true)
            .attr("style", "transform: translateY(" + [margin.top] + "px)")
            .selectAll("circle")
            .data(data.map((item) => item.firmDot))
            .join("circle")
            .attr("r", 4)
            .attr("class", "firm")
            .attr("fill", (_, i) => colors[(i / 1) | 0])
            .attr("stroke", "black")
            .attr("cy", (_, i) => band(i))
            .attr("cx", (d) => scale(d));
        root.select("g.firm-dots")
            .selectAll("text")
            .data(data.map((item) => item.firmDot))
            .join("text")
            .attr("y", (_, i) => band(i))
            .attr("x", (d) => scale(d))
            .attr("style", `transform: translate(${-10}px, ${-10}px)`)
            .attr("fill", "black")
            .text((_, i) => `Firm ${i}`);
    }
</script>

<template>
    <svg ref="svgRef" style="width: 100%; height: 100%">
        <g :transform="'translate(' + margin.left + ',' + margin.top + ')'"></g>
    </svg>
</template>
