<template>
    <div class="mx-5">
        <v-chip class="my-5" color="teal" label>Check-in / Check-out Policy</v-chip>
        <v-row>

            <!-- <v-text-field v-model="formattedCheckInTime" density="compact" variant="outlined"
                    :active="activateTimer1" :focus="activateTimer1" label="Picker in menu"
                    prepend-inner-icon="mdi-clock-time-four-outline" readonly>
                    <v-menu v-model="activateTimer1" :close-on-content-click="false" activator="parent"
                        transition="scale-transition">
                        <div>
                            <v-time-picker v-model="rawCheckInTime" ampm-in-title full-width
                                color="teal"></v-time-picker>

                            <div class="d-flex justify-end">
                                <v-btn color="primary" @click="activateTimer1 = false">
                                    OK
                                </v-btn>
                            </div>
                        </div>
                    </v-menu>
                </v-text-field> -->


            <!-- ********************************************************* -->
            <!-- CHECK-IN TIME PICKER -->
            <v-col cols="12" md="4">
                <v-text-field clearable v-model="formattedCheckInTime" density="compact" variant="outlined"
                    label="Check-In Time" prepend-inner-icon="mdi-clock-time-four-outline" readonly
                    @click="dialogCheckIn = true" />

                <v-dialog v-model="dialogCheckIn" max-width="390" persistent>
                    <v-card>
                        <v-card-text>
                            <v-time-picker v-model="tempCheckInTime" ampm-in-title full-width color="teal" />
                        </v-card-text>

                        <v-card-actions class="justify-end">
                            <v-btn variant="text" color="error" @click="dialogCheckIn = false">Cancel</v-btn>
                            <v-btn variant="flat" color="teal" @click="confirmCheckInTime">OK</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>

            <!-- CHECK-OUT TIME PICKER -->
            <v-col cols="12" md="4">
                <v-text-field clearable v-model="formattedCheckOutTime" density="compact" variant="outlined"
                    label="Check-Out Time" prepend-inner-icon="mdi-clock-time-four-outline" readonly
                    @click="dialogCheckOut = true" />

                <v-dialog v-model="dialogCheckOut" max-width="390" persistent>
                    <v-card>
                        <v-card-text>
                            <v-time-picker v-model="tempCheckOutTime" ampm-in-title full-width color="teal" />
                        </v-card-text>

                        <v-card-actions class="justify-end">
                            <v-btn variant="text" color="error" @click="dialogCheckOut = false">Cancel</v-btn>
                            <v-btn variant="flat" color="teal" @click="confirmCheckOutTime">OK</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
            <!-- ********************************************************* -->
            <!-- <v-col>

                old checkout dialog code

                <v-text-field v-model="formattedCheckOutTime" density="compact" variant="outlined"
                    :active="activateTimer2" :focus="activateTimer2" label="Picker in menu"
                    prepend-inner-icon="mdi-clock-time-four-outline" readonly>
                    <v-menu v-model="activateTimer2" :close-on-content-click="false" activator="parent"
                        transition="scale-transition">
                        <v-time-picker color="teal" ampm-in-title v-if="activateTimer2" v-model="rawCheckOutTime"
                            full-width></v-time-picker>
                    </v-menu>
                </v-text-field>
            </v-col> -->
            <v-col cols="12" md="4">
                <v-select :items="YesOrNoArr" color="teal" label="24 Hrs Check-In / Check-Out" density="compact"
                    variant="outlined" v-model="UserPoliciesInfo.checkinout_policy" />
            </v-col>
        </v-row>

        <v-chip class="my-5" color="teal" label>Cancellation Policy</v-chip>
        <v-row>
            <v-col cols="12" md="4">
                <v-select :items="CancellationPoliciesArr" color="teal" label="Cancellation Policy" density="compact"
                    variant="outlined" v-model="UserPoliciesInfo.cancellationPolicy" />
            </v-col>
        </v-row>

        <v-chip class="my-5" color="teal" label>Property Rules</v-chip>
        <v-row>
            <v-col cols="12" md="4">
                <v-select :items="YesOrNoArr" color="teal" label="Do you allow unmarried coupled ?" density="compact"
                    variant="outlined" v-model="UserPoliciesInfo.allow_unmarriedCouples" />
            </v-col>
            <v-col cols="12" md="4">
                <v-select :items="YesOrNoArr" color="teal" label="Do you allow guests below 18 years of age ?"
                    density="compact" variant="outlined" v-model="UserPoliciesInfo.allow_minor_guest" />
            </v-col>
            <v-col cols="12" md="4">
                <v-select :items="YesOrNoArr" color="teal" label="Are groups with only male guests allowed ?"
                    density="compact" variant="outlined" v-model="UserPoliciesInfo.allow_onlymale_guests" />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="4">
                <v-select :items="YesOrNoArr" color="teal" label="Is smoking allowed anywhere within the permises ?"
                    density="compact" variant="outlined" v-model="UserPoliciesInfo.allow_smoking" />
            </v-col>
            <v-col cols="12" md="4">
                <v-select :items="YesOrNoArr" color="teal" label="Are privare parties or events allowed ?"
                    density="compact" variant="outlined" v-model="UserPoliciesInfo.allow_parties" />
            </v-col>
            <v-col cols="12" md="4">
                <v-select :items="YesOrNoArr" color="teal" label="Can guests invite visitors to their rooms ?"
                    density="compact" variant="outlined" v-model="UserPoliciesInfo.allow_invite_guests" />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="4">
                <v-select :items="YesOrNoArr" color="teal" label="Is the property wheelchair accessible ?"
                    density="compact" variant="outlined" v-model="UserPoliciesInfo.wheelchar_accessible" />
            </v-col>
            <v-col cols="12" md="4">
                <v-select :items="YesOrNoArr" color="teal" label="Are pets allowed ?" density="compact"
                    variant="outlined" v-model="UserPoliciesInfo.allow_pets" />
            </v-col>
            <v-col cols="12" md="4">
                <v-select :items="identityProofArr" multiple chips color="teal" label="Acceptable identity proofs"
                    density="compact" variant="outlined" v-model="UserPoliciesInfo.accepted_proofs" />
            </v-col>
        </v-row>

        <v-chip class="my-5" color="teal" label>Custom Property Rules</v-chip>
        <v-row>
            <v-col cols="12" md="4">
                <v-text-field :items="YesOrNoArr" color="teal" label="Additional Property Rules" density="compact"
                    variant="outlined" v-model="UserPoliciesInfo.additional_propertyrules" />
            </v-col>
        </v-row>


        <v-row>
            <v-col class="d-flex justify-start mb-10 mr-10">
                <v-btn color="teal-darken-4" @click="previousPage('B')">
                    <v-icon icon="mdi-rewind" start></v-icon>
                    Back</v-btn>
            </v-col>
            <v-col class="d-flex justify-end mb-10 mr-10">
                <v-btn color="teal-darken-4" @click="insertPoliciesInfo">Next
                    <v-icon icon="mdi-fast-forward" end></v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>
<script lang="ts">
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import EventServices from '@/Services/EventServices';
import { useLoaderStore } from "@/stores/loaderStore";
import { useSnackbarStore } from '@/stores/snackbarStore';

export default {
    components: {
        VTimePicker,
    },
    props: {
        UserPoliciesInfo: {
            type: Object,
            required: true,
            default: () => ({})
        }
    },
    watch: {
        UserPoliciesInfo: {
            handler(newVal) {
                this.rawCheckInTime = this.convertTo24Hour(newVal.check_in || '');
                this.rawCheckOutTime = this.convertTo24Hour(newVal.check_out || '');

                if (!this.isCloned) {

                    this.originalPoliciesInfo = { ...newVal }
                    this.PoliciesInfo = { ...newVal }
                    this.isCloned = true;
                }
                // if (!this.isCloned && newVal && Object.keys(newVal).length > 0) {
                //     // this.originalPoliciesInfo = JSON.parse(JSON.stringify(newVal));
                //     this.originalPoliciesInfo = {...newVal}
                //     this.isCloned = true;
                // }
            },
            immediate: true,
            deep: true
        },
    },
    computed: {
        formattedCheckInTime: {
            get() {
                return this.formatTo12Hour(this.rawCheckInTime)
            },
            set(val: string) {
                this.rawCheckInTime = this.convertTo24Hour(val)
                this.UserPoliciesInfo.check_in = val
            }
        },
        formattedCheckOutTime: {
            get() {
                return this.formatTo12Hour(this.rawCheckOutTime)
            },
            set(val: string) {
                this.rawCheckOutTime = this.convertTo24Hour(val)
                this.UserPoliciesInfo.check_out = val
            }
        },
    },

    data() {
        return {
            originalPoliciesInfo: {} as any,
            PoliciesInfo: {} as any,
            isCloned: false,
            // Dialog controls
            dialogCheckIn: false,
            dialogCheckOut: false,
            // Temporary pickers
            tempCheckInTime: '',
            tempCheckOutTime: '',
            // Raw stored times
            rawCheckInTime: '',
            rawCheckOutTime: '',
            YesOrNoArr: ['Yes', 'No'],
            activateTimer1: false,
            activateTimer2: false,
            identityProofArr: [],
            CancellationPoliciesArr: []
        }
    },
    methods: {
        previousPage(val: string) {
            this.$emit('changePage', val);
        },
        isPoliciesChanged(): boolean {
            return JSON.stringify(this.originalPoliciesInfo) !== JSON.stringify(this.UserPoliciesInfo);
        },
        formatTime(time: string) {
            if (!time) return ''
            const [hourStr, minute] = time.split(':')
            let hour = parseInt(hourStr)
            const ampm = hour >= 12 ? 'PM' : 'AM'
            hour = hour % 12 || 12
            return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`
        },
        convertTo24Hour(time: string) {
            if (!time) return ''
            let [timePart, ampm] = time.split(' ')
            let [hour, minute] = timePart.split(':').map(Number)

            if (ampm === 'PM' && hour !== 12) hour += 12
            if (ampm === 'AM' && hour === 12) hour = 0

            return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        },
        formatTo12Hour(time: string) {
            if (!time) return ''
            const [hourStr, minute] = time.split(':')
            let hour = parseInt(hourStr)
            const ampm = hour >= 12 ? 'PM' : 'AM'
            hour = hour % 12 || 12
            return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`
        },
        confirmCheckInTime() {
            this.rawCheckInTime = this.tempCheckInTime
            this.dialogCheckIn = false
            this.UserPoliciesInfo.check_in = this.formatTo12Hour(this.tempCheckInTime)
        },
        confirmCheckOutTime() {
            this.rawCheckOutTime = this.tempCheckOutTime
            this.dialogCheckOut = false
            this.UserPoliciesInfo.check_out = this.formatTo12Hour(this.tempCheckOutTime)
        },
        insertPoliciesInfo() {
            if (!this.isPoliciesChanged()) {
                this.$emit('changePage', 'N');
                return;
            }
            const snackbar = useSnackbarStore()
            const loader = useLoaderStore()

            loader.show()

            EventServices.InsertPoliciesData(this.UserPoliciesInfo)
                .then((response) => {

                    if (response.data.status == 'S') {
                        this.$emit('changePage', 'N');
                        loader.hide()
                    } else {
                        loader.hide()
                        snackbar.show(response.data.status, response.data.msg)
                    }
                })
                .catch((error) => {
                    console.log(error)
                    loader.hide()
                })

        }
    },
    mounted() {
        if (this.UserPoliciesInfo.check_in) {
            this.rawCheckInTime = this.convertTo24Hour(this.UserPoliciesInfo.check_in)
        }
        if (this.UserPoliciesInfo.check_out) {
            this.rawCheckOutTime = this.convertTo24Hour(this.UserPoliciesInfo.check_out)
        }

        const snackbar = useSnackbarStore()
        const loader = useLoaderStore()

        loader.show()
        EventServices.getPoliciesDropdown()
            .then((response) => {
                if (response.data.status == 'S') {
                    loader.hide()
                    this.identityProofArr = response.data.identityProofs
                    this.CancellationPoliciesArr = response.data.cancellationPolicies
                } else {
                    snackbar.show(response.data.status, response.data.msg)
                    loader.hide()
                }
            })
            .catch((error) => {
                console.log(error)
                loader.hide()
            })
    },
}
</script>