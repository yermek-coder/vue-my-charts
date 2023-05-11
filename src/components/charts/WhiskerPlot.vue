<script setup>
    import { watch, ref, onMounted, nextTick } from "vue";
    import * as d3 from "d3";
    import { boxplot, boxplotStats } from "d3-boxplot";
    import WhiskerPlotLegend from "./WhiskerPlotLegend.vue";

    const props = defineProps({
        data: {
            type: Array,
            required: true,
        },
    });

    const svgRef = ref(null);
    const margin = { top: 30, right: 40, bottom: 30, left: 70 };

    watch(
        () => [props.data, props.data.length],
        async () => {
            await nextTick();
            renderChart();
        }
    );
    onMounted(renderChart);

    const example = ref();

    function renderChart() {
        if (!props.data.length) return;

        const width = svgRef.value.clientWidth - margin.left - margin.right;
        const height = svgRef.value.clientHeight - margin.top - margin.bottom;

        svgRef.value.innerHTML = "";
        const root = d3.select(svgRef.value);
        root.append("g").attr("class", "plots");

        const { data } = props;
        const stats = data.map(function (d) {
            // console.log("d.paon = ", d);
            return boxplotStats(d.dots);
        });

        example.value = stats;

        const median = d3.median(stats.map((stat) => stat.boxes[0].end));

        const colors = d3.schemeCategory10;

        function getDomain(arr) {
            return arr
                .map((item) => item.dots)
                .flat()
                .reduce(
                    function (acc, val) {
                        // const min = Math.min(acc[0], val);
                        const max = Math.max(acc[1], val);
                        // return [min, max];
                        return [0, max];
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
            .boxwidth(42)
            .key((d) => d.points);

        root.select("g.plots")
            .attr(
                "transform",
                "translate(" + [margin.left + 90, margin.top] + ")"
            )
            .selectAll(".plot")
            .data(stats)
            .join("g")
            .attr("class", "plot")
            .attr("transform", (_, i) => `translate(${[0, band(i)]})`)
            .attr("color", (_, i) => colors[(i / 1) | 0])
            .call(plot)
            .each(function (d, i) {
                d3.select(this)
                    .selectAll("text")
                    .data([d.points[1].value, d.points[3].value])
                    .join("text")
                    .style("font-size", "10px")
                    .text(function (d) {
                        return d.toFixed(2);
                    })
                    .style("text-anchor", (_, i2) =>
                        i2 % 2 === 0 ? "middle" : "middle"
                    )
                    .attr("fill", (_) => colors[(i / 1) | 0])
                    .attr(
                        "transform",
                        (d, i2) =>
                            `translate(${[
                                scale(d) + (i2 % 2 === 0 ? 0 : 0),
                                -25,
                            ]})`
                    );
            })
            .append("text")
            .text(function (d) {
                return d.boxes[0].end.toFixed(2);
            })
            .style("font-size", "10px")
            .style("text-anchor", "middle")
            .attr("fill", (_, i) => colors[(i / 1) | 0])
            .attr(
                "transform",
                (d, i) => `translate(${[scale(d.boxes[0].end), -25]})`
            );

        // titles
        root.append("g")
            .attr("style", "transform: translateY(" + [margin.top + 5] + "px)")
            .selectAll("text")
            .data(data.map((item) => item.title))
            .join("text")
            .attr("class", "title")
            .attr("transform", (_, i) => `translate(${[0, band(i)]})`)
            // .attr("fill", "black")
            .attr("fill", (_, i) => colors[(i / 1) | 0])
            .text(function (d) {
                return d;
            });

        // your firm dots
        root.append("g")
            .classed("firm-dots", true)
            // .attr("style", "transform: translateY(" + [margin.top] + "px)")
            .attr(
                "style",
                "transform: translate(150px, " + [margin.top] + "px)"
            )
            .selectAll("circle")
            .data(data.map((item) => item.bps))
            .join("circle")
            .attr("r", 4)
            .attr("class", "firm")
            .attr("fill", (_, i) => colors[(i / 1) | 0])
            .attr("stroke", "black")
            .attr("cy", (_, i) => band(i))
            .attr("cx", (d) => scale(d) + 10);

        // median line
        root.select(".plots")
            .append("line")
            .attr("stroke", "black")
            .style("stroke-dasharray", "5, 5")
            .attr("x1", scale(median))
            .attr("y1", -20)
            .attr("x2", scale(median))
            .attr("y2", height - 20);

        root.select(".plots")
            .append("text")
            .text("Median")
            .style("text-anchor", "middle")
            .style("transform", `translate(${scale(median)}px, ${height}px)`);
    }
</script>

<template>
    <svg
        ref="svgRef"
        style="width: 100%"
        :style="{ height: `${105 * data.length + 1}px` }"
    >
        <g :transform="'translate(' + margin.left + ',' + margin.top + ')'"></g>
    </svg>

    <WhiskerPlotLegend></WhiskerPlotLegend>
</template>
