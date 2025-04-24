import { defineStore } from "pinia"

export const useLoaderStore = defineStore('loader', {
    state: () => ({
        loading: false,
        text: "Please Wait..."
    }),
    actions: {
        show() {
            this.loading = true;
        },
        hide() {
            this.loading = false;
        }
    }
})