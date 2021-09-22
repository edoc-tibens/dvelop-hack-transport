<template>
  <q-page padding>
    <div class="row">
      <q-btn-dropdown
        class="col q-mr-lg"
        :label="
          selectedTenant.title.length > 0
            ? selectedTenant.title
            : 'Tenant auswählen'
        "
        color="primary"
        icon="tenant"
      >

          <q-list>
            <q-item
              v-for="tenant in tenants"
              :key="tenant"
              clickable
              v-close-popup
              @click="selectTenant(tenant)"
            >
              <q-item-section avatar>
                <q-avatar icon="dns" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ tenant.title }}</q-item-label>
                <q-item-label caption>{{ tenant.baseUri }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
      </q-btn-dropdown>
      <q-btn
        class="col"
        color="primary"
        :disabled="selectedTenant.title.length <= 0 || invalid.length > 0"
        icon="send"
        label="Senden"
        @click="sendTenant"
      />
    </div>
     <q-banner inline-actions class="text-white bg-red q-mt-xl" v-if="invalid.length > 0">
      Es konnten nicht alle Eigenschaften der Tenants miteinander verbunden werden. Bitte prüfen Sie die fehlerhaften Dokumente.
    </q-banner>
    <div class="row q-mt-xl">
      <q-list class="full-width" bordered separator>
        <div class="text-h6 q-pa-md">Ausgewählte Dokumente</div>
        <q-separator />
       
       <q-expansion-item
        v-for="i in captions.length"
        :key="i"
        expand-separator
        icon="description"
        :label="captions[i - 1]"
        :caption="filetypes[i - 1]"
        
        >
        
        <template class="full-width" v-slot:header>
          <q-item class="full-width row">
            <q-item-section avatar class="justify-start">
              <q-icon color="primary" name="description" />
            </q-item-section>
            <q-item-section>
            <a class="justify-start" :href="hrefs[i - 1]" target="dapi_navigate">{{captions[i - 1]}}</a>
              
            </q-item-section>
            <q-item-section class="justify-end" >
              <q-icon v-if="invalidDocuments[i - 1] != undefined" name="warning" style="font-size: 24px;" class="text-red" @click="openDialog(invalidDocuments[i - 1], documentMetas[i - 1])" />
            </q-item-section>
            <q-item-section class="justify-end" style="text-align: end" >
              <q-item-label caption>{{filetypes[i - 1]}}</q-item-label>

            </q-item-section>
            
          </q-item>
	      </template>
        <q-card class="my-card">
          <q-card-section>
            <div class="text-body1"><b>Kategorie:</b> {{categories[i-1]}}</div>
            <div class="text-body1"><b>Status:</b> {{states[i-1]}}</div>
            <div class="text-body1"><b>Name:</b> {{fileNames[i-1]}}</div>
            <div class="text-body1"><b>Größe:</b> {{sizes[i-1]}}</div>
            <div class="text-body1"><b>Zuletzt modifiziert:</b> {{modifications[i-1]}}</div>
          </q-card-section>
        </q-card>
      
      </q-expansion-item>
      </q-list>
    </div>
  </q-page>
     <q-dialog
      v-model="fullWidth"
      full-width
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">Mapping für Dokumentkategorie {{sourceCategoryDisplayName}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-h6 q-pa-md">Attribute</div>
           <q-table
            :rows="rows"
            :columns="columns"
            row-key="sourceAttributeId"
          />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Speichern" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

</template>

<script>
import {QSpinnerGears} from 'quasar'

export default {

  data() {
    return {
      tenants: [],
      selectedTenant: { title: "", baseUri: "" },
      captions: [],
      filetypes: [],
      categories: [],
      states: [],
      fileNames: [],
      modifications: [],
      sizes: [],
      hrefs: [],
      invalidDocuments: [],
      documentMetas: [],
      invalid: [],
      targetMapping: {},
      index: 0,
      sourceCategoryDisplayName: "",
      rows: [
      ],
      columns: [
        {
          name: 'sourceAttributeId',
          label: 'Quellattribut',
          field: 'sourceAttributeId',
          align: 'left'
        },
         {
          name: 'targetAttributeId',
          label: 'Zielattribut',
          field: 'targetAttributeId',
          align: 'left'
        }
      ],
      fullWidth: false,
    };
  },
  methods: {
    selectTenant(tenant) {
      this.selectedTenant = tenant;
      this.validateDocuments();
    },
    async sendTenant() {
    var index = 0;
    var fileNames = this.fileNames


      var timer = setInterval(() => {
         if(fileNames[index] !== undefined){
            this.$q.loading.show({
              spinner: QSpinnerGears,
              message: fileNames[index] + " wird bearbeitet."
            })
         
         index++
         }
         else{
           this.$q.loading.show({
            spinner: QSpinnerGears,
            message: fileNames[0] + " wird bearbeitet."
            })
            index= 1;
         }
        }, 900)

      var axios = require("axios");
      var data = {
        documents: location.hash.substring(21, location.hash.length),
        tenant: this.selectedTenant,
      };

      var config = {
        method: "post",
        url: "/hackathon-demo/documents",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      var success = false;

      await axios(config)
        .then(function (response) {
          console.log(response.data);
          success = true;
        })
        .catch(function (error) {
          console.log(error);
        });

      if (success) {
        this.$q.notify({
          message: "Dokumente wurden erfolgreich gesendet!",
          color: "positive",
          position: "bottom",
        });
      }
      else{
      this.$q.notify({
          message: "Dokumente konnten nicht gesendet werden!",
          color: "negative",
          position: "bottom",
        });
      }

        clearInterval(timer);
        this.$q.loading.hide()
        index = 0;
    },
    async validateDocuments() {
      console.log('Start validation');
      var axios = require("axios");
      var data = {
        documents: this.documentMetas,
        tenant: this.selectedTenant,
      };

      var config = {
        method: "post",
        url: "/hackathon-demo/validate",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios(config);
      this.invalid = response.data;
      this.documentMetas.forEach((meta) => {
        const inv = this.invalid.find((inv) => inv.category === meta.category);
        this.invalidDocuments.push(inv);
      });
      
      config = {
        method: "get",
        url: "/hackathon-demo/targetmapping",
        headers: {
          "Content-Type": "application/json",
        }
      };   

      const mappingResponse = await axios(config);
      this.targetMapping = mappingResponse;

    },
    openDialog(invalid, documentMeta){
      const propnames = [];
      this.sourceCategoryDisplayName = invalid.category;
      const invalidForCategory = this.invalid.filter((inv) => inv.category === invalid.category);
      invalidForCategory.forEach((invForCat) => {
        const prop = documentMeta.objectProperties.find((prop) => prop.id == invForCat.propertyID);
        propnames.push(prop.name);
        console.log(prop.name);
      });
      propnames.forEach((name) => this.rows.push({sourceAttributeId: name, targetAttributeId: null}));
      this.fullWidth = true;
    }
  },

  async created() {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "/hackathon-demo/config/secure",
      headers: {},
    };

    var data = [];

    await axios(config)
      .then(function (response) {
        data = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    this.tenants = data;

    config = {
      method: "get",
      url:
        "https://edoc-tibens-dev.d-velop.cloud" +
        decodeURIComponent(location.hash.split("url=")[1]),
      headers: {},
    };

    data = [];

    await axios(config)
      .then(function (response) {
        data = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    var captions = [];
    var filetypes = [];
    var categories = [];
    var states = [];
    var fileNames = [];
    var sizes = [];
    var modifications = [];
    var hrefs = [];
    var documentMetas = [];

    console.log(data.selectionList);
    for (var i = 0; i < data.selectionList.length; i++) {
      config = {
        method: "get",
        url:
          "https://edoc-tibens-dev.d-velop.cloud" +
          data.selectionList[i]._links.self.href,
        headers: {
          Accept: "application/json, text/plain, */*",
        },
      };

      await axios(config)
        .then(function (response) {
          console.log(response.data);
          filetypes.push(response.data.systemProperties[10].displayValue);
          captions.push(response.data.caption);
          hrefs.push(response.data._links.self.href);
          documentMetas.push(response.data);
          categories.push(response.data.category);
          states.push(response.data.systemProperties[16].displayValue);
          fileNames.push(response.data.systemProperties[9].displayValue);
          sizes.push(response.data.systemProperties[15].displayValue);
          modifications.push(response.data.systemProperties[0].displayValue);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    this.captions = captions;
    this.filetypes = filetypes;
    this.categories = categories;
    this.states = states;
    this.fileNames = fileNames;
    this.sizes = sizes;
    this.modifications = modifications;
    this.hrefs = hrefs;
    this.documentMetas = documentMetas;
  },
};
</script>
