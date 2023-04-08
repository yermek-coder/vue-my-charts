<script setup>
    import { ref } from "vue";

    import LineChart from "./components/charts/LineChart.vue";
    import WhiskerPlot from "./components/charts/WhiskerPlot.vue";
    import {
        generateLinesData,
        generateWhiskerData,
    } from "./components/charts/utils";

    const lineChartData = ref();
    const lineChartPoint = ref();

    const updateLines = () => {
        const { data, point } = generateLinesData();
        lineChartData.value = data;
        lineChartPoint.value = point;
    };

    const whiskerData = ref(generateWhiskerData());

    updateLines();
</script>

<template>
    <main>
        <button @click="updateLines">Update LineChart</button>
        <div class="graph">
            <LineChart :data="lineChartData" :point="lineChartPoint" />
        </div>

        <button @click="whiskerData = generateWhiskerData()">
            Update Whisker Plot Chart
        </button>
        <div class="graph">
            <WhiskerPlot :data="whiskerData" />
        </div>
    </main>
</template>

<style scoped>
    .graph {
        width: 600px;
        height: 400px;
    }
    main > * {
        display: block;
    }
</style>
