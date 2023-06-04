<script setup>
    import { ref } from "vue";

    import LineChart from "./components/charts/LineChart.vue";
    import WhiskerPlot from "./components/charts/WhiskerPlot.vue";
    import PricingAccount from "./components/charts/PricingAccount.vue";
    import PricingAccount2 from "./components/charts/PricingAccount2.vue";
    import PricingHousehold from "./components/charts/PricingHousehold.vue";
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

    // const whiskerData = ref(generateWhiskerData());

    updateLines();
</script>

<template>
    <main class="container bg-secondary bg-opacity-25">
        <!-- <button @click="updateLines">Update LineChart</button>
        <div class="graph">
            <LineChart :data="lineChartData" :point="lineChartPoint" />
        </div>

        <button @click="whiskerData = generateWhiskerData()">
            Update Whisker Plot Chart
        </button> -->
        <div class="row">
            <!-- <PricingAccount /> -->
            <PricingAccount2 />
        </div>
        <div class="row">
            <PricingHousehold />
        </div>
    </main>
</template>

<style scoped>
    .graph {
        width: 600px;
        height: 400px;
    }
</style>
