<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-img
        src="https://i.imgur.com/KejTwUH.png"
        width="40px"
        height="40px"
        fit="cover"
        style="filter: brightness(0) invert(1);"
        />
        <q-toolbar-title>Codeflakes transport app</q-toolbar-title>
      </q-toolbar>
    </q-header>
  
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",
});
</script>
