import { defineStore } from 'pinia';

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    snackbar: false,
    msg: '',
    SnackBarColor: 'success',
  }),
  actions: {
    show(status: 'S' | 'E', message: string) {
      this.msg = message;
      this.SnackBarColor = status === 'S' ? 'green' : 'red';
      this.snackbar = true;
    },
    close() {
      this.snackbar = false;
    },
  },
});
