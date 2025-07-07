import axios from 'axios'

const baseApiClient = axios.create({
  baseURL: 'http://localhost:8081',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  GetPropertyTypes() {
    return baseApiClient.get('/getPropertyTypes')
  },
  InsertBasicInfo(data: object) {
    return baseApiClient.post('/insertBasicInfo', data)
  },
  InsertLocationInfo(data: object) {
    return baseApiClient.post('/insertLocationInfo', data)
  },
  GetUserDetails(data: object) {
    return baseApiClient.post('/getUserInfo', data)
  },
  GetStates() {
    return baseApiClient.get('/getStates')
  },
  GetRoomDropDown() {
    return baseApiClient.get('/getRoomDropdown')
  },
  InsertRoomsArr(data: object) {
    return baseApiClient.post('/inserRoomDetails', data)
  },
  InsertMealsInfo(data: object) {
    return baseApiClient.post('/insertMealsInfo', data)
  },
  InsertAvailabilityInfo(data: object) {
    return baseApiClient.post('/insertAvailability', data)
  },
  //Policies
  getPoliciesDropdown(){
    return baseApiClient.get('/getPoliciesDropdown')
  },
  InsertPoliciesData(data:object){
    return baseApiClient.post('/insertPropertyPolicies', data)
  },
  // Docs Info
  insertDocsInfo(data:object){
    const hdr = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return baseApiClient.post('/insertDocsInfo',data,hdr)
  },
  GetIFSCDetails(data:object){
    return baseApiClient.post('/getIFSCdetails', data)
  },
  // Property Pics Info
  InsertPropertyInfo(data:object){
    const hdr = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return baseApiClient.post('/insertPropertyInfo',data,hdr)
  },
  // Notes / Description
  InsertDescInfo(data:object){
    return baseApiClient.post('/insertDescInfo', data)
  },
  // Clear Session
  ClearSession(){
    return baseApiClient.get('/clearSession')
  }
}
