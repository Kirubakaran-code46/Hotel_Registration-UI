<template>
    <div class="mx-5">
        <v-alert class="my-5" border="start" color="teal-darken-4" variant="tonal" height="4" width="300">
            <strong>Property Images</strong>
        </v-alert>
        <v-row>
            <!-- <v-col v-for="field in fields" :key="field.key" cols="12" md="4">
                <v-text-field :label="field.label" v-if="UserPropertyInfo[field.key]"
                    :model-value="UserPropertyInfo[field.key]" readonly variant="outlined" density="compact"
                    color="teal" />

                <v-file-input v-else accept=".jpg,.png,.pdf" variant="outlined" density="compact" color="teal"
                    prepend-icon="" prepend-inner-icon="mdi-image-size-select-actual" :label="field.label"
                    @update:modelValue="onFileChange($event, field.key)" />
            </v-col> -->

            <v-col v-for="field in fields" :key="field.key" cols="12" md="4">
                <!-- Show text + change button if docId exists and not changing -->
                <template v-if="UserPropertyInfo[field.key] && !changingFields.has(field.key)">
                    <v-text-field :label="field.label" :model-value="UserPropertyInfo[field.key]" readonly
                        variant="outlined" density="compact" color="teal" class="mb-1" />
                    <v-btn size="small" color="teal" variant="text" class="mt-n4 mb-2 text-none"
                        @click="changingFields.add(field.key)">
                        (Change)
                    </v-btn>
                </template>

                <!-- Show file input if no docId or user clicked "Change" -->
                <v-file-input v-else accept=".jpg,.png,.pdf" variant="outlined" density="compact" color="teal"
                    prepend-icon="" prepend-inner-icon="mdi-image-size-select-actual" :label="field.label"
                    @update:modelValue="onFileChange($event, field.key)" />
            </v-col>

        </v-row>

        <v-row>
            <v-col class="d-flex justify-start mb-10 mr-10">
                <v-btn color="teal-darken-4" @click="previousPage('B')">
                    <v-icon icon="mdi-rewind" start></v-icon>
                    Back</v-btn>
            </v-col>
            <v-col class="d-flex justify-end mb-10 mr-10">
                <v-btn color="teal-darken-4" @click="InsertProperty">Next
                    <v-icon icon="mdi-fast-forward" end></v-icon>
                </v-btn>
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
        UserPropertyInfo: {
            type: Object,
            required: true,
        }
    },
    setup() {
        const snackbar = useSnackbarStore();
        const loader = useLoaderStore()
        return { snackbar, loader }
    },
    data() {
        return {
            fields: [
                { key: 'Facade_docId', label: 'Facade' },
                { key: 'Parking_docId', label: 'Parking' },
                { key: 'Lobby_docId', label: 'Lobby' },
                { key: 'Reception_docId', label: 'Reception' },
                { key: 'Corridors_docId', label: 'Corridors' },
                { key: 'Lift_docId', label: 'Lift / Elevator' },
                { key: 'Bathroom_docId', label: 'Restroom' },
                { key: 'OtherArea_docId', label: 'Other Areas' },
                { key: 'PropertyImg_docId', label: 'Property Image' }
            ],
            fileInputs: {} as Record<string, File | null>,
            changedFields: new Set<string>(),
            changingFields: new Set<string>()
        };
    },
    methods: {
        previousPage(val: string) {
            this.$emit('changePage', val);
        },
        onFileChange(file: File | File[], key: string) {
            const selectedFile = Array.isArray(file) ? file[0] : file;
            if (selectedFile) {
                this.fileInputs[key] = selectedFile;
                this.changedFields.add(key);
            } else {
                delete this.fileInputs[key];
                this.changedFields.delete(key);
            }
        },
        async InsertProperty() {
            if (this.changedFields.size === 0) {
                this.$emit('changePage', 'N');
                return;
            }

            const formData = new FormData();

            for (const key of this.changedFields) {
                if (this.fileInputs[key]) {
                    formData.append(key, this.fileInputs[key] as File);
                }
            }

            // for (let [key, value] of formData.entries()) {
            //     console.log('@@@@@', `${key}:`, value);
            // }
            this.loader.show()
            EventServices.InsertPropertyInfo(formData)
                .then((response) => {
                    if (response.data.status == 'S') {
                        this.changedFields.clear();
                        this.changingFields.clear();
                        this.loader.hide()
                        this.$emit('changePage', 'N');
                    } else {
                        this.loader.hide()
                        this.snackbar.show(response.data.status, response.data.msg)
                    }
                })
                .catch((error) => {
                    console.log(error)
                    this.loader.hide()
                })

        }
    }
}
</script>