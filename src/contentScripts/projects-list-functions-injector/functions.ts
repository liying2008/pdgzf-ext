import { KEY_PPV, KEY_PROJECT_PROPERTIES } from '../common'
import type { ContentResp, ProjectProperty, ProjectPropertyValues } from '~/models'
import { CMD_SET_PPV, ContentMessage } from '~/models'

export function enable(projectProperties: ProjectProperty[], ppv: ProjectPropertyValues) {
  const listElem = isProjectsListPage()
  if (!listElem) {
    return
  }
  console.log(new Date(), listElem)

  injectCss()

  sessionStorage.setItem(KEY_PROJECT_PROPERTIES, JSON.stringify(projectProperties))
  sessionStorage.setItem(KEY_PPV, JSON.stringify(ppv))

  renderPPV(listElem)
}

function isProjectsListPage() {
  const selector = 'div.village-house-wrap ul.village-house-lists'
  const element = document.querySelector(selector)
  console.log('isProjectsListPage', element)
  return element
}

function injectCss() {
  const headElem = document.querySelector('head')
  const styleCssUrl = browser.runtime.getURL('css/style.css')
  const existLink = headElem?.querySelector(`link[href="${styleCssUrl}"]`)
  if (!existLink) {
    headElem?.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${styleCssUrl}">`)
  }
}

function renderPPV(listElem: Element) {
  // console.log('renderPPV', listElem)
  const projectProperties = JSON.parse(sessionStorage.getItem(KEY_PROJECT_PROPERTIES) || '[]')
  const ppv = JSON.parse(sessionStorage.getItem(KEY_PPV) || '{}')

  let retryCount = 0
  const timer = setInterval(() => {
    retryCount++
    const lis = listElem.querySelectorAll('li')
    console.log(lis)
    if (lis.length > 0) {
      clearInterval(timer)
      lis.forEach((elem) => {
        const infoBlock = elem.querySelector('div.marL30')
        const title = infoBlock!.querySelector('h4')?.textContent || ''
        // 获取小区名
        const projectName = title.split('/')[0]
        const oldWrapper = infoBlock!.querySelector('div.extra-ppv-wrapper')
        const ppvWrapper = wrapPPVElems(generatePPVElems(projectName, projectProperties, ppv), oldWrapper)
        infoBlock!.appendChild(ppvWrapper)
      })
    } else if (retryCount >= 20) {
      clearInterval(timer)
      console.error('lis not found!')
    }
  }, 500)
}

function wrapPPVElems(ppvElems: Node[], wrapper: Element | null) {
  if (wrapper) {
    wrapper.innerHTML = ''
  } else {
    wrapper = document.createElement('div')
    wrapper.className = 'extra-ppv-wrapper'
  }

  wrapper.append(...ppvElems)
  wrapper.addEventListener('click', (e) => {
    e.preventDefault()
  })
  return wrapper
}

function generatePPVElems(project: string, projectProperties: ProjectProperty[], ppv: ProjectPropertyValues) {
  const elems: Node[] = []
  const len = projectProperties.length
  for (let i = 0; i < len; i++) {
    const pp = projectProperties[i]

    const nameElem = document.createElement('span')
    nameElem.classList.add('bold')
    nameElem.title = pp.desc
    nameElem.textContent = `${pp.name}：`

    const valueElem = document.createElement('span')
    const value = getValue(project, pp.id, ppv)
    setValue(valueElem, value)

    const buttonElem = document.createElement('button')
    buttonElem.classList.add('el-button', 'el-button--text', 'extra-edit-btn')
    buttonElem.innerHTML = '<span>编辑</span>'
    buttonElem.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault()
      editPPV(project, pp, value)
    })

    const pElem = document.createElement('p')
    pElem.classList.add('c-6', 'marT10', 'extra-p-w')
    pElem.append(nameElem, valueElem, buttonElem)

    elems.push(pElem)
  }

  return elems
}


function setValue(valueElem: HTMLElement, value?: string) {
  valueElem.classList.remove('extra-no-value', 'extra-value')
  if (value === undefined || value === '') {
    valueElem.classList.add('extra-no-value')
  } else {
    valueElem.classList.add('extra-value')
  }
  valueElem.textContent = value || '<空>'
}

function getValue(project: string, property: string, ppv: ProjectPropertyValues) {
  if (project in ppv && property in ppv[project]) {
    return ppv[project][property]
  } else {
    return undefined
  }
}

function editPPV(project: string, pp: ProjectProperty, oldValue?: string) {
  console.log(project, pp, oldValue)
  // eslint-disable-next-line no-alert
  const newValue = prompt(`编辑 ${pp.name} （${pp.desc}）`, oldValue)
  console.log('newValue', newValue)
  if (newValue == null) {
    // 点击了“取消”
    return
  }

  const newPPV = {
    [project]: {
      [pp.id]: newValue,
    },
  }
  console.log('newPPV', newPPV)
  browser.runtime.sendMessage(new ContentMessage(CMD_SET_PPV, newPPV)).then((resp: ContentResp<ProjectProperty[]>) => {
    if (resp.status !== 'ok') {
      console.log('保存失败')
      // eslint-disable-next-line no-alert
      alert('保存失败')
      return
    }
    const newPPV = resp.data!
    console.log('newPPV', newPPV)
    const listElem = isProjectsListPage()
    if (!listElem) {
      return
    }
    sessionStorage.setItem(KEY_PPV, JSON.stringify(newPPV))
    renderPPV(listElem)
  })
}
