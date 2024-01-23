<script setup lang="ts">
import { reactive, ref } from "vue";
import VirtualTable from "./virtualTable.vue";

const activeComponent = ref("virtualTable");

const components = reactive([{ value: "virtualTable", label: "虚拟滚动" }]);

const column = [
  {
    title: "Seq",
    dataIndex: "seq",
    key: "seq",
    width: "100px",
  },
  {
    title: "Message",
    dataIndex: "message",
    key: "message",
    // width: "100px",
  },
];

function changeComponent(name: string) {
  activeComponent.value = name;
}
</script>

<template>
  <div class="header">
    <button
      v-for="item in components"
      :key="item.value"
      @click="changeComponent(item.value)"
    >
      {{ item.label }}
    </button>
  </div>

  <div>
    <VirtualTable v-if="activeComponent === 'virtualTable'" :column="column" table-width="700px" />
  </div>
</template>

<style scoped lang="less">
.header {
  margin-bottom: 10px;
}
</style>
