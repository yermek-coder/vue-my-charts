<template>
    <div class="mb-3">
        <input
            @focus="onFocus"
            @blur="onBlur"
            :type="type"
            v-model="currency"
            step="1"
            ref="inputEl"
            class="form-control"
            :max="max"
            :min="min"
            :required="required"
        />
    </div>
</template>

<script>
    export default {
        props: ["modelValue", "required", "min", "max"],
        data() {
            return {
                currency: "",
                focused: false,
            };
        },
        computed: {
            value: {
                get() {
                    return JSON.parse(JSON.stringify(this.modelValue || ""));
                },
                set(val) {
                    this.$emit("update:modelValue", parseFloat(val || "0"));
                },
            },
            type() {
                return this.focused ? "number" : "text";
            },
        },
        watch: {
            value: {
                handler(value) {
                    this.currency = this.formatToCurrency(value);
                },
                immediate: true,
            },
            async focused(bool) {
                if (bool) {
                    this.currency = this.value;
                } else {
                    await this.$nextTick();
                    this.value = this.currency;
                    this.currency = this.formatToCurrency(this.value);
                }
            },
        },
        methods: {
            formatToCurrency(int) {
                if (int) {
                    var options = {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                    };
                    var numberFormat = new Intl.NumberFormat("en", options);
                    return numberFormat.format(parseFloat(int));
                }
            },
            onFocus() {
                this.focused = true;
            },
            onBlur(e) {
                if (e.srcElement.reportValidity()) {
                    this.focused = false;
                }
            },
        },
    };
</script>
