<template>
    <div class="mx-5 mt-10">
        <v-form ref="inputValidation" @submit.prevent="insertDetails" lazy-validation>
            <v-row>
                <v-col>
                    <v-text-field color="teal" label="Hotel Name" density="compact" v-model="UserbasicInfo.hotelName"
                        variant="outlined" />
                </v-col>
                <v-col> <v-select :items="propertyTypes" color="teal" label="Property Type" density="compact"
                        v-model="UserbasicInfo.propertyType" variant="outlined"></v-select></v-col>
                <v-col>
                    <v-text-field v-model="UserbasicInfo.yearOfConstruction" label="Year Of Construction"
                        variant="outlined" density="compact" color="teal" maxlength="4" inputmode="numeric"
                        :rules="yearRules" @input="onYearInput" />
                </v-col>

            </v-row>
            <v-row>
                <v-col cols="12" md="2">
                    <v-select color="teal" :items="countryCodes" label="Code" density="compact"
                        v-model="UserbasicInfo.mobileCode" variant="outlined"></v-select>
                </v-col>
                <v-col cols="12" md="2">
                    <v-text-field color="teal" :rules="phoneRules" type="number" label="Primary Phone Number"
                        density="compact" v-model="UserbasicInfo.primaryMobile" max="10" variant="outlined" />
                </v-col>
                <v-col cols="12" md="4"> <v-text-field color="teal" label="Secondary Phone Number" density="compact"
                        v-model="UserbasicInfo.secondaryMobile" variant="outlined" /></v-col>
                <v-col cols="12" md="4"> <v-text-field color="teal" :rules="emailRules" label="Email" density="compact"
                        v-model="UserbasicInfo.email" variant="outlined" /></v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4"> <v-select :items="['1', '2', '3', '4', '5']" color="teal" label="Star Category"
                        density="compact" v-model="UserbasicInfo.starCategory" variant="outlined"></v-select></v-col>
                <v-col cols="12" md="4"> <v-select :items="['Yes', 'No']" color="teal" label="Channel 
                    Manager" density="compact" v-model="UserbasicInfo.channelManager"
                        variant="outlined"></v-select></v-col>

                <!-- <v-btn @click="testmeth">check</v-btn> -->
            </v-row>
            <v-row>
                <v-col class="d-flex justify-end mb-10 mr-10">
                    <v-btn color="teal" type="submit">Next</v-btn>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>
<script lang="ts">
import { VForm } from 'vuetify/components'
import EventServices from '@/Services/EventServices'
import { useLoaderStore } from "@/stores/loaderStore";
import { useSnackbarStore } from '@/stores/snackbarStore';

export default {
    props: {
        validateBasicInfo: Boolean,
        UserbasicInfo: {
            type: Object,
            required: true,
        },
    },
    watch: {
        validateBasicInfo: {
            handler(newVal) {
                if (newVal) {
                    this.checkBasicValidation()
                }
            },
            // immediate: true,
            deep: true
        },
        UserbasicInfo: {
            handler(newVal) {
                if (!this.isCloned && newVal && Object.keys(newVal).length > 0) {
                    this.originalBasicInfo = JSON.parse(JSON.stringify(newVal));
                    this.isCloned = true;
                }
            },
            immediate: true,
            deep: true
        }
    },
    data() {
        return {
            originalBasicInfo: {} as any,
            isCloned: false,
            // basicInfo: {
            //     hotelName: "",
            //     propertyType: "",
            //     starCategory: "",
            //     yearOfConstruction: "",
            //     mobileCode: "91",
            //     primaryMobile: "",
            //     secondaryMobile: "",
            //     email: "",
            //     channelManager: "",
            // },
            propertyTypes: [],
            countryCodes: [],
            requiredRule: [(v: string) => !!v || "Filed is Required !"],
            phoneRules: [
                (v: string) => !!v || 'Mobile Number is required', // Check if the email is not empty
                (v: string) => /^\d{10}$/.test(v) || 'Must contain exactly 10 digits'
            ],
            emailRules: [
                (v: string) => !!v || 'Email is required', // Check if the email is not empty
                (v: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) || 'Invalid email address', // Email validation regex
            ],
            currentYear: new Date().getFullYear(),


        }
    },
    computed: {
        yearRules() {
            return [
                (v: string | number) => !!v || 'Year is required',
                (v: string | number) => /^\d{4}$/.test(String(v)) || 'Enter a valid 4-digit year',
                (v: string | number) => parseInt(String(v)) <= this.currentYear || `Year can't be in the future`
            ]
        }
    },
    methods: {
        onYearInput(event: Event) {
            const target = event.target as HTMLInputElement
            const onlyDigits = target.value.replace(/\D/g, '').slice(0, 4)
            this.UserbasicInfo.yearOfConstruction = onlyDigits
        },

        isBasicChanged(): boolean {
            return JSON.stringify(this.originalBasicInfo) !== JSON.stringify(this.UserbasicInfo);
        },

        async checkBasicValidation() {
            const form = this.$refs.inputValidation as InstanceType<typeof VForm>;
            const result = await form?.validate();

            if (result?.valid) {
                this.$emit('validated', true)
            }
        },
        async insertDetails() {
            const snackbar = useSnackbarStore();
            const loader = useLoaderStore()
            const form = this.$refs.inputValidation as InstanceType<typeof VForm>;
            const result = await form?.validate();

            if (result?.valid) {
                if (!(JSON.stringify(this.originalBasicInfo) !== JSON.stringify(this.UserbasicInfo))) {
                    this.$emit('changePage', 'N');
                    return;
                }

                loader.show()
                // INSERT OR UPDATE BASIC INFO
                EventServices.InsertBasicInfo(this.UserbasicInfo)
                    .then((response) => {
                        if (response.data.status == "S") {
                            loader.hide()
                            this.originalBasicInfo = JSON.parse(JSON.stringify(this.UserbasicInfo));
                            // this.$emit('validated')
                            this.$emit('validated', true)
                            
                            this.$emit('changePage', 'N');

                        }
                        else {
                            snackbar.show(response.data.status, response.data.msg)
                            loader.hide()
                        }
                    }).catch((error) => {
                        console.log(error);
                        loader.hide()
                    })

            } else {
                console.log("Form has errors:", result?.errors);
            }
        },
    },
    mounted() {
        const snackbar = useSnackbarStore();
        const loader = useLoaderStore()

        loader.show()
        EventServices.GetPropertyTypes()
            .then((response) => {
                if (response.data.status == "S") {
                    this.propertyTypes = response.data.propertyTypes
                    this.countryCodes = response.data.countryCode
                    loader.hide()
                }
                else {
                    snackbar.show(response.data.status, response.data.msg)
                }
            }).catch((error) => {
                console.log(error);
                loader.hide()
            })
    }
}
</script>