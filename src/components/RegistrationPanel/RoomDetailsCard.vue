<template>
    <div class="mx-5 mt-10">
        <div v-for="(room, index) in roomForms" :key="index">
            <v-alert class="mb-8" border="start" color="teal-darken-4" variant="tonal" height="4" width="300">
            <v-icon icon="mdi-bed" start></v-icon>
            <strong>Room Type  {{ index + 1 }}</strong>
        </v-alert>


            <v-row>
                <v-col cols="12" md="4">
                    <v-select v-model="room.roomType" :items="roomTypes" color="teal" label="Room Type"
                        density="compact" variant="outlined" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field v-model="room.noOfRooms" color="teal" label="Number of Rooms" type="number"
                        density="compact" variant="outlined" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-select :items="roomView" v-model="room.roomView" color="teal" label="Room View" density="compact"
                        variant="outlined" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4">
                    <v-select :items="roomSquareUnit" v-model="room.roomSizeUnit" color="teal" label="Room size Unit"
                        density="compact" variant="outlined" />
                </v-col>
                <v-col v-if="room.roomSizeUnit" cols="12" md="4">
                    <v-text-field color="teal" v-model="room.roomSize" :label="`Size in ${room.roomSizeUnit}`"
                        density="compact" type="number" variant="outlined" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field color="teal" v-model="room.maximumOccupancy" label="Maximum Occupancy"
                        density="compact" variant="outlined"></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field color="teal" v-model="room.extraBed" label="Extra Bed" type="number" density="compact"
                        variant="outlined" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field color="teal" v-model="room.extraPersons" label="Extra Persons" type="number"
                        density="compact" variant="outlined" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field color="teal" v-model="room.singleGuestPrice" label="Single Guest Price" type="number"
                        density="compact" variant="outlined" />
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field color="teal" v-model="room.doubleGuestPrice" label="Double Guest Price" type="number"
                        density="compact" variant="outlined" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field color="teal" v-model="room.tripleGuestPrice" label="Triple Guest Price" type="number"
                        density="compact" variant="outlined" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field color="teal" v-model="room.extraAdultCharge" label="Extra Adult Charge" type="number"
                        density="compact" variant="outlined" />
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field color="teal" v-model="room.childCharge" label="Child (7-17 Yrs) Charge" type="number"
                        density="compact" variant="outlined" />
                </v-col>
                <v-col cols="12" md="4">
                    <v-text-field color="teal" v-model="room.belowChildCharge" label="Below 6 Yrs Charge" type="number"
                        density="compact" variant="outlined" />
                </v-col>
                <v-col cols="12" md="4">
                    <!-- <v-select multiple :items="roomAmenities" v-model="room.RoomAmenities" color="teal"
                        label="Room Ameneities" density="compact" variant="outlined" /> -->

                    <v-select v-model="room.roomAmenities" :items="roomAmenities" density="compact" color="teal"
                        variant="outlined" label="Room Ameneities" chips multiple></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4">
                    <v-select :items="smokingPolicyArr" color="teal" v-model="room.smokingPolicy" label="Smoking policy"
                        density="compact" variant="outlined" />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="d-flex justify-start mr-10" v-if="roomForms.length > 1">
                        <v-btn size="small" variant="tonal" @click="removeRoomType(index)" class="text-none"
                        prepend-icon="mdi-close-box" color="warning">Remove
                        Room</v-btn>
                </v-col>

                <v-col class="d-flex justify-end mr-10" v-if="index === roomForms.length - 1">
                        <v-btn size="small" variant="tonal" class="text-none" prepend-icon="mdi-plus-box" color="teal"
                        @click="addRoomType">Add
                        Room</v-btn>
                </v-col>
            </v-row>
            <v-divider class="my-3"></v-divider>
        </div>
        <v-row>
            <v-col class="d-flex justify-start mb-10 mr-10">
                <v-btn color="teal-darken-4" @click="previousPage('B')">
                    <v-icon icon="mdi-rewind" start></v-icon>
                    Back</v-btn>
            </v-col>
            <v-col class="d-flex justify-end mb-10 mr-10">
                <v-btn color="teal-darken-4" @click="submitAllRooms">Next
            <v-icon icon="mdi-fast-forward" end></v-icon>

                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import EventServices from '@/Services/EventServices'
import { useLoaderStore } from '@/stores/loaderStore'
import { useSnackbarStore } from '@/stores/snackbarStore'

export default {
    props: {
        roomDetailsArr: {
            type: Array,
            required: true,
            default: () => [] // fallback if not passed
        }
    },
    watch: {
        roomDetailsArr: {
            handler(newVal) {
                if (!this.isCloned && newVal && newVal.length > 0) {
                    this.roomForms = JSON.parse(JSON.stringify(newVal));
                    this.originalRoomForms = JSON.parse(JSON.stringify(newVal));

                    // this.isCloned = true;
                }
                else {
                    this.roomForms = [this.createRoomType()]; // Insert mode
                    this.originalRoomForms = [this.createRoomType()]; // Insert mode
                }
            },
            immediate: true,
            deep: true
        }
    },
    data() {
        return {
            isCloned: false,
            roomSquareUnit: ['Square Feet', 'Square Meter'],
            roomView: [],
            roomAmenities: [],
            roomTypes: [],
            roomForms: [],
            smokingPolicyArr: ['Yes', 'No'],
            originalRoomForms: []
        }
    },
    methods: {
        previousPage(val) {
            this.$emit('changePage', val);
        },
        addRoomType() {
            this.roomForms.push(this.createRoomType());
        },
        removeRoomType(index) {
            if (this.roomForms.length > 1) {
                this.roomForms.splice(index, 1);
            }
        },
        createRoomType() {
            return {
                roomType: "",
                noOfRooms: "",
                roomView: "",
                roomSizeUnit: "",
                roomSize: "",
                maximumOccupancy: "",
                extraBed: "",
                extraPersons: "",
                singleGuestPrice: "",
                doubleGuestPrice: "",
                tripleGuestPrice: "",
                extraAdultCharge: "",
                childCharge: "",
                belowChildCharge: "",
                roomAmenities: [],
                smokingPolicy: "",
            }
        },
        isRoomFormChanged() {
            return JSON.stringify(this.roomForms) !== JSON.stringify(this.originalRoomForms);
        },
        submitAllRooms() {

            if (!this.isRoomFormChanged()) {
                this.$emit('changePage', 'N');
                return;
            }

            const snackbar = useSnackbarStore()
            const loader = useLoaderStore()
            const val = {
                roomsArr: this.roomForms
            }
            loader.show()

            EventServices.InsertRoomsArr(val)
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
        const snackbar = useSnackbarStore()
        const loader = useLoaderStore()

        loader.show()
        EventServices.GetRoomDropDown()
            .then((response) => {

                if (response.data.status == 'S') {
                    loader.hide()
                    this.roomAmenities = response.data.roomAmenities
                    this.roomTypes = response.data.roomTypes
                    this.roomView = response.data.roomView
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
