import type { ProjectProperty, ProjectPropertyValues } from '~/models'

export function enable(projectProperties: ProjectProperty[], ppv: ProjectPropertyValues) {
  const listElem = isProjectsListPage()
  if (!listElem) {
    return
  }
  console.log(listElem)
}

function isProjectsListPage() {
  const selector = 'div.village-house-wrap ul.village-house-lists'
  const element = document.querySelector(selector)
  console.log('isProjectsListPage', element)
  return element
}
