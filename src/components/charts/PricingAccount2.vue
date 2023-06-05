<template>
    <div class="row">
        <form
            @submit.prevent="calculate"
            class="col-md-5 p-4 bg-primary bg-opacity-25 rounded"
        >
            <div class="mb-5">
                <label for="accountsCount" class="form-label fw-bold"
                    >HOW MANY ACCOUNTS DO YOU WANT TO PRICE?</label
                >
                <select
                    v-model="accountsCount"
                    class="form-select"
                    id="accountsCount"
                >
                    <option v-for="i in MAX_ACCOUNTS" :key="i" :value="i">
                        {{ i }}
                    </option>
                </select>
            </div>

            <div class="row">
                <label class="form-label fw-bold col-7">Service</label>
                <label class="form-label fw-bold col">Assets</label>
            </div>

            <div
                v-for="(account, index) in accounts.slice(0, accountsCount)"
                :key="index"
                class="row mb-2"
            >
                <div class="col-7">
                    <select
                        id="`account${index}`"
                        v-model="account.service"
                        class="form-select mb-3"
                    >
                        <option
                            v-for="title in serviceTitles"
                            :key="title"
                            :value="title"
                        >
                            {{ title }}
                        </option>
                    </select>
                </div>
                <div class="col">
                    <CurrencyInput
                        v-model="account.assets"
                        :max="maxBucket"
                        min="0"
                        required
                    ></CurrencyInput>
                </div>
            </div>

            <div>
                <label class="form-label fw-bold"
                    >Your fee for these accounts</label
                >

                <div
                    class="row"
                    v-for="(account, index) in activeAccounts"
                    :key="index"
                >
                    <div class="col">{{ account.service }}</div>
                    <div class="col-5">
                        <div class="input-group mb-3">
                            <input
                                v-model="account.bps"
                                type="number"
                                class="form-control"
                                aria-describedby="bps"
                                max="200"
                                min="0"
                                required
                            />
                            <span class="input-group-text" id="bps">bps</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <button class="btn btn-primary">Calculate</button>
            </div>
        </form>
        <div class="col p-0 ms-3 d-flex flex-column">
            <div class="rounded-top bg-white p-3" style="flex-grow: 1">
                <label class="fw-bold">MARKET PRICE</label>
                <div>
                    <WhiskerPlot :data="graphData"></WhiskerPlot>
                </div>
            </div>

            <div class="w-100 p-3 bg-success bg-opacity-50">
                <div class="row">
                    <div class="col-5">TOTAL</div>
                    <div class="col-3">
                        {{
                            numToCurrency(
                                parseFloat(totalAssets || services[0]?.bucket)
                            )
                        }}
                    </div>
                    <div class="col-4">
                        {{ minPercentile }}-{{ maxPercentile }} BPS
                    </div>
                </div>
            </div>
            <div
                v-for="acc in activeAccounts"
                class="bg-white p-3 rounded-bottom"
            >
                <div class="row">
                    <div class="col-5">{{ acc.service }}</div>
                    <div class="col-3">
                        {{ numToCurrency(acc.assets || services[0]?.bucket) }}
                    </div>
                    <div class="col-4">
                        {{ acc.bps || graphData[0].bps }} BPS
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 mt-3 d-flex justify-content-end">
            <button @click="print" class="btn btn-link">Print Results</button>
        </div>
    </div>
</template>

<script setup>
    import { computed, onMounted } from "vue";
    import { ref } from "vue";
    import account_data from "./account_data";
    import WhiskerPlot from "./WhiskerPlot.vue";
    import CurrencyInput from "./CurrencyInput.vue";
    import { bisectCenter, median, max, min, sum } from "d3";

    const MAX_ACCOUNTS = 6;

    const services = ref([]);
    const serviceTitles = computed(() => [
        ...new Set(services.value.map((account) => account.service)),
    ]);
    const maxBucket = computed(
        () => services.value[services.value.length - 1].bucket
    );
    const maxPercentile = computed(() =>
        max(services.value.map((service) => service.percentile_75))
    );
    const minPercentile = computed(() =>
        min(services.value.map((service) => service.percentile_25))
    );

    const accountsCount = ref(1);
    const accounts = ref([]);
    const activeAccounts = computed(() =>
        accounts.value.slice(0, accountsCount.value)
    );

    function numToCurrency(int) {
        const options = {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        };
        const numberFormat = new Intl.NumberFormat("en", options);
        return numberFormat.format(int);
    }
    const totalAssets = computed(() =>
        sum(activeAccounts.value.map((acc) => acc.assets))
    );

    // const minBps = computed(() =>
    //     sum(activeAccounts.value.map((acc) => acc.bps))
    // );
    // const maxBps = computed(() =>
    //     activeAccounts.value.reduce((a, b) => Math.max(a, b.bps), -Infinity)
    // );

    const accountsPlot = computed(() =>
        activeAccounts.value.map((acc) => {
            const servicesByTitle = services.value.filter(
                (serv) => serv.service === acc.service
            );
            const index = bisectCenter(
                servicesByTitle.map((serv) => parseInt(serv.bucket)),
                acc.assets
            );
            const service = servicesByTitle[index];
            return {
                title: acc.service,
                bps: acc.bps,
                dots: [
                    parseInt(service.percentile_25) - 10,
                    parseInt(service.percentile_25),
                    parseInt(service.percentile_50),
                    parseInt(service.percentile_75),
                    parseInt(service.percentile_75) + 10,
                ],
            };
        })
    );

    function compressBps() {
        accountsPlot.value.forEach((acc, i) => {
            const [min, , , , max] = acc.dots;
            if (min > accounts.value[i].bps || max < accounts.value[i].bps)
                accounts.value[i].bps = [min, max][
                    bisectCenter([min, max], accounts.value[i].bps)
                ];
        });
    }

    const graphData = ref([]);
    function calculate() {
        // compressBps();
        const totalPercentiles = [1, 2, 3].map(
            (i) =>
                (activeAccounts.value
                    .map(
                        (item, i2) =>
                            item.assets *
                            (accountsPlot.value[i2].dots[i] / 10000)
                    )
                    .reduce((a, b) => a + b, 0) /
                    activeAccounts.value
                        .map((item) => item.assets)
                        .reduce((a, b) => a + b, 0)) *
                10000
        );

        graphData.value = [
            {
                title: "Total",
                dots: [
                    totalPercentiles[0] - 10,
                    ...totalPercentiles,
                    totalPercentiles[totalPercentiles.length - 1] + 10,
                ].map(Math.round),
                bps: median(activeAccounts.value.map((item) => item.bps)),
            },
            ...accountsPlot.value,
        ];
    }

    async function load() {
        // axios
        //   .get('/api/get_account_data')
        //   .then(response => {
        //     services.value = response.data;
        //   });
        // uncomment code above, delete 3 lines bellow
        services.value = await new Promise((resolve) => {
            setTimeout(() => resolve(account_data), 300);
        });
    }

    onMounted(async () => {
        await load();
        accounts.value = Array(MAX_ACCOUNTS)
            .fill(0)
            .map((_) => JSON.parse(JSON.stringify(services.value[0])));

        const firstServiceExample = {
            title: services.value[0].service,
            dots: [
                parseInt(services.value[0].percentile_25) - 10,
                parseInt(services.value[0].percentile_25),
                parseInt(services.value[0].percentile_50),
                parseInt(services.value[0].percentile_75),
                parseInt(services.value[0].percentile_75) + 10,
            ],
            bps: services.value[0].percentile_50,
        };
        graphData.value = [
            {
                title: "Total",
                dots: firstServiceExample.dots,
                bps: firstServiceExample.bps,
            },
            {
                title: firstServiceExample.title,
                dots: firstServiceExample.dots,
                bps: firstServiceExample.bps,
            },
        ];
    });

    function print() {
        window.print();
    }
</script>
