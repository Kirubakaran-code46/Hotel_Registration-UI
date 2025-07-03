// stores/globalStage.ts
import { defineStore } from 'pinia'

export const useGlobalStageStore = defineStore('globalStage', {
  state: () => ({
    userData: {
      hotelName: '',
      propertyType: '',
      starCategory: '',
      yearOfConstruction: '',
      mobileCode: '+ 91',
      primaryMobile: '',
      secondaryMobile: '',
      email: '',
      channelManager: '',
    },
  }),
  actions: {
    setUserData(payload: any) {
      this.userData = { ...payload }
    },
  },
})
