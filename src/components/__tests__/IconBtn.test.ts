import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import IconBtn from '../IconBtn.vue'

describe('IconBtn Component', () => {
  it('should render', () => {
    const wrapper = mount(IconBtn)

    expect(wrapper.html()).toBeTruthy()
  })
})
