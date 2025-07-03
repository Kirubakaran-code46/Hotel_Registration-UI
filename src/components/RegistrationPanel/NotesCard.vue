<template>
    <div class="mx-5 mt-5">
        <v-row>
            <v-col>
                <v-textarea clearable label="Description" prepend-inner-icon="mdi-comment" row-height="25" rows="3"
                    variant="outlined" auto-grow placeholder="Say Something..." base-color="teal-darken-4"
                    icon-color="teal-darken-4" v-model="modifiedDesc"></v-textarea>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="d-flex justify-start mb-10 mr-10">
                <v-btn color="teal-darken-4" @click="previousPage('B')">
                    <v-icon icon="mdi-rewind" start></v-icon>
                    Back</v-btn>
            </v-col>
            <v-col class="d-flex justify-end mb-10 mr-10">
                <v-btn color="teal-darken-4" @click="InsertDescDetails">
                    <v-icon icon="mdi-check-circle" start></v-icon>
                    Save & Submit
                </v-btn>
            </v-col>
        </v-row>
        <v-dialog v-model="CompletedCard" max-width="400" persistent>
            <v-card class="text-center pa-5">
                <!-- <v-card-title class="text-h6 mt-2"></v-card-title> -->
                <v-row>
                    <v-col class="d-flex justify-center">
                        <v-img src="/success.png" width="150" height="100" />
                    </v-col>
                </v-row>
                <h3 class="my-10">Hotel Registered successfully...</h3>
                <!-- <v-card-text>Hotel Registered successfully.</v-card-text>  -->
                <v-card-actions class="justify-center">
                    <v-btn block prepend-icon="mdi-check-circle" color="green" variant="flat" @click="ClearSession">Click To Proceed</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>
<script lang="ts">
import EventServices from '@/Services/EventServices';
import { useLoaderStore } from "@/stores/loaderStore";
import { useSnackbarStore } from '@/stores/snackbarStore';

export default {

    props: {
        UserDescriptionInfo: {
            type: String,
            required: true,
        }
    },
    watch: {
        UserDescriptionInfo: {
            handler(newVal) {
                this.originalDesc = newVal
                this.modifiedDesc = newVal
            },
            immediate: true,
            deep: true
        },
    },
    data() {
        return {
            originalDesc: "",
            modifiedDesc: "",
            CompletedCard: false
        }
    },
    methods: {
        previousPage(val: string) {
            this.$emit('changePage', val);
        },
        InsertDescDetails() {

            const snackbar = useSnackbarStore();
            const loader = useLoaderStore()
            if (this.modifiedDesc == this.originalDesc) {
                this.CompletedCard = true
            }
            else {
                var lData = {
                    description: this.modifiedDesc
                }
                loader.show()
                EventServices.InsertDescInfo(lData)
                    .then((response) => {
                        if (response.data.status == "S") {
                            loader.hide()
                            this.CompletedCard = true
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

        ClearSession() {
            const snackbar = useSnackbarStore();
            const loader = useLoaderStore()

            loader.show()
            EventServices.ClearSession()
                .then((response) => {
                    if (response.data.status == "S") {
                        loader.hide()
                        this.CompletedCard = false
                        window.location.reload()
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
    }
}
</script>