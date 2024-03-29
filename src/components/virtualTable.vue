<template>
  <div
    class="virtual-table-table"
    :class="{
      [now]: true,
    }"
    :style="{
      width: tableWidth,
    }"
  >
    <div class="virtual-table-thead">
      <div class="virtual-table-tr">
        <div
          class="virtual-table-th"
          v-for="c in column"
          :key="c.dataIndex"
          :style="{
            width: c.width ?? 'auto',
          }"
          :class="{
            'virtual-table-th--grow': c.width === undefined ? true : false,
          }"
        >
          <div v-if="c.type === 'checkbox'">
            <input
              type="checkbox"
              v-model="isAllCheck"
              @click="onclickCheckAll"
            />
          </div>

          <div v-else>
            {{ c.title }}
          </div>
        </div>
      </div>
    </div>

    <div class="virtual-table-tbody">
      <DynamicScroller :items="items" :min-item-size="54" class="scroller">
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[item.message]"
            :data-index="index"
          >
            <div class="virtual-table-tr">
              <div
                class="virtual-table-td"
                v-for="c in column"
                :key="c.dataIndex"
                :style="{
                  width: c.width ?? 'auto',
                }"
                :class="{
                  'virtual-table-td--grow':
                    c.width === undefined ? true : false,
                }"
              >
                <div v-if="c.type === 'checkbox'">
                  <input
                    type="checkbox"
                    v-model="checkArray[index]"
                    @click="(e) => onclickCheck(e, index)"
                  />
                </div>

                <div v-else>
                  {{ item[c.dataIndex] }}
                </div>
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import { WidthCalculator } from "../utils/styleCalc";
import type { IColumnItem } from "../types/virtualTable";
import { CheckboxController } from "../controllers/check.controller";

const props = defineProps<{
  tableWidth?: string | number;
  column: Array<IColumnItem>;
}>();

const tableWidth = computed(() => {
  return String(props.tableWidth ?? "100%");
});

const column = computed(() => {
  const column = props.column;

  return new WidthCalculator(column, tableWidth.value).calc();
});

console.log("column", column);

// 得到当前时间戳
const now = (() => {
  return "t" + new Date().getTime().toString();
})();

const items = reactive(
  Array.from({ length: 1000 }).map((_, index) => ({
    key: `${index}`,
    id: `${index}`,
    seq: `${index}`,
    message: index % 3 === 0 ? `Item ${index}` : `Item ${index}`.repeat(100),
  }))
);

// 完整数据的check Array
const checkArray: Array<boolean> = reactive([]);

items.forEach(() => {
  checkArray.push(false);
});

const checkboxController = new CheckboxController<{
  key: string;
  seq: string;
  message: string;
}>(items, []);

// 是否全选
const isAllCheck = ref(checkboxController.getAllChecked());

function onclickCheckAll(e: MouseEvent) {
  console.log("onclickCheckAll", e);

  checkboxController.allCheckedChange();

  checkArray.splice(
    0,
    checkArray.length,
    ...checkboxController.getAllItemsCheckStatus()
  );
  isAllCheck.value = checkboxController.getAllChecked();
}

function onclickCheck(e: MouseEvent, index: number) {
  console.log("onclickCheck", e, index);

  checkboxController.itemCheckedChange(index);

  checkArray.splice(
    0,
    checkArray.length,
    ...checkboxController.getAllItemsCheckStatus()
  );
  isAllCheck.value = checkboxController.getAllChecked();
}
</script>

<style scoped lang="less">
@import "../style/table.less";
.scroller {
  height: 100%;
}

.virtual-table-table {
  width: 700px;
}

.virtual-table-table,
.virtual-table-thead,
.virtual-table-tbody,
.virtual-table-tr,
.virtual-table-th,
.virtual-table-td {
  border: 1px solid @vxe-table-border-color;
}

.virtual-table-tr,
.virtual-table-th {
  display: flex;
}

.virtual-table-th,
.virtual-table-td {
  display: inline-flex;
  padding: 8px 16px;
}

.virtual-table-th {
  background-color: @vxe-table-header-background-color;
  align-items: stretch;
  &.virtual-table-th--grow {
    flex-grow: 1;
  }
}

.virtual-table-td {
  // flex: 1;
  align-items: stretch;

  &.virtual-table-td--grow {
    flex-grow: 1;
  }
}
</style>
