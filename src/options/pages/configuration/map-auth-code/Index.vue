<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { MapAuthCode } from '~/models'
import { StorageService } from '~/libs/storage'

const message = useMessage()

const amapAuthCode = ref(new MapAuthCode())
const amapFormRef = ref<FormInst | null>(null)
const amapRules: FormRules = {
}

const baiduAuthCode = ref(new MapAuthCode())
const baiduFormRef = ref<FormInst | null>(null)
const baiduRules: FormRules = {
}

const loading = ref(false)

onMounted(() => {
  initialize()
})

function initialize() {
  StorageService.getOptions().then((options) => {
    // console.log('options', options)
    amapAuthCode.value = options.mapAuthCode.amap
    baiduAuthCode.value = options.mapAuthCode.baidu
  })
}

function save() {
  loading.value = true
  StorageService.savePartialOptions({
    mapAuthCode: {
      amap: amapAuthCode.value,
      baidu: baiduAuthCode.value,
    },
  }).then(() => {
    message.success('保存成功')
  }).catch((e) => {
    message.error(`保存失败：${e.message}`)
  }).finally(() => {
    loading.value = false
  })
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
            :loading="loading"
            @click="save"
          >
            保存
          </n-button>
        </div>
      </template>
      <n-tabs
        default-value="amap"
        size="small"
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
                show-password-on="click"
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
          <n-form
            ref="baiduFormRef"
            size="small"
            :model="baiduAuthCode"
            :rules="baiduRules"
          >
            <n-form-item
              path="key"
              label="AK"
            >
              <n-input
                v-model:value="baiduAuthCode.key"
                placeholder="请输入申请的AK"
                @keydown.enter.prevent
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<style scoped lang="scss">
.map-auth-code-wrapper {

}
</style>
