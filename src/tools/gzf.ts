export function getHouseType(typeName: number): string {
  switch (typeName) {
    case 1: return '一室'
    case 2: return '一室一厅'
    case 3: return '两室'
    case 4: return '两室一厅'
    case 5: return '三室'
    case 6: return '三室一厅'
    case 7: return '四室'
    case 8: return '五室'
    default: return '未知'
  }
}
