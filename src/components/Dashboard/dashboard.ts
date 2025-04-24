import { defineComponent, ref, onMounted } from "vue";
import EventServices from "@/Services/EventServices";
import { useSnackbarStore } from '@/stores/snackbarStore'
import { useLoaderStore } from "@/stores/loaderStore";
import { useRouter } from "vue-router";

interface CardValues {
    role: string,
    description: string,
    router: string
}

export default defineComponent({
    setup() {
        const router = useRouter();
        const snackbar = useSnackbarStore();
        const loader = useLoaderStore();
        const DashBoardArr = ref([]);
        onMounted(() => {
            loader.show()
            EventServices.getEmpDetails()
                .then((response) => {
                    console.log(response);
                    if (response.data.status == "S") {
                        DashBoardArr.value = response.data.dashDetails;
                        loader.hide()
                    }
                    else {
                        snackbar.show(response.data.status, response.data.errMsg);
                        loader.hide()
                    }

                })
                .catch((error) => {
                    console.log(error);
                    loader.hide()
                })
        })

        function CardAction(val: CardValues) {
            if (val.router == '') {
                snackbar.show('E', "Router Not Exist")
            }
            else {
                router.push(val.router)
            }
        }

        return {
            DashBoardArr,
            CardAction
        }
    }
})