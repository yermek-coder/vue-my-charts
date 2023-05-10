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
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1"
                            >$</span
                        >
                        <input
                            v-model="account.assets"
                            type="number"
                            :max="maxBucket"
                            min="0"
                            class="form-control"
                            aria-describedby="basic-addon1"
                            required
                        />
                    </div>
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
                                :max="maxPercentile"
                                :min="minPercentile"
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
                    <div class="col-3">$ {{ totalAssets || 0 }}</div>
                    <div class="col-4">
                        {{ minBps || 50 }}-{{ maxBps || 65 }} BPS
                    </div>
                </div>
            </div>
            <div
                v-for="acc in activeAccounts"
                class="bg-white p-3 rounded-bottom"
            >
                <div class="row">
                    <div class="col-5">{{ acc.service }}</div>
                    <div class="col-3">{{ acc.assets }}</div>
                    <div v-if="acc.bps" class="col-4">{{ acc.bps }} BPS</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed, onMounted } from "vue";
    import { ref } from "vue";
    import account_data from "./account_data";
    import WhiskerPlot from "./WhiskerPlot.vue";
    import { bisectCenter, median } from "d3";

    const MAX_ACCOUNTS = 6;

    const services = ref([]);
    const serviceTitles = computed(() => [
        ...new Set(services.value.map((account) => account.service)),
    ]);
    const maxBucket = computed(
        () => services.value[services.value.length - 1].bucket
    );
    const maxPercentile = computed(() =>
        services.value.reduce((acc, account) => {
            return Math.max(acc, account.percentile_75 + 10);
        }, -Infinity)
    );
    const minPercentile = computed(() =>
        services.value.reduce((acc, account) => {
            return Math.min(acc, account.percentile_25 - 10);
        }, +Infinity)
    );

    const accountsCount = ref(1);
    const accounts = ref([]);
    const activeAccounts = computed(() =>
        accounts.value.slice(0, accountsCount.value)
    );

    const totalAssets = computed(() =>
        activeAccounts.value.reduce((a, b) => a + b.assets, 0)
    );
    const minBps = computed(() =>
        activeAccounts.value.reduce((a, b) => Math.min(a, b.bps), +Infinity)
    );
    const maxBps = computed(() =>
        activeAccounts.value.reduce((a, b) => Math.max(a, b.bps), -Infinity)
    );

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
        compressBps();
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
                ],
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
</script>
