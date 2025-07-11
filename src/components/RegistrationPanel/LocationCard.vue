<template>
    <div class="mx-5 mt-10">
        <v-form ref="inputValidation" @submit.prevent="insertLocationInfo" lazy-validation>

            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field color="teal" label="Address Line 1" density="compact"
                        v-model="UserlocationInfo.addrLine1" variant="outlined" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field color="teal" label="Address Line 2" density="compact"
                        v-model="UserlocationInfo.addrLine2" variant="outlined" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-combobox :items="cityNames" color="teal" label="City" density="compact"
                        v-model="UserlocationInfo.city" variant="outlined" :rules="cityRules"></v-combobox>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4"> <v-text-field color="teal" label="Pin Code" density="compact" type="number"
                        v-model="UserlocationInfo.zipcode" variant="outlined" :rules="pinCodeRules"
                        @input="GetPincodeInfo" :error-messages="pincodeError" /></v-col>
                <v-col cols="12" md="4">
                    <v-text-field color="teal" label="District" density="compact" v-model="UserlocationInfo.district"
                        variant="outlined" disabled />
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field :items="stateNames" color="teal" label="State" density="compact"
                        v-model="UserlocationInfo.state" variant="outlined" disabled />
                </v-col>
            </v-row>

            <v-row>
                <v-col class="d-flex justify-start mb-10 mr-10">
                    <v-btn color="teal-darken-4" @click="previousPage('B')">
                        <v-icon icon="mdi-rewind" start></v-icon>
                        Back</v-btn>
                </v-col>
                <v-col class="d-flex justify-end mb-10 mr-10">
                    <v-btn color="teal-darken-4" type="submit">Next
                        <v-icon icon="mdi-fast-forward" end></v-icon>

                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>
<script lang="ts">
import { VForm } from 'vuetify/components'
import EventServices from '@/Services/EventServices';
import { useLoaderStore } from "@/stores/loaderStore";
import { useSnackbarStore } from '@/stores/snackbarStore';
import postalcodes from 'postalcodes-india';

export default {
    props: {
        UserlocationInfo: {
            type: Object,
            required: true,
            default: () => ({})
        }
    },
    setup() {
        const snackbar = useSnackbarStore();
        const loader = useLoaderStore()
        return { snackbar, loader }
    },
    data() {
        return {
            originalLocationInfo: {} as any,
            isCloned: false,
            stateNames: [],
            cityNames: [],
            cityRules: [(v: string) => !!v || "City is Required !"],
            pinCodeRules: [
                (v: number | string) => {
                    const value = String(v).trim();
                    if (!value) return "PIN code is Required!";
                    return /^\d{6}$/.test(value) || "PIN code must be exactly 6 digits";
                }
            ],
            pincodeError: ""


        }
    },
    watch: {
        UserlocationInfo: {
            handler(newVal) {
                if (!this.isCloned && newVal && Object.keys(newVal).length > 0) {
                    this.originalLocationInfo = JSON.parse(JSON.stringify(newVal));
                    this.isCloned = true;
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        previousPage(val: string) {
            this.$emit('changePage', val);
        },
        isLocationChanged(): boolean {
            return JSON.stringify(this.originalLocationInfo) !== JSON.stringify(this.UserlocationInfo);
        },
        GetPincodeInfo() {
            const zip = String(this.UserlocationInfo.zipcode).trim();
            const isValidPIN = /^\d{6}$/.test(zip);

            // Reset error
            this.pincodeError = "";

            if (zip.length === 6 && isValidPIN) {
                const pincodeval = postalcodes.find(zip)
                console.log(pincodeval);

                if (pincodeval.isValid) {
                    this.UserlocationInfo.district = pincodeval.district
                    this.UserlocationInfo.state = pincodeval.state
                } else {
                    this.snackbar.show("E", "Invalid Pincode")
                    this.pincodeError = "Invalid Pincode";
                    this.UserlocationInfo.district = ""
                    this.UserlocationInfo.state = ""
                }
            }
        },
        async insertLocationInfo() {

            const form = this.$refs.inputValidation as InstanceType<typeof VForm>;
            const result = await form?.validate();
            // ❌ Stop if form is invalid or pincode has error
            if (!result?.valid || this.pincodeError) {
                return; // Do not proceed
            }

            if (result?.valid) {
                if (!this.isLocationChanged()) {
                    this.$emit('changePage', 'N');
                    return;
                }

                this.loader.show()
                EventServices.InsertLocationInfo(this.UserlocationInfo)
                    .then((response) => {
                        if (response.data.status == "S") {
                            this.loader.hide()
                            this.originalLocationInfo = JSON.parse(JSON.stringify(this.UserlocationInfo));
                            this.$emit('changePage', 'N');
                        }
                        else {
                            this.loader.hide()
                            this.snackbar.show(response.data.status, response.data.msg)
                        }
                    }).catch((error) => {
                        console.log(error);
                        this.loader.hide()
                    })
            }

        }
    },
    mounted() {
        this.loader.show()

        EventServices.GetStates()
            .then((response) => {
                console.log('cities', response);

                if (response.data.status == "S") {
                    this.loader.hide()
                    this.stateNames = response.data.stateNames
                    this.cityNames = response.data.cityNames

                }
                else {
                    this.snackbar.show(response.data.status, response.data.msg)
                }
            }).catch((error) => {
                console.log(error);
                this.loader.hide()
            })
    },
}
</script>