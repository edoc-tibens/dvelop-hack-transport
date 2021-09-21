<template>
  <q-page padding>
    <div class="row">
      <q-btn-dropdown
        class="col q-mr-lg"
        :label="selectedTenant.length > 0 ? selectedTenant + ' ausgewählt' : 'Tenant auswählen'"
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
                <q-item-label>{{ tenant }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-list>
      </q-btn-dropdown>
      <q-btn
        class="col"
        color="primary"
        :disabled="selectedTenant.length <= 0"
        icon="send"
        label="Senden"
        @click="sendTenant"
      />
    </div>
  </q-page>
</template>

// /hackathon-demo/config/secure

<script>
export default {
  data() {
    return {
      tenants: [
        "tenant1",
        "tenant2",
        "tenant3",
        "tenant4",
        "tenant5",
        "tenant6",
        "tenant7",
        "tenant8",
      ],
      selectedTenant: "",
    };
  },
  methods: {
    selectTenant(tenant) {
      this.selectedTenant = tenant;
    },
    sendTenant() {
      this.$q.notify({
        message: "Tenant wurde gesendet.",
        color: "primary",
        position: "top-right",
      });
    },
  },
};
</script>
