import {defineStore} from "pinia";

interface Alert {
    show: boolean;
    message: string;
    title: string;
    type: 'success' | 'error' | 'info' | 'warning' | undefined;
}

export const useAlertStore = defineStore('alert', {
    state: () => {
        const alert: Alert = {
            show: false,
            message: '',
            title: 'Success',
            type: 'success',
        }
        return {
            alert
        }
    },
    actions: {
        showSuccess(message: string) {
            this.alert = {
                show: true,
                message: message,
                title: 'Success',
                type: 'success',
            }
        },
        showError(message: string) {
            this.alert = {
                show: true,
                message: message,
                title: 'An error occurred',
                type: 'error',
            }
        },
        showInfo(message: string) {
            this.alert = {
                show: true,
                message: message,
                title: 'Info',
                type: 'info',
            }
        },
        showWarning(message: string) {
            this.alert = {
                show: true,
                message: message,
                title: 'Warning',
                type: 'warning',
            }
        }
    }
})
