<template>
    <div class="row flex-grow-1">
        <div class="col-md-5 grid-margin stretch-card">
            <div class="card card-wrapper">
                <div class="card-body">
                    <div class="col-12 my-2">
                        <div class="row mb-5">
                            <div class="col-md-7">
                                <div class="row">
                                    <h4 class="card-title bold">
                                        How many accounts do you <br />
                                        want to price?
                                    </h4>
                                </div>
                                <div class="row">
                                    <div class="btn-group">
                                        <button
                                            type="button"
                                            class="btn"
                                            data-bs-toggle="dropdown"
                                            id="priceButton"
                                            value="1"
                                        >
                                            {{ selectAccount.number }}
                                        </button>
                                        <button
                                            type="button"
                                            style="background-color: white"
                                            class="btn dropdown-toggle dropdown-toggle-split reduced-drop"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                            id="priceSelect"
                                        ></button>
                                        <div
                                            class="dropdown-menu price-selection"
                                            id="priceOptions"
                                        >
                                            <div
                                                class="dropdown-item"
                                                role="menu"
                                                :key="k"
                                                v-for="(
                                                    number, k
                                                ) in selectAccount.numberOptions"
                                                @click="setPriceAccount(number)"
                                            >
                                                <span role="menu">
                                                    {{ number }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row align-items-center" :gutter="5">
                            <div class="col-md-7 col-sm-12">
                                <div class="row align-items-center">
                                    <label
                                        class="my-2 font-weight-bold h4 card-title"
                                        >Service</label
                                    >
                                    <div
                                        class="btn-group my-2"
                                        id="priceService"
                                        v-for="(
                                            number, index
                                        ) in selectAccount.number"
                                        :key="number"
                                    >
                                        <button
                                            type="button"
                                            :class="[
                                                'btn',
                                                'mb-3',
                                                selectAccount.accountPrices[
                                                    index
                                                ].valueError
                                                    ? 'mt-38'
                                                    : '',
                                            ]"
                                            data-bs-toggle="dropdown"
                                            style="
                                                height: 38px;
                                                width: 100px;
                                                color: black;
                                                background-color: white;
                                            "
                                            value="1"
                                        >
                                            {{
                                                selectAccount.accountPrices[
                                                    index
                                                ].name
                                            }}
                                        </button>
                                        <button
                                            type="button"
                                            style="
                                                background-color: white;
                                                height: 38px;
                                            "
                                            class="btn dropdown-toggle dropdown-toggle-split mb-3 reduced-drop"
                                            :class="[
                                                selectAccount.accountPrices[
                                                    index
                                                ].valueError
                                                    ? 'mt-38'
                                                    : '',
                                            ]"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                            ref="priceOption"
                                        ></button>
                                        <div class="dropdown-menu">
                                            <div
                                                class="dropdown-item"
                                                id="optionPriceSelect"
                                                role="menu"
                                                :key="k"
                                                v-for="(
                                                    name, k
                                                ) in selectAccount.options"
                                                @click="
                                                    setPriceName(
                                                        index,
                                                        name,
                                                        $event
                                                    )
                                                "
                                            >
                                                <span role="menu">
                                                    {{ name }}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            v-if="
                                                selectAccount.accountPrices[
                                                    index
                                                ].valueError
                                            "
                                            :class="[
                                                selectAccount.accountPrices[
                                                    index
                                                ].valueError
                                                    ? 'mt-7'
                                                    : '',
                                            ]"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-5 col-sm-12">
                                <div class="row align-items-center">
                                    <label
                                        class="my-2 font-weight-bold h4 card-title"
                                        >Assets</label
                                    >
                                    <div
                                        class="btn-group my-2"
                                        v-for="(
                                            price, index
                                        ) in selectAccount.accountPrices"
                                        :key="index"
                                    >
                                        <div class="input-group mb-3">
                                            <div
                                                v-if="price.valueError"
                                                class="text-danger row small"
                                            >
                                                The value should be between 0 -
                                                15000000
                                            </div>
                                            <div class="input-group-prepend">
                                                <span
                                                    class="input-group-text"
                                                    id="basic-addon1"
                                                    >$</span
                                                >
                                            </div>
                                            <input
                                                type="text"
                                                :class="[
                                                    'form-control',
                                                    price.valueError
                                                        ? 'border-danger'
                                                        : '',
                                                ]"
                                                aria-label="Username"
                                                aria-describedby="basic-addon1"
                                                v-model="price.value"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h6 class="card-title font-weight-bold h4">
                        Your fee for these accounts
                    </h6>
                    <table>
                        <tr
                            :key="i"
                            v-for="(price, i) in selectAccount.accountPrices"
                        >
                            <td width="62%" class="align-items-center">
                                {{ price.name }}
                            </td>
                            <td width="38%" class="align-items-center">
                                <div class="input-group mb-3">
                                    <input
                                        type="text"
                                        :class="[
                                            'form-control',
                                            price.feeError
                                                ? 'border-danger'
                                                : '',
                                        ]"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        v-model="price.fee"
                                    />
                                    <div class="input-group-append">
                                        <span
                                            class="input-group-text"
                                            id="basic-addon2"
                                            >bps</span
                                        >
                                    </div>
                                    <div
                                        v-if="price.feeError"
                                        class="text-danger row small"
                                    >
                                        The value should be betwwen 0 - 200
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <div class="row">
                        <button
                            type="button"
                            class="btn btn-primary"
                            @click="regeneratePlot()"
                        >
                            Calculate
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-7 grid-margin stretch-card">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">Market Price</h6>
                    <div class="container">
                        <!-- <div id="chart"> -->
                        <!-- <apexchart ref="priceChart" type="boxPlot" height="350" :options="chartData.chartOptions" :series="chartData.series"></apexchart> -->
                        <!-- <WhiskerPlot :data="plotData.series" /> -->
                        <!-- </div> -->
                    </div>
                </div>

                <!-- <div>
          <div style="width: 200px; float: left">&nbsp;&nbsp;&nbsp;</div>
          <div
            class="diag"
            style="float: left; border: solid 1px; width: 100px; height: 15px"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
          <div style="float: left; width: 100px; height: 15px">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div
              style="margin-top: -39px;
                padding-left: 50px !important;
                font-size: 30px;
              "
            >
              &#x25CF;
            </div>
          </div>

          <div
            class="diag"
            style="float: left; border: solid 1px; width: 50px; height: 15px"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>

          <div style="clear: both"></div>
        </div> -->

                <!-- <div style="margin-bottom: 20px">
          <div style="width: 200px; float: left">&nbsp;</div>
          <div style="float: left; width: 400px; height: 15px; font-size: 10px">
            <span style="margin-top: 40px">25th% 75th%</span>

            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; You
              Form</span
            >
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 100 bps</span
            >
          </div>
          <div style="clear: both"></div>
        </div> -->
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr style="background-color: #e8a2c1">
                                <th>Total</th>
                                <th>{{ `$ ${selectAccount.totalPrice}` }}</th>
                                <th>
                                    {{
                                        selectAccount.bpsMin === "" ||
                                        selectAccount.bpsMax === ""
                                            ? ""
                                            : `${selectAccount.bpsMin}-${selectAccount.bpsMax} bps`
                                    }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(
                                    price, index
                                ) in selectAccount.accountPrices"
                                :key="index"
                            >
                                <td>{{ price.name }}</td>
                                <td>
                                    {{ price.value ? `$ ${price.value}` : "" }}
                                </td>
                                <td>{{ price.bps ? price.bps : "" }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { onMounted, watch } from "vue";
    import { reactive, ref } from "vue";
    import account_data from "./account_data";
    // import VueApexCharts from "vue3-apexcharts";
    import WhiskerPlot from "./WhiskerPlot.vue";
    export default {
        components: {
            WhiskerPlot,
        },
        setup() {
            let average = reactive(0);
            const plotData = reactive({
                series: [
                    {
                        title: "Total",
                        points: [25, 35, 50, 65, 75],
                        firmDot: 50,
                    },
                    {
                        title: "Investment Management",
                        points: [25, 35, 50, 65, 75],
                        firmDot: 50,
                    },
                    // {
                    //     title: 'Investment Management',
                    //     points: [100 - 105, 102 - 105, 150 - 105, 165 - 105, 175 - 105],
                    //     firmDot: 50 ,
                    // },
                ],
            });
            const priceOption = ref(null);
            const chartData = reactive({
                series: [
                    {
                        data: [
                            {
                                x: "Total",
                                y: [25, 35, 50, 65, 75],
                            },
                            {
                                x: "Investment Management",
                                y: [25, 35, 50, 65, 75],
                            },
                        ],
                    },
                ],
                chartOptions: {
                    chart: {
                        id: "chart",
                        type: "boxPlot",
                        height: 350,
                    },
                    title: {
                        text: "Market Price",
                        align: "left",
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            barHeight: "50%",
                        },
                        boxPlot: {
                            colors: {
                                upper: "#e9ecef",
                                lower: "#f8f9fa",
                            },
                        },
                    },
                    stroke: {
                        colors: ["#6c757d"],
                    },
                },
            });
            const apiCalled = reactive({
                call: false,
            });
            const accountData = reactive({
                data: [],
            });
            const selectAccount = reactive({
                number: 1,
                numberOptions: [1, 2, 3, 4, 5, 6],
                totalPrice: 0,
                bpsMin: "50",
                bpsMax: "65",
                accountPrices: [
                    {
                        name: "Investment Management",
                        value: null,
                        valueError: null,
                        fee: null,
                        feeError: null,
                        bps: null,
                    },
                ],
                options: [
                    "Investment Management",
                    "Irrevocable Trust",
                    "Revocable Trust",
                    "IRA",
                ],
            });
            const setPriceAccount = (value) => {
                selectAccount.number = value;
                selectAccount.bpsMin = "50";
                selectAccount.bpsMax = "65";

                selectAccount.accountPrices = [];
                let newChartData = [
                    {
                        x: "Total",
                        y: [25, 35, 50, 65, 75],
                    },
                ];

                let newChartData2 = [
                    {
                        title: "Total",
                        points: [25, 35, 50, 65, 75],
                        firmDot: 50,
                    },
                ];
                for (let i = 1; i <= value; i++) {
                    selectAccount.accountPrices.push({
                        name: "Investment Management",
                        value: "",
                    });
                    newChartData.push({
                        x: "Investment Management",
                        y: [25, 35, 50, 65, 75],
                    });
                }

                for (let i = 1; i <= value; i++) {
                    // selectAccount.accountPrices.push({
                    //   name: "Investment Management",
                    //   value: "",
                    // });
                    newChartData2.push({
                        title: "Investment Management",
                        points: [25, 35, 50, 65, 75],
                        firmDot: 50,
                    });
                }

                chartData.chartOptions = {
                    chart: {
                        id: "chart",
                        type: "boxPlot",
                        height: 350,
                    },
                    title: {
                        text: "Market Price",
                        align: "left",
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            barHeight: "50%",
                        },
                        boxPlot: {
                            colors: {
                                upper: "#e9ecef",
                                lower: "#f8f9fa",
                            },
                        },
                    },
                    stroke: {
                        colors: ["#6c757d"],
                    },
                };

                plotData.series = newChartData2;
                chartData.series = [
                    {
                        data: newChartData,
                    },
                ];
            };
            const setPriceName = (value, name, event) => {
                selectAccount.accountPrices[value].name = name;
                if (priceOption.value) {
                    priceOption.value[0].click();
                }
            };
            const regeneratePlot = () => {
                let newChartData = [];
                let newChartData2 = [];
                let totalChartObj = {};
                let totalChartObj2 = {};
                let percentile25 = 0;
                let percentile50 = 0;
                let percentile75 = 0;
                let totalAsset = 0;

                let val1 = 0;
                let val2 = 0;
                let val3 = 0;
                let val4 = 0;
                let val5 = 0;

                let firmdotval = 0;
                let firmdotavg = 0;

                let resultval1 = 0;
                let resultval2 = 0;
                let resultval3 = 0;
                let resultval4 = 0;
                let resultval5 = 0;

                let resultfirmdotval = 0;
                let resultfirmdotavg = 0;

                let totalBPS = 0;

                let total50s = 0;
                // Loop for total asset
                for (let i = 0; i < selectAccount.accountPrices.length; i++) {
                    if (selectAccount.accountPrices[i].value) {
                        let resultTotalArr = accountData.data.filter(
                            (accData) => {
                                return (
                                    selectAccount.accountPrices[i].name ==
                                        accData.service &&
                                    parseInt(
                                        selectAccount.accountPrices[i].value
                                    ) <= parseInt(accData.bucket) &&
                                    selectAccount.accountPrices[i].value
                                );
                            }
                        );

                        if (resultTotalArr[0] != undefined) {
                            //   totalAsset = totalAsset + parseInt(selectAccount.accountPrices[i].value);
                            //   percentile25 = percentile25 + parseFloat(selectAccount.accountPrices[i].value * (resultTotalArr[0].percentile_25 / 10000));
                            //   percentile50 = percentile50 + parseFloat(selectAccount.accountPrices[i].value * (resultTotalArr[0].percentile_50 / 10000));
                            //   percentile75 = percentile75 + parseFloat(selectAccount.accountPrices[i].value * (resultTotalArr[0].percentile_75 / 10000));

                            totalAsset =
                                totalAsset +
                                parseInt(selectAccount.accountPrices[i].value);

                            percentile25 += resultTotalArr[0].percentile_25;
                            percentile50 += resultTotalArr[0].percentile_50;
                            percentile75 += resultTotalArr[0].percentile_75;

                            total50s += resultTotalArr[0].percentile_50;
                        }
                    }

                    totalBPS += parseInt(selectAccount.accountPrices[i]?.fee);
                }

                average = total50s / selectAccount.accountPrices.length;

                console.log("average checker", average);

                console.log("checker", percentile25, percentile75, totalAsset);

                console.log("totalBPS", totalBPS);

                const averageBPS =
                    totalBPS / selectAccount.accountPrices.length;

                //   if (totalAsset > 0) {
                //     percentile25 = Math.round((percentile25 / totalAsset) * 10000);
                //     percentile50 = Math.round((percentile50 / totalAsset) * 10000);
                //     percentile75 = Math.round((percentile75 / totalAsset) * 10000);
                //   }

                if (totalAsset > 0) {
                    percentile25 = Math.round(
                        percentile25 / selectAccount.accountPrices.length
                    );
                    percentile50 = Math.round(
                        percentile50 / selectAccount.accountPrices.length
                    );
                    percentile75 = Math.round(
                        percentile75 / selectAccount.accountPrices.length
                    );
                }

                totalChartObj = {
                    x: "Total",
                    y: [
                        percentile25 - 10,
                        percentile25,
                        percentile50,
                        percentile75,
                        parseInt(percentile75) + parseInt(10),
                    ],
                };

                val1 = percentile25 - 10;
                val2 = percentile25;
                val3 = percentile50;
                val4 = percentile75;
                val5 = parseInt(percentile75) + parseInt(10);

                firmdotval = +val1 + +val2 + +val3 + +val4 + +val5;

                firmdotavg = +(firmdotval / 5);

                totalChartObj2 = {
                    title: "Total",
                    points: [
                        +percentile25 - 10,
                        +percentile25,
                        +percentile50,
                        +percentile75,
                        +parseInt(percentile75) + parseInt(10),
                    ],
                    firmDot: averageBPS,
                };

                selectAccount.bpsMin = percentile50;
                selectAccount.bpsMax = percentile75;

                newChartData.push(totalChartObj);
                newChartData2.push(totalChartObj2);

                // Loop for individual assets
                selectAccount.accountPrices.forEach((accPrice, index) => {
                    let resultArr = accountData.data.filter((accData) => {
                        return (
                            accPrice.name == accData.service &&
                            parseInt(accPrice.value) <=
                                parseInt(accData.bucket) &&
                            accPrice.value
                        );
                    });
                    if (resultArr[0] == undefined) {
                        newChartData.push({
                            x: "Investment Management",
                            y: [25, 35, 50, 65, 75],
                        });
                        selectAccount.accountPrices[index].bps =
                            50 + " - " + 65 + " bps";
                    } else {
                        newChartData.push({
                            x: resultArr[0].service,
                            y: [
                                resultArr[0].percentile_25 - 10,
                                +resultArr[0].percentile_25,
                                +resultArr[0].percentile_50,
                                +resultArr[0].percentile_75,
                                parseInt(resultArr[0].percentile_75) +
                                    parseInt(10),
                            ],
                        });
                        selectAccount.accountPrices[index].bps =
                            resultArr[0].percentile_50 +
                            " - " +
                            resultArr[0].percentile_75 +
                            " bps";
                    }
                });

                selectAccount.accountPrices.forEach((accPrice, index) => {
                    console.log(
                        "values----------->",
                        selectAccount.accountPrices[index]
                    );

                    let resultArr = accountData.data.filter((accData) => {
                        return (
                            accPrice.name == accData.service &&
                            parseInt(accPrice.value) <=
                                parseInt(accData.bucket) &&
                            accPrice.value
                        );
                    });
                    if (resultArr[0] == undefined) {
                        console.log("checker if ");

                        newChartData2.push({
                            title: "Investment Management",
                            points: [25, 35, 50, 65, 75],
                            firmDot: 50,
                        });
                        selectAccount.accountPrices[index].bps =
                            50 + " - " + 65 + " bps";
                    } else {
                        const diff = resultArr[0].percentile_50 - average;

                        resultval1 = resultArr[0].percentile_25 - 10;
                        resultval2 = resultArr[0].percentile_25;
                        resultval3 = resultArr[0].percentile_50;
                        resultval4 = resultArr[0].percentile_75;
                        resultval5 =
                            parseInt(resultArr[0].percentile_75) + parseInt(10);

                        resultfirmdotval =
                            +resultval1 +
                            +resultval2 +
                            +resultval3 +
                            +resultval4 +
                            +resultval5;

                        resultfirmdotavg = resultfirmdotval / 5;

                        console.log(
                            "checker individual",
                            resultArr[0].percentile_50,
                            diff
                        );
                        newChartData2.push({
                            title: resultArr[0].service,
                            points: [
                                +(resultArr[0].percentile_25 - 10) - diff,
                                +resultArr[0].percentile_25 - diff,
                                +resultArr[0].percentile_50 - diff,
                                +resultArr[0].percentile_75 - diff,
                                parseInt(resultArr[0].percentile_75) +
                                    parseInt(10) -
                                    diff,
                            ],
                            // points: [(+percentile25 - 10)*2 ,+percentile25*2, +percentile50*2, +percentile75*2, (+parseInt(percentile75) + parseInt(10))*2],
                            // points: [(+percentile25 - 10)  ,+percentile25 , +percentile50  , +percentile75 , (+parseInt(percentile75) + parseInt(10)) ],

                            firmDot: selectAccount.accountPrices[index].fee,
                        });
                        selectAccount.accountPrices[index].bps =
                            resultArr[0].percentile_50 +
                            " - " +
                            resultArr[0].percentile_75 +
                            " bps";
                    }

                    // console.log('average state',diff, average )
                });

                chartData.chartOptions = {
                    chart: {
                        id: "chart",
                        type: "boxPlot",
                        height: 350,
                    },
                    title: {
                        text: "Market Price",
                        align: "left",
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            barHeight: "50%",
                        },
                        boxPlot: {
                            colors: {
                                upper: "#e9ecef",
                                lower: "#f8f9fa",
                            },
                        },
                    },
                    stroke: {
                        colors: ["#6c757d"],
                    },
                };

                //   console.log("newChartData2", newChartData2);
                plotData.series = newChartData2;
                chartData.series = [
                    {
                        data: newChartData,
                    },
                ];
            };
            watch(selectAccount, (value) => {
                selectAccount.totalPrice = 0;

                value.accountPrices.forEach((item, index) => {
                    if (
                        item.value &&
                        (!Number(item.value) || Number(item.value) > 15000000)
                    ) {
                        value.accountPrices[index].valueError = true;
                    } else {
                        value.accountPrices[index].valueError = null;
                        if (item.value !== "" && item.value !== null) {
                            selectAccount.totalPrice += parseInt(item.value);
                        }
                    }
                    if (
                        item.fee &&
                        (!Number(item.fee) || Number(item.fee) > 200)
                    ) {
                        value.accountPrices[index].feeError = true;
                    } else {
                        value.accountPrices[index].feeError = null;
                    }
                });
            });
            onMounted(() => {
                // axios
                //   .get('/api/get_account_data')
                //   .then(response => {
                //     accountData.data = response.data;
                //   });
                // uncomment this
                accountData.data = account_data;
            });
            return {
                selectAccount,
                setPriceName,
                regeneratePlot,
                priceOption,
                chartData,
                apiCalled,
                setPriceAccount,
                plotData,
            };
        },
    };
</script>
<style scoped>
    .btn-group .btn {
        background: #9dbad2 !important;
        color: #000 !important;
        border: 1.4px solid #000;
    }

    .card-title span {
        line-height: 2.2;
        float: right;
    }

    .container {
        height: 90%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .card.card-wrapper {
        background-color: #9dbad2;
    }
    .progress-bar {
        background-color: #000 !important;
    }
    .table thead th {
        color: #000 !important;
    }
    .reduced-drop {
        max-width: 40px !important;
    }
    .mt-38 {
        margin-top: 38px !important;
    }
</style>
