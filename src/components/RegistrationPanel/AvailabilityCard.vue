<template>
    <div class="mx-5 mt-10">
        <v-row>
            <!-- Start Date Picker -->
            <v-col cols="12" sm="6">
                <v-menu v-model="startMenu" :close-on-content-click="false" transition="scale-transition" offset-y
                    location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-text-field v-model="UserAvailabilityInfo.startDate" label="Start Date" color="teal"
                            density="compact" variant="outlined" readonly v-bind="props"
                            prepend-inner-icon="mdi-calendar" />
                    </template>

                    <v-date-picker hide-header v-model="internalStartDate" @update:modelValue="handleStartDate" color="teal" />
                </v-menu>
            </v-col>
            <!-- End Date Picker -->
            <v-col cols="12" sm="6">
                <v-menu v-model="endMenu" :close-on-content-click="false" transition="scale-transition" offset-y
                    location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-text-field v-model="UserAvailabilityInfo.endDate" label="End Date" color="teal"
                            density="compact" variant="outlined" readonly v-bind="props"
                            prepend-inner-icon="mdi-calendar" />
                    </template>

                    <v-date-picker hide-header v-model="internalEndDate" @update:modelValue="handleEndDate" color="teal" />
                </v-menu>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="d-flex justify-start mb-10 mr-10">
                <v-btn color="teal-darken-4" @click="previousPage('B')">
                    <v-icon icon="mdi-rewind" start></v-icon>
                    Back</v-btn>
            </v-col>
            <v-col class="d-flex justify-end mb-10 mr-10">
                <v-btn color="teal-darken-4" @click="insertAvailabilityInfo">Next
            <v-icon icon="mdi-fast-forward" end></v-icon>
                </v-btn>
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
        UserAvailabilityInfo: {
            type: Object,
            required: true,
        }
    },
    watch: {
        UserAvailabilityInfo: {
            handler(newVal) {
                if (!this.isCloned && newVal && Object.keys(newVal).length > 0) {
                    this.originalAvailabilityInfo = JSON.parse(JSON.stringify(newVal));
                    this.isCloned = true;
                }
            },
            immediate: true,
            deep: true
        },
    },
      setup() {
        const snackbar = useSnackbarStore();
        const loader = useLoaderStore()
        return { snackbar, loader }
    },
    data() {
        return {
            originalAvailabilityInfo: {},
            isCloned: false,
            // Menu controls
            startMenu: false,
            endMenu: false,

            // Raw values (internal picker binding)
            internalStartDate: null,
            internalEndDate: null,
        }
    },
    computed: {
        formattedStartDate() {
            return this.formatDate(this.UserAvailabilityInfo.startDate);
        },
        formattedEndDate() {
            return this.formatDate(this.UserAvailabilityInfo.endDate);
        },
    },
    methods: {
        handleStartDate(val: string | null) {
            this.startMenu = false;
            this.UserAvailabilityInfo.startDate = val ? this.formatDate(val) :'';
        },
        handleEndDate(val: string | null) {
            this.endMenu = false;
            this.UserAvailabilityInfo.endDate =val ? this.formatDate(val) : '';
        },
        formatDate(dateVal: string | number | Date): string {
            const date = new Date(dateVal);
            if (isNaN(date.getTime())) return '';
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        },
        isAvailabilityDateChanged() {
            return JSON.stringify(this.originalAvailabilityInfo) !== JSON.stringify(this.UserAvailabilityInfo);
        },
        previousPage(val: string) {
            this.$emit('changePage', val);
        },
        insertAvailabilityInfo() {

            const lStartDate = new Date(this.UserAvailabilityInfo.startDate)
            const lEndDate = new Date(this.UserAvailabilityInfo.endDate)

            if (lEndDate < lStartDate) {
                this.snackbar.show("E", "End Date cannot be earlier than Start Date");
                return;
            }

            if (!this.isAvailabilityDateChanged()) {
                this.$emit('changePage', 'N');
                return;
            }

            this.loader.show()
            EventServices.InsertAvailabilityInfo(this.UserAvailabilityInfo)
                .then((response) => {
                    if (response.data.status == "S") {
                        this.loader.hide()
                        this.originalAvailabilityInfo = JSON.parse(JSON.stringify(this.UserAvailabilityInfo));
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
    },

}
</script>