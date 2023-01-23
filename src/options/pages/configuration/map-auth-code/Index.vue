<script setup lang="ts">
import { ref } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { MapAuthCode } from '~/models'

const amapAuthCode = ref(new MapAuthCode())

const amapFormRef = ref<FormInst | null>(null)
const amapRules: FormRules = {

}

function save() {

}
</script>

<template>
  <div class="map-auth-code-wrapper">
    <n-card
      title="地图授权码"
      embedded
      :bordered="false"
    >
      <template #header-extra>
        <div>
          <n-button
            strong
            size="small"
            type="success"
            @click="save"
          >
            保存
          </n-button>
        </div>
      </template>
      <n-tabs
        default-value="amap"
        size="small"
        justify-content="space-evenly"
      >
        <n-tab-pane
          name="amap"
          tab="高德地图"
        >
          <n-form
            ref="amapFormRef"
            size="small"
            :model="amapAuthCode"
            :rules="amapRules"
          >
            <n-form-item
              path="key"
              label="Key"
            >
              <n-input
                v-model:value="amapAuthCode.key"
                placeholder="请输入申请的应用Key"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item
              path="secret"
              label="安全密钥"
            >
              <n-input
                v-model:value="amapAuthCode.secret"
                type="password"
                placeholder="请输入申请的应用安全密钥"
                @keydown.enter.prevent
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>
        <n-tab-pane
          name="baidu"
          tab="百度地图"
        >
          TODO
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<style scoped lang="scss">
.map-auth-code-wrapper {

}
</style>
