<template>
  <q-page padding>
    <div class="row">
      <q-btn-dropdown
        class="col q-mr-lg"
        :label="
          selectedTenant.title.length > 0
            ? selectedTenant.title + ' ausgewählt'
            : 'Tenant auswählen'
        "
        color="primary"
        icon="person"
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
                <q-avatar icon="person" color="primary" text-color="white" />
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
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      tenants: [],
      selectedTenant: { title: "", baseUri: "" },
    };
  },
  methods: {
    selectTenant(tenant) {
      this.selectedTenant = tenant;
    },
    async sendTenant() {
      // /hackathon-demo/documents
      
        var axios = require('axios');
        var data = {
                        documents: location.hash.substring(21, location.hash.length -1),
                        tenant: this.selectedTenant,
                    }

        var config = {
        method: 'post',
        url: 'https://edoc-tibens-dev.d-velop.cloud/hackathon-demo/documents',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
        };

        await axios(config)
        .then(function (response) {
        console.log(response.data);
        })
        .catch(function (error) {
        console.log(error);
        });

        this.$q.notify({
        message: this.selectedTenant.title + " wurde gesendet.",
        color: "primary",
        position: "top-right",
      });

    },
  },

  async created() {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "https://edoc-tibens-dev.d-velop.cloud/hackathon-demo/config/secure",
      headers: {},
    };
    
    var data = []
    
    await axios(config)
      .then(function (response) {
        data = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    this.tenants = data;
  },
};
</script>
