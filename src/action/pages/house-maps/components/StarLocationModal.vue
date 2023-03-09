<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useEditableProp } from '~/compositions/useEditableProp'
import type { MapLocation } from '~/models/map-location'
import { StorageService } from '~/libs/storage'
import type { Options } from '~/models/options'

const props = defineProps<{
  show: boolean
  location: MapLocation
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'addStarLocation', location: MapLocation): void
}>()

const message = useMessage()
const editableVisible = useEditableProp(() => props.show, (newVal) => {
  !newVal && emit('close')
})
const editableLocation = useEditableProp(() => props.location)

watch(editableVisible, (newVal: boolean) => {
  if (newVal) {
    // modal dialog 打开时，清空表单数据，重置表单验证状态
    formRef.value?.restoreValidation()
  }
})

watch(() => props.location, (newVal) => {
  editableLocation.value = newVal
})

const formRef = ref<FormInst>()

const rules: FormRules = {
  name: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          // 不能为空
          return new Error('名称不能为空')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
}

async function submit() {
  try {
    await formRef.value!.validate(async (errors) => {
      if (!errors) {
        let options: Options
        try {
          options = await StorageService.getOptions()
        } catch (e) {
          console.log(e)
          message.error(`收藏失败：${e}`)
          return
        }
        const starLocations = options.starLocations
        starLocations.push(editableLocation.value)
        StorageService.savePartialOptions({
          starLocations,
        }).then(() => {
          message.success('收藏成功')
          emit('addStarLocation', editableLocation.value)
          emit('close')
        }).catch((e) => {
          message.error(`收藏失败：${e.message}`)
        })
      } else {
        console.log(errors)
        message.error(`表单验证失败：${errors}`)
      }
    })
    return true
  } catch (e: unknown) {
    console.log('validate error', e)
    return false
  }
}

function cancel() {
  emit('close')
}
</script>

<template>
  <n-modal
    v-model:show="editableVisible"
    class="star-location-modal"
    preset="dialog"
    title="收藏地点"
    style="width: 600px;"
    type="info"
    @positive-click="submit"
    @negative-click="cancel"
  >
    <n-form
      ref="formRef"
      :label-width="80"
      :model="editableLocation"
      :rules="rules"
    >
      <n-form-item
        label="名称"
        path="name"
      >
        <n-input
          v-model:value="editableLocation.name"
          placeholder="请输入收藏地点名称"
        />
      </n-form-item>
      <n-form-item
        label="描述"
        path="description"
      >
        <n-input
          v-model:value="editableLocation.description"
          placeholder="请输入收藏地点描述"
        />
      </n-form-item>
      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div style="display: flex; justify-content: flex-end;">
            <n-button
              :disabled="!editableLocation.name"
              type="primary"
              @click="submit"
            >
              提交
            </n-button>
          </div>
        </n-col>
      </n-row>
    </n-form>
  </n-modal>
</template>

<style lang="scss">
.star-location-modal {
}
</style>
