import type { ProjectProperty, ProjectPropertyValues } from '~/models'

export function enable(projectProperties: ProjectProperty[], ppv: ProjectPropertyValues) {
  const listElem = isProjectsListPage()
  if (!listElem) {
    return
  }
  console.log(listElem)
  renderPPV(listElem as HTMLElement, projectProperties, ppv)
}

function isProjectsListPage() {
  const selector = 'div.village-house-wrap ul.village-house-lists'
  const element = document.querySelector(selector)
  console.log('isProjectsListPage', element)
  return element
}

function renderPPV(listElem: HTMLElement, projectProperties: ProjectProperty[], ppv: ProjectPropertyValues) {
  const lis = listElem.querySelectorAll('li')
  lis.forEach((elem) => {
    const infoBlock = elem.querySelector('div.marL30')
    const title = infoBlock?.querySelector('h4')?.textContent || ''
    infoBlock?.append(...generatePPVElems(title, projectProperties, ppv))
  })
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
    valueElem.classList.add('c-7')
    valueElem.textContent = getValue(project, pp.id, ppv) || '<未知>'

    const pElem = document.createElement('p')
    pElem.classList.add('c-6', 'marT10', 'extra-p')
    pElem.append(nameElem, valueElem)

    elems.push(pElem)
  }

  return elems
}


function getValue(project: string, property: string, ppv: ProjectPropertyValues) {
  if (project in ppv && property in ppv[project]) {
    return ppv[project][property]
  } else {
    return undefined
  }
}
