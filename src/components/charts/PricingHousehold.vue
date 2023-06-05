<template>
    <div class="col-12 col-xl-12 stretch-card">
        <div class="row flex-grow-1">
            <div class="col-md-4 col-sm-12 grid-margin stretch-card">
                <div class="card card-wrapper">
                    <form @submit.prevent="regeneratePlot" class="card-body">
                        <div class="my-4">
                            <label class="card-title"
                                >Total Relationship Assets</label
                            >
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span
                                        class="input-group-text"
                                        id="basic-addon1"
                                        >$</span
                                    >
                                </div>
                                <input
                                    type="number"
                                    :class="[
                                        'form-control',
                                        selectThree.assetError
                                            ? 'border-danger'
                                            : '',
                                    ]"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    v-model="selectThree.asset"
                                    :max="25000000"
                                    :min="0"
                                    required
                                />
                            </div>
                            <div
                                v-if="selectThree.assetError"
                                class="text-danger small"
                            >
                                The value should be betwwen 0 - 25000000
                            </div>
                        </div>
                        <div class="mb-3" v-if="showRel">
                            <label class="card-title"
                                >What do you charge for the relationship</label
                            >
                            <div class="input-group">
                                <input
                                    type="number"
                                    :class="[
                                        'form-control',
                                        selectThree.assetRelError
                                            ? 'border-danger'
                                            : '',
                                    ]"
                                    aria-label="Recipient's username"
                                    aria-describedby="basic-addon2"
                                    required
                                    :max="160"
                                    :min="0"
                                    v-model="selectThree.assetRel"
                                />
                                <div class="input-group-append">
                                    <span
                                        class="input-group-text"
                                        id="basic-addon2"
                                        >bps</span
                                    >
                                </div>
                            </div>
                            <div
                                v-if="selectThree.assetRelError"
                                class="text-danger small"
                            >
                                The value should be betwwen 0 - 200
                            </div>
                        </div>

                        <button
                            class="btn btn-primary text-capitalize mt-3 w-100"
                            type="submit"
                        >
                            calculate
                        </button>
                    </form>
                </div>
            </div>

            <div class="col-md-8 col-sm-12 grid-margin stretch-card">
                <div class="card">
                    <div class="card-body">
                        <div class="col-xl-12">
                            <h6 class="card-title">
                                Relationship Market Price
                            </h6>
                            <!-- <div id="chart"> -->
                            <LineChart
                                :data="lineChartData.series"
                                :point="lineChartPoint.point"
                            />
                            <!-- <apexchart type="line" height="350" :options="chartData.chartOptions" :series="chartData.series"></apexchart> -->
                            <!-- </div> -->

                            <div class="line-info col-12">
                                <span class="bedge blue">Your Firm</span>
                                <span class="bedge green">25 Percentile</span>
                                <span class="bedge yellow">Median</span>
                                <span class="bedge red">75 Percentile</span>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr style="background-color: #e8a2c1">
                                        <th>Total Assets</th>
                                        <th>Market Price</th>
                                        <th>Your Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {{
                                                selectThree.asset == "" ||
                                                selectThree.asset == undefined
                                                    ? ""
                                                    : `$
                                            ${selectThree.asset}`
                                            }}
                                        </td>
                                        <td>
                                            {{
                                                selectThree.bpsMin === "" ||
                                                selectThree.bpsMax === ""
                                                    ? ""
                                                    : `${selectThree.bpsMin}-${selectThree.bpsMax} bps`
                                            }}
                                        </td>
                                        <td>
                                            {{
                                                selectThree.assetRel == "" ||
                                                selectThree.assetRel ==
                                                    undefined
                                                    ? ""
                                                    : `${selectThree.assetRel} bps`
                                            }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <br /><br />
                            <p
                                v-show="
                                    selectThree.assetRel < selectThree.bpsMin
                                "
                            >
                                You currently charge
                                <u>less then the market </u> for a relationship
                                of this size. we would recommend
                                <u>raising your price</u> by
                                <u
                                    >{{
                                        selectThree.bpsMin -
                                        selectThree.assetRel
                                    }}
                                    bps or more</u
                                >.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { onMounted, watch } from "vue";
    import { reactive, ref } from "vue";
    import household_data from "./household_data";
    import LineChart from "./LineChart.vue";
    export default {
        props: {
            check: {
                type: Number,
                required: false,
                default: () => 0,
            },
        },
        components: {
            LineChart,
        },
        setup(props) {
            const lineChartData = reactive({
                series: [
                    {
                        color: "#26E7A5",
                        values: [
                            { x: 5000, y: 0 },
                            { x: 25000, y: 60 },
                            { x: 50000, y: 79 },
                            { x: 100000, y: 83 },
                            { x: 150000, y: 83 },
                            { x: 250000, y: 86 },
                            { x: 500000, y: 85 },
                            { x: 750000, y: 87 },
                            { x: 1000000, y: 81 },
                            { x: 1500000, y: 82 },
                            { x: 2500000, y: 78 },
                            { x: 5000000, y: 67 },
                            { x: 10000000, y: 49 },
                            { x: 15000000, y: 34 },
                            { x: 25000000, y: 32 },
                        ],
                    },
                    {
                        color: "#FEBB3B",
                        values: [
                            { x: 5000, y: 68 },
                            { x: 25000, y: 108 },
                            { x: 50000, y: 115 },
                            { x: 100000, y: 109 },
                            { x: 150000, y: 109 },
                            { x: 250000, y: 109 },
                            { x: 500000, y: 108 },
                            { x: 750000, y: 105 },
                            { x: 1000000, y: 100 },
                            { x: 1500000, y: 90 },
                            { x: 2500000, y: 81 },
                            { x: 5000000, y: 75 },
                            { x: 10000000, y: 61 },
                            { x: 15000000, y: 49 },
                            { x: 25000000, y: 47 },
                        ],
                    },
                    {
                        color: "#FF6077",
                        values: [
                            { x: 5000, y: 112 },
                            { x: 25000, y: 138 },
                            { x: 50000, y: 144 },
                            { x: 100000, y: 140 },
                            { x: 150000, y: 142 },
                            { x: 250000, y: 136 },
                            { x: 500000, y: 130 },
                            { x: 750000, y: 125 },
                            { x: 1000000, y: 120 },
                            { x: 1500000, y: 109 },
                            { x: 2500000, y: 94 },
                            { x: 5000000, y: 82 },
                            { x: 10000000, y: 74 },
                            { x: 15000000, y: 60 },
                            { x: 25000000, y: 58 },
                        ],
                    },
                ],
            });
            const lineChartPoint = reactive({ point: { x: 0, y: 0 } });

            const selectThree = reactive({
                asset: "",
                assetRel: "",
                bpsMin: "",
                bpsMax: "",
                assetError: null,
                assetRelError: null,
            });
            const householdData = reactive({
                data: [],
            });
            const regeneratePlot = () => {
                // Calculate Data
                let resultArr = householdData.data.filter((hhData) => {
                    return (
                        parseInt(selectThree.asset) <=
                            parseInt(hhData.bucket) && selectThree.asset
                    );
                });

                if (resultArr[0] == undefined) {
                    selectThree.bpsMin = "";
                    selectThree.bpsMax = "";
                } else {
                    selectThree.bpsMin = parseInt(resultArr[0].percentile_25);
                    selectThree.bpsMax = parseInt(resultArr[0].percentile_75);
                }

                // Regenerate Plot
                let scatterX =
                    selectThree.asset == "" || selectThree.asset == null
                        ? 0
                        : selectThree.asset;
                let scatterY =
                    selectThree.assetRel == "" || selectThree.assetRel == null
                        ? 0
                        : selectThree.assetRel;

                lineChartData.series = [
                    {
                        color: "#26E7A5",
                        values: [
                            { x: 5000, y: 0 },
                            { x: 25000, y: 60 },
                            { x: 50000, y: 79 },
                            { x: 100000, y: 83 },
                            { x: 150000, y: 83 },
                            { x: 250000, y: 86 },
                            { x: 500000, y: 85 },
                            { x: 750000, y: 87 },
                            { x: 1000000, y: 81 },
                            { x: 1500000, y: 82 },
                            { x: 2500000, y: 78 },
                            { x: 5000000, y: 67 },
                            { x: 10000000, y: 49 },
                            { x: 15000000, y: 34 },
                            { x: 25000000, y: 32 },
                        ],
                    },
                    {
                        color: "#FEBB3B",
                        values: [
                            { x: 5000, y: 68 },
                            { x: 25000, y: 108 },
                            { x: 50000, y: 115 },
                            { x: 100000, y: 109 },
                            { x: 150000, y: 109 },
                            { x: 250000, y: 109 },
                            { x: 500000, y: 108 },
                            { x: 750000, y: 105 },
                            { x: 1000000, y: 100 },
                            { x: 1500000, y: 90 },
                            { x: 2500000, y: 81 },
                            { x: 5000000, y: 75 },
                            { x: 10000000, y: 61 },
                            { x: 15000000, y: 49 },
                            { x: 25000000, y: 47 },
                        ],
                    },
                    {
                        color: "#FF6077",
                        values: [
                            { x: 5000, y: 112 },
                            { x: 25000, y: 138 },
                            { x: 50000, y: 144 },
                            { x: 100000, y: 140 },
                            { x: 150000, y: 142 },
                            { x: 250000, y: 136 },
                            { x: 500000, y: 130 },
                            { x: 750000, y: 125 },
                            { x: 1000000, y: 120 },
                            { x: 1500000, y: 109 },
                            { x: 2500000, y: 94 },
                            { x: 5000000, y: 82 },
                            { x: 10000000, y: 74 },
                            { x: 15000000, y: 60 },
                            { x: 25000000, y: 58 },
                        ],
                    },
                ];

                lineChartPoint.point = {
                    x: scatterX,
                    y: scatterY,
                };
            };
            watch(selectThree, (value) => {
                // regeneratePlot(); //Http call to get household data

                if (
                    value.asset &&
                    (!Number(value.asset) || Number(value.asset) > 25000000)
                ) {
                    value.assetError = true;
                } else {
                    value.assetError = null;
                }
                if (
                    value.assetRel &&
                    (!Number(value.assetRel) || Number(value.assetRel) > 200)
                ) {
                    value.assetRelError = true;
                } else {
                    value.assetRelError = null;
                }
            });
            const showRel = props.check === "0" ? false : true;

            onMounted(async () => {
                // axios
                //     .get('/api/get_household_data')
                //     .then(response => {
                //         householdData.data = response.data;
                //     });
                householdData.data = await new Promise((resolve) => {
                    setTimeout(() => resolve(household_data), 300);
                });
                regeneratePlot(); //Http call to get household data
            });
            return {
                regeneratePlot,
                selectThree,
                showRel,
                lineChartData,
                lineChartPoint,
            };
        },
    };
</script>
<style scoped>
    .card.card-wrapper {
        background-color: #9dbad2;
    }

    .progress-bar {
        background-color: #000 !important;
    }

    .table thead th {
        color: #000 !important;
    }

    .line-info {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 35px 10px;
    }

    .bedge {
        color: #ffffff;
        font-size: 12px;
        font-weight: 500;
        border-radius: 100px;
        padding: 4px 10px;
    }

    .blue {
        background: #008ffb;
        margin-right: 0.5rem;
    }

    .green {
        background: #26e7a5;
        margin-right: 0.5rem;
        margin-left: 0.5rem;
    }

    .yellow {
        background: #febb3b;
        margin-right: 0.5rem;
        margin-left: 0.5rem;
    }

    .red {
        background: #ff6077;
        margin-left: 0.5rem;
    }
</style>
