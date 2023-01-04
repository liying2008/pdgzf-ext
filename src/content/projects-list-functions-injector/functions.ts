import type { ContentResp, ProjectProperty, ProjectPropertyValues } from '~/models'
import { CMD_SET_PPV, ContentMessage } from '~/models'

export function enable(projectProperties: ProjectProperty[], ppv: ProjectPropertyValues) {
  const listElem = isProjectsListPage()
  if (!listElem) {
    return
  }
  console.log(new Date(), listElem)

  injectCss()
  renderPPV(listElem as HTMLElement, projectProperties, ppv)
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
  headElem?.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${styleCssUrl}">`)
}

function renderPPV(listElem: HTMLElement, projectProperties: ProjectProperty[], ppv: ProjectPropertyValues) {
  // console.log('renderPPV', listElem)
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
        const ppvWrapper = wrapPPVElems(generatePPVElems(title, projectProperties, ppv))
        infoBlock!.appendChild(ppvWrapper)
      })
    } else if (retryCount >= 20) {
      clearInterval(timer)
      console.error('lis not found!')
    }
  }, 500)
}

function wrapPPVElems(ppvElems: Node[]) {
  const wrapper = document.createElement('div')
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
    nameElem.textContent = `${pp.name}：`

    const valueElem = document.createElement('span')
    const value = getValue(project, pp.id, ppv)
    setValue(valueElem, value)

    const buttonElem = document.createElement('button')
    buttonElem.classList.add('el-button', 'el-button--text', 'extra-edit-btn')
    buttonElem.innerHTML = '<span>编辑</span>'
    buttonElem.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault()
      editPPV(valueElem, project, pp, value)
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
  if (value === undefined) {
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

function editPPV(valueElem: HTMLElement, project: string, pp: ProjectProperty, oldValue?: string) {
  console.log(project, pp, oldValue)
  const newValue = prompt(`编辑 ${pp.name} （${pp.desc}）`, oldValue)
  console.log('newValue', newValue)
  if (newValue == null) {
    // 点击了“取消”
    return
  }

  setValue(valueElem, newValue)

  const newPPV = {
    [project]: {
      [pp.id]: newValue,
    },
  }
  console.log('newPPV', newPPV)
  browser.runtime.sendMessage(new ContentMessage(CMD_SET_PPV, newPPV)).then((resp: ContentResp<ProjectProperty[]>) => {
    if (resp.status !== 'ok') {
      console.log('保存失败')
      return
    }
    const newPPV = resp.data!
    console.log('newPPV', newPPV)
  })
}
