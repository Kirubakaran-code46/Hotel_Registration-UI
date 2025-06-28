<template>
    <div class="mx-5 mt-10">{{ UserlocationInfo }}
        <v-row>
            <v-col>
                <v-text-field color="teal" label="Address Line 1" density="compact" v-model="UserlocationInfo.addrLine1"
                    variant="outlined" />
            </v-col>
            <v-col>
                <v-text-field color="teal" label="Address Line 2" density="compact" v-model="UserlocationInfo.addrLine2"
                    variant="outlined" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="4"> <v-text-field color="teal" label="City" density="compact"
                    v-model="UserlocationInfo.city" variant="outlined" /></v-col>
            <v-col cols="12" md="4">
                <v-select :items="stateNames" color="teal" label="State" density="compact" v-model="UserlocationInfo.state"
                    variant="outlined"></v-select>
            </v-col>
            <v-col cols="12" md="4"> <v-text-field color="teal" label="Zip Code" density="compact" type="number"
                    v-model="UserlocationInfo.zipcode" variant="outlined" /></v-col>
        </v-row>
        <v-row>
            <v-col class="d-flex justify-start mb-10 mr-10">
                <v-btn color="teal" @click="previousPage('B')">Back</v-btn>
            </v-col>
            <v-col class="d-flex justify-end mb-10 mr-10">
                <v-btn color="teal" @click="insertLocationInfo">Next</v-btn>
            </v-col>
        </v-row>
    </div>
</template>
<script lang="ts">
import EventServices from '@/Services/EventServices';
import { useLoaderStore } from "@/stores/loaderStore";
import { useSnackbarStore } from '@/stores/snackbarStore';

export default {
    props: {
        UserlocationInfo: {
            type: Object,
            required: true,
            default : ()=>({})
        }
    },
    data() {
        return {
            originalLocationInfo: {} as any,
            isCloned: false,
            stateNames:[],
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
        insertLocationInfo() {
            const snackbar = useSnackbarStore();
            const loader = useLoaderStore()

            if (!this.isLocationChanged()) {
                this.$emit('changePage', 'N');
                return;
            }

            loader.show()
            EventServices.InsertLocationInfo(this.UserlocationInfo)
                .then((response) => {
                    if (response.data.status == "S") {
                        loader.hide()
                        this.originalLocationInfo = JSON.parse(JSON.stringify(this.UserlocationInfo));
                        this.$emit('changePage', 'N');
                    }
                    else {
                        loader.hide()
                        snackbar.show(response.data.status, response.data.msg)
                    }
                }).catch((error) => {
                    console.log(error);
                    loader.hide()
                })
        }
    },
    mounted() {
        const snackbar = useSnackbarStore();
            const loader = useLoaderStore()
            loader.show()

        EventServices.GetStates()
         .then((response) => {
                    if (response.data.status == "S") {
                        loader.hide()
                        this.stateNames = response.data.stateNames
                    }
                    else {
                        snackbar.show(response.data.status, response.data.msg)
                    }
                }).catch((error) => {
                    console.log(error);
                    loader.hide()
                })
    },
}
</script>