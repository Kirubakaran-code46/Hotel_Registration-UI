import {defineComponent, ref } from "vue"


export default defineComponent({
   setup(){
const version = ref("2.0")
    return{
        version
    }
   } 
})

