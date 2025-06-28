<template>
  <v-card class="mx-10 my-10" elevation="12">
    <v-card-title>{{ validateBasicInfo }}
      <v-row>
        <v-col>
          <v-img src="/PYOLLIV PNG.png" width="160" height="70" />
        </v-col>
        <v-col>
          <h3 class="mt-4">Hotel Registration</h3>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-progress-linear :model-value="(tab / (registrationSteps.length - 1)) * 100" color="teal" height="6" rounded
        class="mb-4" />

      <v-tabs :model-value="tab" grow show-arrows color="teal" class="text--capitalize"
        @update:modelValue="validateBeforeTabChange">
        <v-tab v-for="(step, index) in registrationSteps" :key="index" :value="index" class="text-none">
          <v-icon class="mr-1" color="teal" left>{{ step.icon }}</v-icon>
          {{ step.label }}
        </v-tab>
      </v-tabs>

      <!-- 🔵 Tab Content -->
      <v-window v-model="tab" class="mt-4" transition="fade-transition">
        <v-window-item v-for="(step, index) in registrationSteps" :key="index" :value="index">
          <BasicCard v-if="index == 0" :validateBasicInfo="validateBasicInfo" :UserbasicInfo="basicInfo"
            @validated="nextStage" @changePage="changePage"></BasicCard>

          <LocationCard v-if="index == 1" @changePage="changePage" :UserlocationInfo="locationInfo"></LocationCard>
          <RoomDetailsCard v-if="index == 2" @changePage="changePage" :roomDetailsArr="roomDetailsArr || []">
          </RoomDetailsCard>
          <MealsCard v-if="index == 3" @changePage="changePage" :UserMealsInfo="mealsInfo"></MealsCard>
          <AvailabilityCard v-if="index == 4" @changePage="changePage" :UserAvailabilityInfo="availabilityInfo">
          </AvailabilityCard>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import LocationCard from './LocationCard.vue';
import BasicCard from './BasicCard.vue';
import RoomDetailsCard from './RoomDetailsCard.vue';
import AvailabilityCard from './AvailabilityCard.vue';
import MealsCard from './MealsCard.vue';
import Cookies from 'js-cookie';
import EventServices from '@/Services/EventServices';
import { useLoaderStore } from "@/stores/loaderStore";
import { useSnackbarStore } from '@/stores/snackbarStore';

export default {
  components: {
    LocationCard,
    BasicCard,
    RoomDetailsCard,
    MealsCard,
    AvailabilityCard
  },
  computed: {
  },
  data() {
    return {
      registrationSteps: [
        { label: 'Basic Info', icon: 'mdi-account-circle' },
        { label: 'Location', icon: 'mdi-map-marker' },
        { label: 'Room Details', icon: 'mdi-bed' },
        { label: 'Restaurant & Meals', icon: 'mdi-food' },
        { label: 'Availability', icon: 'mdi-calendar-check' },
        { label: 'Policies', icon: 'mdi-file-document' },
        { label: 'Docs', icon: 'mdi-folder' },
        { label: 'Property Details', icon: 'mdi-home-city' },
        { label: 'Notes', icon: 'mdi-note-text' },
      ],
      basicInfo: {
        hotelName: "",
        propertyType: "",
        starCategory: "",
        yearOfConstruction: "",
        mobileCode: "91",
        primaryMobile: "",
        secondaryMobile: "",
        email: "",
        channelManager: "",
      },
      locationInfo: {},
      mealsInfo: {},
      roomDetailsArr: [],
      availabilityInfo: {},
      tab: 0,
      MovecurrentTab: false,
      validateBasicInfo: false,
      validated: false,
    }
  },
  methods: {
    nextStage(val: boolean) {
      if (val) {
        this.MovecurrentTab = true
      }
      else {
        this.MovecurrentTab = false
      }
      // this.tab++;
      console.log('MovecurrentTab', this.MovecurrentTab);

      // this.validateBeforeTabChange(this.tab)
    },
    changePage(direction: string) {
      if (direction === 'B') {
        this.tab--;
        this.GetUserDetails(this.tab)

      } else if (direction === 'N') {
        this.tab++;
        this.validateBeforeTabChange(this.tab)

      }
    },
    validateBeforeTabChange(v: unknown) {

      const newTab = v as number
      console.log('11111111', newTab, "current", this.tab);

      if (this.tab == 0) {
        console.log('tab===0');
        this.validateBasicInfo = true
      }

      // this.currentTab = newTab
      // console.log('validated',this.validated);

      // if (!this.validated) {
      // if (this.tab == 0) {
      //   if (!this.validated) {
      //     console.log('2222222222', this.tab);

      //     this.validateBasicInfo = true
      //   }
      // }
      // snackbar.show('E', "Please Save Basic Info")
      // } else {
      setTimeout(() => {
        if (this.MovecurrentTab) {
          console.log('settimeout called');
          
          this.tab = newTab
          this.GetUserDetails(newTab)
        }
      }, 10);
      // }

    },
    GetUserDetails(tabIndex: number) {
      var clientId = Cookies.get('client_id')
      if (!clientId) {
        console.log('Cookie not found');
        return;
      }
      console.log('Cookie exists:', clientId);
      var lReq = {
        clientId: clientId,
        stage: this.registrationSteps[tabIndex].label
      }

      const snackbar = useSnackbarStore();
      const loader = useLoaderStore()

      loader.show()

      EventServices.GetUserDetails(lReq)
        .then((response) => {
          console.log("++++", response);
          if (response.data.status == "S") {

            loader.hide()
            this.basicInfo = response.data.basicInfo
            this.locationInfo = response.data.locationInfo
            this.mealsInfo = response.data.mealsInfo
            this.roomDetailsArr = response.data.roomTypesInfo
            this.availabilityInfo = response.data.availabilityInfo
            this.tab = tabIndex

          }
          else {
            snackbar.show(response.data.status, response.data.msg)
          }
        }).catch((error) => {
          console.log(error);
          loader.hide()
        })
    }
  },
  mounted() {
    this.GetUserDetails(0)
    this.validateBasicInfo = false
    console.log('mounted');

  }
}
</script>