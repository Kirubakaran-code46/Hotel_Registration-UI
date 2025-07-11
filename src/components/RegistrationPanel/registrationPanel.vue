<template>
  <v-card class="mx-10 my-10" elevation="12">
    <v-card-title>
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
        @update:modelValue="validateBeforeTabChange" bg-color="teal-lighten-5">
        <v-tab v-for="(step, index) in registrationSteps" :key="index" :value="index" class="text-none">
          <v-icon class="mr-1" color="teal" left>{{ step.icon }}</v-icon>
          {{ step.label }}
        </v-tab>
      </v-tabs>

      <!-- 🔵 Tab Content -->
      <v-window v-model="tab" class="mt-4" transition="fade-transition">
        <v-window-item v-for="(step, index) in registrationSteps" :key="index" :value="index">

          <!-- BASIC CARD -->
          <BasicCard v-if="index == 0" :validateBasicInfo="validateBasicInfo" :UserbasicInfo="basicInfo"
            @validated="nextStage" @changePage="changePage"></BasicCard>

          <!-- LOCATION CARD -->
          <LocationCard v-if="index == 1" @changePage="changePage" :UserlocationInfo="locationInfo || {}">
          </LocationCard>

          <!-- ROOM DETAILS CARD -->
          <RoomDetailsCard v-if="index == 2" @changePage="changePage" :roomDetailsArr="roomDetailsArr || []">
          </RoomDetailsCard>

          <!-- MEALS CARD -->
          <MealsCard v-if="index == 3" @changePage="changePage" :UserMealsInfo="mealsInfo || {}"></MealsCard>

          <!-- AVAILABILITY CARD -->
          <AvailabilityCard v-if="index == 4" @changePage="changePage" :UserAvailabilityInfo="availabilityInfo || {}">
          </AvailabilityCard>

          <!-- POLICIES CARD -->
          <PoliciesCard v-if="index == 5" @changePage="changePage" :UserPoliciesInfo="policiesInfo"></PoliciesCard>

          <!-- DOCS INFO CARD -->
          <DocsCard v-if="index == 6" @changePage="changePage" :UserDocsInfo="docsInfo || {}"></DocsCard>

          <!-- PROPERTY DETAILS CARD -->
          <PropertyDetailsCard v-if="index == 7" @changePage="changePage" :UserPropertyInfo="propertyInfo || {}">
          </PropertyDetailsCard>

          <!-- NOTES AND LAST CARD -->
          <NotesCard v-if="index == 8" @changePage="changePage" :UserDescriptionInfo="descriptionInfo"></NotesCard>
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
import PoliciesCard from "./PoliciesCard.vue";
import DocsCard from "./DocsInfo.vue";
import PropertyDetailsCard from './PropertyDetailsCard.vue';
import NotesCard from './NotesCard.vue';
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
    AvailabilityCard,
    PoliciesCard,
    DocsCard,
    PropertyDetailsCard,
    NotesCard
  },
  setup() {
    const snackbar = useSnackbarStore();
    const loader = useLoaderStore()
    return { snackbar, loader }
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
        { label: 'Property Images', icon: 'mdi-home-city' },
        { label: 'Notes', icon: 'mdi-note-text' },
      ],
      basicInfo: {
        hotelName: "",
        propertyType: "",
        starCategory: "",
        yearOfConstruction: "",
        mobileCode: "+ 91",
        primaryMobile: "",
        secondaryMobile: "",
        email: "",
        channelManager: "",
      },
      locationInfo: {},
      mealsInfo: {},
      roomDetailsArr: [],
      availabilityInfo: {},
      policiesInfo: {},
      docsInfo: {},
      propertyInfo: {},
      descriptionInfo: "",
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

      if (this.tab == 0) {
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

          this.tab = newTab
          this.GetUserDetails(newTab)
        }
      }, 10);
      // }

    },
    GetUserDetails(tabIndex: number) {
      var clientId = Cookies.get('client_id')
      if (!clientId) {
        return;
      }
      var lReq = {
        clientId: clientId,
        stage: this.registrationSteps[tabIndex].label
      }
      this.loader.show()

      EventServices.GetUserDetails(lReq)
        .then((response) => {
          console.log('###', response);

          if (response.data.status == "S") {

            this.loader.hide()
            this.basicInfo = response.data.basicInfo
            this.locationInfo = response.data.locationInfo
            this.mealsInfo = response.data.mealsInfo
            this.roomDetailsArr = response.data.roomTypesInfo
            this.availabilityInfo = response.data.availabilityInfo
            this.policiesInfo = response.data.policiesInfo
            this.docsInfo = response.data.docsInfo
            this.propertyInfo = response.data.propertyPicInfo
            this.descriptionInfo = response.data.description
            this.tab = tabIndex

          }
          else {
            this.snackbar.show(response.data.status, response.data.msg)
            this.loader.hide()
          }
        }).catch((error) => {
          console.log(error);
          this.loader.hide()
        })
    }
  },
  mounted() {
    this.GetUserDetails(0)
    this.validateBasicInfo = false
  }
}
</script>