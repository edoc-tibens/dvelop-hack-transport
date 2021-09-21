<template>
  <q-page class="fit">
    <div class="fit row justify-center q-mt-xl">
    <q-input
        v-model="title"
        type="text"
        label="Bitte geben Sie einen Titel ein."
        class="q-mr-sm q-ml-xl col"
      />
      <q-input
        v-model="baseUri"
        type="text"
        label="Bitte geben Sie die Base-URI ein."
        class="col q-mr-sm"
      />
      <q-input
        v-model="apiKey"
        type="password"
        label="Bitte geben Sie den API-Key ein."
        class="col q-mr-xl"
      />
    </div>
    <div class="full-width row justify-center q-mt-sm">
      <q-btn
        color="primary"
        icon="add"
        label="Hinzufügen"
        @click="addDataSet"
        class=""
      />
    </div>
    <div class="q-ma-xl">
      <q-table
        title="Gespeicherte Tenanten"
        :rows="rows"
        :columns="columns"
        row-key="baseUri"
        :rows-per-page-options="[0]"
        :pagination="pagination"
        no-data-label="Keine Daten vorhanden!"
        style="width: 100%"
        class=""
      >
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              color="secondary"
              icon="delete"
              flat
              round
              @click="removeDataSet(props)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="full-width row justify-center q-mt-sm">
      <q-btn
        color="primary"
        icon="save"
        label="Speichern"
        class=""
        @click="saveDataSets()"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      apiKey: "",
      baseUri: "",
      title: "",
      rows: [],
      columns: [
        {
          name: "title",
          label: "Titel",
          field: "title",
          sortable: true,
          align: "left",
        },
        {
          name: "apiKey",
          label: "API-Key",
          field: "apiKey",
          sortable: true,
          align: "left",
        },
        {
          name: "baseUri",
          label: "Base-URI",
          field: "baseUri",
          sortable: true,
          align: "left",
        },
        {
          name: "action",
          label: "Aktion",
          field: "action",
          sortable: false,
          align: "left",
        },
      ],
      pagination: {
        page: 1,
        rowsPerPage: 0,
      },
    };
  },

  methods: {
    addDataSet() {
      if (this.apiKey.length > 0 && this.baseUri.length > 0) {
        this.rows.push({
          apiKey: this.apiKey,
          baseUri: this.baseUri,
          title: this.title,
        });
        this.apiKey = "";
        this.baseUri = "";
        this.title = "";
      }
    },

    removeDataSet(row) {
      if (row.rowIndex >= 0) {
        this.rows.splice(row.rowIndex, 1);
      }
    },

    async saveDataSets() {
        const datasets = this.rows.map((row) => ({apiKey: row.apiKey, baseUri: row.baseUri, title: row.title}));

        const axios = require('axios');

        const config = {
            method: 'post',
            url: '/hackathon-demo/config',
            headers: { 
                'Content-Type': 'application/json'
            },
            data : datasets
        };

        const result = await axios(config);
        
        this.$q.notify({
          message: 'Konfiguration wurde erfolgreich gespeichert!',
          color: 'positive',
          position: 'bottom',
        })
    }
  },

  async created() {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "https://edoc-tibens-dev.d-velop.cloud/hackathon-demo/config",
      headers: {},
    };

    var dataset = {}

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        dataset = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    this.rows = dataset;
  },
};
</script>
