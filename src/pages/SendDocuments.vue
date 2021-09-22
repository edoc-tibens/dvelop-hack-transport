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
        </q-list>
      </q-btn-dropdown>
      <q-btn
        class="col"
        color="primary"
        :disabled="selectedTenant.title.length <= 0"
        icon="send"
        label="Senden"
        @click="sendTenant"
      />
    </div>
    <div class="row q-mt-xl">
      <q-list bordered separator>
        <div class="text-h6 q-pa-md">Ausgewählte Dokumente</div>
        <q-separator />
        <q-item
          v-for="i in captions.length"
          :key="i"
          v-ripple
          :active="active"
          active-class="bg-teal-1 text-grey-8"
        >
          <q-item-section avatar>
            <q-icon name="description" color="secondary" />
          </q-item-section>
          <q-item-section
            ><a :href="hrefs[i - 1]" target="dapi_navigate">{{
              captions[i - 1]
            }}</a></q-item-section
          >
          <q-item-section side>{{ filetypes[i - 1] }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      tenants: [],
      selectedTenant: { title: "", baseUri: "" },
      captions: [],
      filetypes: [],
      hrefs: [],
    };
  },
  methods: {
    selectTenant(tenant) {
      this.selectedTenant = tenant;
    },
    async sendTenant() {
      this.$q.loading.show({
        message: "Dokumente werden gesendet...",
      });

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

      this.$q.loading.hide();
    },
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
    var hrefs = [];

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
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    this.captions = captions;
    this.filetypes = filetypes;
    this.hrefs = hrefs;
  },
};
</script>
