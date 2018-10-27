import Vue from 'vue'
// 为树形结构的数据添加相应的属性
function DataTransfer (data) {
  if (!(this instanceof DataTransfer)) {
    return new DataTransfer(data, null, null)
  }
}
DataTransfer.getTreeData = function (data, parent, level, expandedAll) {
  let arrayExam = []
  Array.from(data).forEach(function (record) {
    if (record._expanded === undefined) {
      Vue.set(record, '_expanded', expandedAll)
    }
    if (parent) {
      Vue.set(record, '_parent', parent)
    }
    let _level = 0
    if (level !== undefined && level !== null) {
      _level = level + 1
    }
    Vue.set(record, '_level', _level)
    arrayExam.push(record)
    if (record.children && record.children.length > 0) {
      let children = DataTransfer.getTreeData(record.children, record, _level, expandedAll)
      arrayExam = arrayExam.concat(children)
    }
  })
  return arrayExam
}

export default DataTransfer
