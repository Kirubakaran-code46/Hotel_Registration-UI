<template>
    <div class="mx-5 mt-10">
        <v-row>
            <v-col>
                <v-select label="Is Operational Restaurant" v-model="UserMealsInfo.isOperationalRestaurant"
                    :items="['Yes', 'No']" variant="outlined" color="teal" density="compact"></v-select>
            </v-col>
            <v-col>
                <v-select label="Meal Package" :disabled="UserMealsInfo.isOperationalRestaurant != 'Yes'"
                    v-model="UserMealsInfo.mealPackage" :items="mealsPackageItems" variant="outlined" color="teal"
                    density="compact"></v-select>
            </v-col>
            <v-col>
                <v-select label="Types Of Meals Offered" :disabled="UserMealsInfo.isOperationalRestaurant != 'Yes'" chips
                    multiple v-model="UserMealsInfo.typesOfMeals" :items="typesOfMeals" variant="outlined" color="teal"
                    density="compact"></v-select>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="4">
                <v-select label="Meal Rack Price" :disabled="UserMealsInfo.isOperationalRestaurant != 'Yes'"
                    v-model="UserMealsInfo.mealRackPrice" :items="mealRackPrice" variant="outlined" color="teal"
                    density="compact"></v-select>
            </v-col>
        </v-row>


        <v-row>
            <v-col class="d-flex justify-start mb-10 mr-10">
                <v-btn color="teal" @click="previousPage('B')">Back</v-btn>
            </v-col>
            <v-col class="d-flex justify-end mb-10 mr-10">
                <v-btn color="teal" @click="insertMealsInfo">Next</v-btn>
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
        UserMealsInfo: {
            type: Object,
            required: true,
            default: () => ({})
        }
    },
    watch: {
        UserMealsInfo: {
            handler(newVal) {
                if (!this.isCloned && newVal && Object.keys(newVal).length > 0) {
                    this.originalMealsInfo = JSON.parse(JSON.stringify(newVal));
                    this.isCloned = true;
                }
            },
            immediate: true,
            deep: true
        },
    },
    data() {
        return {
            originalMealsInfo: {} as any,
            isCloned: false,
            mealsPackageItems: ['Complementry', 'Charges Applied'],
            typesOfMeals: ['Lunch', 'Dinner', 'Custom Package', 'Breakfast'],
            mealRackPrice: ['Based on Property', 'Additional Charges']
        }
    },
    methods: {
        previousPage(val: string) {
            this.$emit('changePage', val);
        },

        isMealsDataChanged(): boolean {
            return JSON.stringify(this.originalMealsInfo) !== JSON.stringify(this.UserMealsInfo);
        },
        insertMealsInfo() {
            const snackbar = useSnackbarStore();
            const loader = useLoaderStore()

            if (!this.isMealsDataChanged()) {
                this.$emit('changePage', 'N');
                return;
            }
            loader.show()
            EventServices.InsertMealsInfo(this.UserMealsInfo)
                .then((response) => {
                    if (response.data.status == "S") {
                        loader.hide()
                        this.originalMealsInfo = JSON.parse(JSON.stringify(this.UserMealsInfo));
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
    }
}
</script>