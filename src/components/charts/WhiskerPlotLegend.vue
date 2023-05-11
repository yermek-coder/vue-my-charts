<script setup>
    import { ref, onMounted } from "vue";
    import * as d3 from "d3";

    const svgRef = ref(null);

    onMounted(render);

    function render() {
        const root = d3.select(svgRef.value);

        root.select("g")
            .append("rect")
            .attr("x", 22)
            .attr("y", 0)
            .attr("width", 100)
            .attr("height", 20)
            .style("fill", "grey");
        root.select("g")
            .append("line")
            .attr("stroke", "grey")
            .attr("x1", 0)
            .attr("y1", 9)
            .attr("x2", 140)
            .attr("y2", 11);
        root.select("g")
            .append("line")
            .attr("stroke", "grey")
            .attr("x1", 1)
            .attr("y1", 0)
            .attr("x2", 1)
            .attr("y2", 20);
        root.select("g")
            .append("line")
            .attr("stroke", "grey")
            .attr("x1", 140)
            .attr("y1", 0)
            .attr("x2", 140)
            .attr("y2", 20);
        root.select("g")
            .append("text")
            .style("font-size", "14px")
            .attr("x", 10)
            .attr("y", 35)
            .text("25th %");
        root.select("g")
            .append("text")
            .style("font-size", "14px")
            .attr("x", 100)
            .attr("y", 35)
            .text("75th %");

        // circle
        root.select("g")
            .append("circle")
            .attr("r", 4)
            .attr("fill", "grey")
            .attr("stroke", "black")
            .attr("cx", 200)
            .attr("cy", 10);
        root.select("g")
            .append("text")
            .style("font-size", "14px")
            .attr("x", 170)
            .attr("y", 35)
            .text("Your Firm");
    }
</script>

<template>
    <div class="d-flex justify-content-center">
        <svg ref="svgRef" style="width: 240px; height: 3rem">
            <g></g>
        </svg>
    </div>
</template>
