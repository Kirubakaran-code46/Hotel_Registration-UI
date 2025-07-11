<template>
    <div class="mx-5">
        <v-alert class="my-5" border="start" color="teal-darken-4" variant="tonal" height="4" width="300">
            <strong>Bank Details</strong>
        </v-alert>
        <v-row>

            <v-col>
                <v-text-field v-model="UserDocsInfo.accountNumber" color="teal" label="Account Number" density="compact"
                    variant="outlined" />
            </v-col>
            <v-col>
                <v-text-field v-model="UserDocsInfo.accHolderName" color="teal" label="Account Holders Name"
                    density="compact" variant="outlined" />
            </v-col>
            <v-col>
                <v-text-field v-model="UserDocsInfo.IFSC_Code" @input="GetIFSCinfo" color="teal" label="IFSC Code"
                    density="compact" variant="outlined" :rules="ifscRules" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="4">
                <v-text-field v-model="UserDocsInfo.bankName" color="teal" label="Bank Name" density="compact"
                    variant="outlined" disabled />
            </v-col>
            <v-col cols="12" md="4">
                <v-text-field v-model="UserDocsInfo.Branch" color="teal" label="Branch" density="compact"
                    variant="outlined" disabled />
            </v-col>
            <v-col cols="12" md="4">
                <v-text-field v-model="UserDocsInfo.ifsc_city" color="teal" label="city" density="compact"
                    variant="outlined" disabled />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-textarea v-model="UserDocsInfo.ifsc_Address" color="teal" label="Bank Address" density="compact"
                    variant="outlined" disabled auto-grow rows="1"></v-textarea>
            </v-col>
            <v-col>
                <v-text-field v-model="UserDocsInfo.ifsc_State" color="teal" label="State" density="compact"
                    variant="outlined" disabled />
            </v-col>
        </v-row>

        <v-alert class="my-5" border="start" color="teal-darken-4" variant="tonal" height="4" width="300">
            <strong>GST Details</strong>
        </v-alert>

        <v-row>
            <v-col cols="12" md="6">
                <v-text-field v-model="UserDocsInfo.GST_Number" color="teal" label="GST Number" density="compact"
                    variant="outlined" />
            </v-col>
            <!-- <v-col cols="12" md="5" v-if="!GstFileInsertVisible">
                <v-text-field v-model="GstDocs.GST_Docid" color="teal" label="GST Certificate" density="compact"
                    variant="outlined" append-inner-icon="mdi-eye"
                    @click:append-inner="showImage(GstDocs.gstFileBase64)" />
            </v-col>
            <v-col cols="12" md="1" v-if="!GstFileInsertVisible">
                <v-btn size="small" variant="text" class="text-none mt-1" color="primary"
                    @click="GstFileInsertVisible = true">change file</v-btn>
            </v-col> -->
            <v-col>


                <v-text-field v-if="gstDocId != ''" v-model="gstDocId" color="teal" label="GST Certificate"
                    density="compact" variant="outlined" />
                <v-file-input v-else @change="gstFileChange = true" v-model="GstDocs.NewGstFile" accept=".pdf,.jpg,.png"
                    color="teal" label="GST Certificate" density="compact" variant="outlined" prepend-icon=""
                    prepend-inner-icon="mdi-paperclip"></v-file-input>

            </v-col>
        </v-row>
        <!-- ****************************PROPERTY OWNERSHIP************* -->

        <v-alert class="my-5" border="start" color="teal-darken-4" variant="tonal" height="4" width="300">
            <strong>Property Ownership</strong>
        </v-alert>

        <v-row>
            <v-col cols="12"
                :md="UserDocsInfo.PropertyOwnership == 'Lease Property' || UserDocsInfo.PropertyOwnership == 'Management Property' ? '4' : '6'">
                <v-select label="Property Ownership" v-model="UserDocsInfo.PropertyOwnership"
                    :items="PropertyOwnershipArr" variant="outlined" color="teal" density="compact"></v-select>
            </v-col>
            <v-col cols="12" md="4"
                v-if="UserDocsInfo.PropertyOwnership == 'Lease Property' || UserDocsInfo.PropertyOwnership == 'Management Property'">
                <!-- Start Date Picker -->

                <v-menu v-model="startMenu" :close-on-content-click="false" transition="scale-transition" offset-y
                    location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-text-field v-model="UserDocsInfo.startDate" label="Start Date" color="teal" density="compact"
                            variant="outlined" readonly v-bind="props" prepend-inner-icon="mdi-calendar" />
                    </template>

                    <v-date-picker hide-header v-model="internalStartDate" @update:modelValue="handleStartDate"
                        color="teal" />
                </v-menu>
            </v-col>
            <v-col cols="12" md="4"
                v-if="UserDocsInfo.PropertyOwnership == 'Lease Property' || UserDocsInfo.PropertyOwnership == 'Management Property'">
                <!-- End Date Picker -->

                <v-menu v-model="endMenu" :close-on-content-click="false" transition="scale-transition" offset-y
                    location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-text-field v-model="UserDocsInfo.endDate" label="End Date" color="teal" density="compact"
                            variant="outlined" readonly v-bind="props" prepend-inner-icon="mdi-calendar" />
                    </template>

                    <v-date-picker hide-header v-model="internalEndDate" @update:modelValue="handleEndDate"
                        color="teal" />
                </v-menu>
            </v-col>
        </v-row>
        <!-- ************************************************ -->

            <v-alert class="my-5" border="start" color="teal-darken-4" variant="tonal" height="4" width="300">
            <strong>Utility Types</strong>
        </v-alert>

        <!-- <v-btn color="teal" class="mb-4" @click="addUtility">Add Utility</v-btn> -->

        <div v-for="(utility, index) in utilities" :key="index" class="mb-4">
            <v-row>
                <v-col>
                    <v-select :items="billTypes" v-model="utility.billType" color="teal" label="Utility Bill Type"
                        density="compact" variant="outlined" />
                </v-col>
                <v-col>
                    <v-text-field v-if="utility.billDocid != ''" v-model="utility.billDocid" color="teal"
                        label="Uploaded Photo" density="compact" variant="outlined" />
                    <v-file-input v-else v-model="utility.billFile" accept=".pdf,.jpg,.png" color="teal"
                        label="Upload Photo" density="compact" variant="outlined" prepend-icon=""
                        prepend-inner-icon="mdi-paperclip"></v-file-input>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="d-flex justify-start mr-10" v-if="utilities.length > 1">
                    <v-btn size="small" variant="tonal" @click="removeUtility(index)" class="text-none"
                        prepend-icon="mdi-close-box" color="warning">Remove
                        Utility</v-btn>
                </v-col>

                <v-col class="d-flex justify-end mr-10">
                    <v-btn size="small" variant="tonal" class="text-none" prepend-icon="mdi-plus-box" color="teal"
                        @click="addUtility">Add
                        Utility</v-btn>
                </v-col>
            </v-row>
            <v-divider class="my-3"></v-divider>
        </div>
        <!-- ************************************************ -->

            <v-alert class="my-5" border="start" color="teal-darken-4" variant="tonal" height="4" width="300">
            <strong>Cancelled Cheque</strong>
        </v-alert>
        <v-row>

            <!-- <v-col cols="12" md="5" v-if="!chequeFileInsertVisible">
                <v-text-field v-model="chequeDocs.Cheque_Docid" color="teal" label="Cancelled Cheque" density="compact"
                    variant="outlined" append-inner-icon="mdi-eye"
                    @click:append-inner="showImage(chequeDocs.ChequeFileBase64)" />
            </v-col>
            <v-col cols="12" md="1" v-if="!chequeFileInsertVisible">
                <v-btn size="small" variant="text" class="text-none mt-1" color="primary"
                    @click="chequeFileInsertVisible = true">change file</v-btn>
            </v-col> -->
            <v-col cols="12" md="6">

                <v-text-field v-if="cancelledChequeDocId != ''" v-model="cancelledChequeDocId" color="teal"
                    label="Cancelled Cheque" density="compact" variant="outlined" />
                <v-file-input v-else @change="chequeFileChange = true" v-model="chequeDocs.NewChequeFile"
                    accept=".pdf,.jpg,.png" color="teal" label="Cancelled Cheque" density="compact" variant="outlined"
                    prepend-icon="" prepend-inner-icon="mdi-paperclip"></v-file-input>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="d-flex justify-start mb-10 mr-10">
                <v-btn color="teal-darken-4" @click="previousPage('B')">
                    <v-icon icon="mdi-rewind" start></v-icon>
                    Back</v-btn>
            </v-col>
            <v-col class="d-flex justify-end mb-10 mr-10">
                <v-btn color="teal-darken-4" @click="insertDocsInfo">Next
                    <v-icon icon="mdi-fast-forward" end></v-icon>
                </v-btn>
            </v-col>
        </v-row>

        <!-- DIALOG******************************************************** -->
        <!-- <v-dialog v-model="isVisible" max-width="600">
            <v-card>
                <v-card-title class="text-h6">File Preview</v-card-title>
                <v-card-text>
        <v-img v-if="isImageFile(imageData)" :src="imageData" max-height="400" contain class="rounded" />

        <v-btn v-else-if="isPdfFile(imageData)" :href="imageData" target="_blank" download color="primary" class="mt-4">
            Download PDF
        </v-btn>

        <div v-else class="text-error mt-2">
            Unsupported file format.
        </div>
        </v-card-text>

        <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="isVisible = false">Close</v-btn>
        </v-card-actions>
        </v-card>
        </v-dialog> -->

    </div>
</template>
<script>
import EventServices from '@/Services/EventServices';
import { useLoaderStore } from "@/stores/loaderStore";
import { useSnackbarStore } from '@/stores/snackbarStore';

export default {
    props: {
        UserDocsInfo: {
            type: Object,
            required: true,
            default: () => { }
        }
    },
    watch: {
        UserDocsInfo: {
            handler(newVal) {
                this.utilities = JSON.parse(JSON.stringify(newVal.utilities));
                this.originalUtilities = JSON.parse(JSON.stringify(newVal.utilities));
                this.gstDocId = newVal.GST_Docid
                this.cancelledChequeDocId = newVal.cancelledChequeDocid

                if (!this.isCloned && newVal && newVal.length > 0) {
                    this.UploadDocs = JSON.parse(JSON.stringify(newVal));
                    // this.isCloned = true;
                }
                // else {
                if (this.utilities == null) {
                    this.utilities = [this.createUtilitiesType()]; // Insert mode
                    this.originalUtilities = [this.createUtilitiesType()]; // Insert mode
                }

                // }

                // this.GstFileInsertVisible = false
                // this.chequeFileInsertVisible = false
                // if (newVal.GST_Docid != "") {
                //     this.GstDocs.GST_Docid = newVal.GST_Docid
                //     // this.GstDocs.gstFileBase64 = newVal.gstFileBase64
                // } 
                // else {
                //     this.GstFileInsertVisible = true
                // }
                // if (newVal.chequeFileBase64 != "") {
                //     this.chequeDocs.Cheque_Docid = newVal.cancelledChequeDocid
                //     // this.chequeDocs.ChequeFileBase64 = newVal.chequeFileBase64
                // } 
                // else {
                //     this.chequeFileInsertVisible = true
                // }

                // if (newVal.utilities) {
                //     this.utilities = newVal.utilities
                // }
                // this.GstDoc = new File(["dummy content"], "example.pdf", { type: "application/pdf" });

            }
        }
    },
    computed: {
        formattedStartDate() {
            return this.formatDate(this.UserDocsInfo.startDate);
        },
        formattedEndDate() {
            return this.formatDate(this.UserDocsInfo.endDate);
        },
        ifscRules() {
            return [
                (v) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v) || "Invalid IFSC format",
            ];
        }
    },
      setup() {
        const snackbar = useSnackbarStore();
        const loader = useLoaderStore()
        return { snackbar, loader }
    },
    data() {
        return {
            // Menu controls
            startMenu: false,
            endMenu: false,

            // Raw values (internal picker binding)
            internalStartDate: null,
            internalEndDate: null,
            PropertyOwnershipArr: ['Own Property', 'Lease Property', 'Management Property'],
            isCloned: false,
            gstFileChange: false,
            chequeFileChange: false,
            isVisible: false,
            imageData: '',
            billTypes: ['Property Tax', 'Electricity Bill', 'Water Tax'],
            utilities: [],
            originalUtilities: [],
            GstDocs: {
                GST_Docid: "",
                gstFileBase64: null,
                NewGstFile: null
            },
            chequeDocs: {
                Cheque_Docid: "",
                ChequeFileBase64: null,
                NewChequeFile: null
            },
            GstFileInsertVisible: false,
            chequeFileInsertVisible: false,
            gstDocId: "",
            cancelledChequeDocId: "",
            chequeDoc: null,
            UploadDocs: {}
        };
    },
    methods: {
        GetIFSCinfo() {
            this.UserDocsInfo.IFSC_Code = this.UserDocsInfo.IFSC_Code.toUpperCase()

            const isValidIFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(this.UserDocsInfo.IFSC_Code);

            if (this.UserDocsInfo.IFSC_Code.length === 11 && isValidIFSC) {
                const lData = {
                    ifsc: this.UserDocsInfo.IFSC_Code
                }
                EventServices.GetIFSCDetails(lData).
                    then((response) => {
                        this.UserDocsInfo.bankName = response.data.IFSCdata.BANK
                        this.UserDocsInfo.Branch = response.data.IFSCdata.BRANCH
                        this.UserDocsInfo.ifsc_city = response.data.IFSCdata.CITY
                        this.UserDocsInfo.ifsc_Address = response.data.IFSCdata.ADDRESS
                        this.UserDocsInfo.ifsc_State = response.data.IFSCdata.STATE
                    })
            }
        },
        previousPage(val) {
            this.$emit('changePage', val);
        },
        handleStartDate(val) {
            this.startMenu = false;
            this.UserDocsInfo.startDate = val ? this.formatDate(val) : '';
        },
        handleEndDate(val) {
            this.endMenu = false;
            this.UserDocsInfo.endDate = val ? this.formatDate(val) : '';
        },
        formatDate(dateVal) {
            const date = new Date(dateVal);
            if (isNaN(date.getTime())) return '';
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        },
        // isImageFile(fileSrc: string) {
        //     return /^data:image\/(png|jpeg|jpg|gif);base64,/i.test(fileSrc);
        // },
        // isPdfFile(fileSrc: string) {
        //     return /^data:application\/pdf;base64,/i.test(fileSrc);
        // },
        // showImage(data: string | null) {
        //     this.imageData = String(data)
        //     this.isVisible = true
        // },
        createUtilitiesType() {
            return {
                billType: "",
                billDocid: "",
                billFile: null,
            }
        },

        addUtility() {
            this.utilities.push(this.createUtilitiesType());
        },
        removeUtility(index) {
            if (this.utilities.length > 1) {
                this.utilities.splice(index, 1);
            }
        },

        insertDocsInfo() {
            if (this.UserDocsInfo.PropertyOwnership != 'Own Property') {
                const lStartDate = new Date(this.UserDocsInfo.startDate)
                const lEndDate = new Date(this.UserDocsInfo.endDate)

                if (lEndDate < lStartDate) {
                    this.snackbar.show("E", "End Date cannot be earlier than Start Date");
                    return;
                }
            }

            var lFormData = new FormData();
            const payload = {
                bankName: this.UserDocsInfo.bankName,
                accountNumber: this.UserDocsInfo.accountNumber,
                accHolderName: this.UserDocsInfo.accHolderName,
                IFSC_Code: this.UserDocsInfo.IFSC_Code,
                Branch: this.UserDocsInfo.Branch,
                GST_Number: this.UserDocsInfo.GST_Number,
                GST_Docid: this.gstDocId,
                cancelledChequeDocid: this.cancelledChequeDocId,
                utilities: [],
                PropertyOwnership: this.UserDocsInfo.PropertyOwnership,
                startDate: this.UserDocsInfo.PropertyOwnership == 'Own Property' ? '' : this.UserDocsInfo.startDate,
                endDate: this.UserDocsInfo.PropertyOwnership == 'Own Property' ? '' : this.UserDocsInfo.endDate,
                ifsc_city: this.UserDocsInfo.ifsc_city,
                ifsc_Address: this.UserDocsInfo.ifsc_Address,
                ifsc_State: this.UserDocsInfo.ifsc_State
            }

            if (this.GstDocs.NewGstFile) {
                lFormData.append('GST_Docid', this.GstDocs.NewGstFile)
            }
            if (this.chequeDocs.NewChequeFile) {
                lFormData.append('cancelledChequeDocid', this.chequeDocs.NewChequeFile)
            }

            this.utilities.forEach((util, index) => {
                if (util.billDocid === "") {

                    if (util.billFile) {
                        lFormData.append(`billDocid_${index}`, util.billFile); // File
                    }

                    payload.utilities.push({
                        billType: util.billType,
                        billDocid: `billDocid_${index}`, // This matches the field name of the uploaded file
                    });
                } else {
                    payload.utilities.push({
                        billType: util.billType,
                        billDocid: util.billDocid, // This matches the field name of the uploaded file
                    });
                }
            });

            // Step 4: Append the JSON payload
            lFormData.append('data', JSON.stringify(payload)); // send all values as one field


            // Debug output
            // for (let [key, value] of lFormData.entries()) {
            //     console.log('@@@@@', `${key}:`, value);
            // }


            this.loader.show()
            EventServices.insertDocsInfo(lFormData)
                .then((response) => {

                    if (response.data.status == 'S') {
                        this.$emit('changePage', 'N');
                        this.loader.hide()
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
    },

}
</script>