<template>
  <!-- 表格部分 -->
    <div class='tableContent'>
      <el-table :data='tableContent' :row-key="getRowKeys"
      style='width:100%'  :row-style='showTr' @select-all="handleSelectAll" @select='handleSelect' ref='myTable' border>
      	<el-table-column
          type="selection"
          :reserve-selection="true"
          width="55">
        </el-table-column>
        <el-table-column align='center' v-for='(item, index) in table.tableColumn' :key='item.indexName' :label='item.text'>
          <template slot-scope='scope'>
            <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" :key='levelIndex' class="table_trSpace"></span>
            <span class="table_toggleBtn" v-if="toggleIconShow(index, scope.row)" @click="showToggle(scope.$index)">
              <i v-if="!scope.row._expanded" class="el-icon-circle-plus-outline" aria-hidden="true"></i>
              <i v-if="scope.row._expanded" class="el-icon-remove-outline" aria-hidden="true"></i>
            </span>
            <!--<span v-else-if="index===0" class="table_trSpace"></span>-->
            <span>{{scope.row[item.indexName]}}</span>
          </template>
        </el-table-column>
        
      </el-table>
    </div>
</template>

<script>
import getData from '../../static/js/style.js'
export default {
  data () {
    return {
      table: {
        tableData: [
          {
            id: '001',
            name: '化学工程与工艺',
            totalScore: '54',
            totalNumber: 200,
            children: [
              {
                id: '001001',
                name: '物理化学',
                totalScore: '27',
                totalNumber: 200
              },
              {
                id: '001002',
                name: '有机化学',
                totalScore: '27',
                totalNumber: 200
              }
            ]
          },
          {
            id: '002',
            name: '计算机基础',
            totalScore: '54',
            totalNumber: 200,
            children: [
              {
                id: '002001',
                name: '计算机',
                totalScore: '27',
                totalNumber: 200
              },
              {
                id: '002002',
                name: '软件工程',
                totalScore: '7',
                totalNumber: 200
              },
              {
                id: '002003',
                name: '云计算',
                totalScore: '20',
                totalNumber: 200
              }
            ]
          },
          {
            id: '003',
            name: '机械自动化',
            totalScore: '54',
            totalNumber: 200,
            children: [
              {
                id: '003001',
                name: '机械设计基础',
                totalScore: '27',
                totalNumber: 200
              },
              {
                id: '003002',
                name: '自动化',
                totalScore: '7',
                totalNumber: 200,
                children: [
                  {
                    id: '00300201',
                    name: '自动化01',
                    totalScore: '20',
                    totalNumber: 200
                  },
                  {
                    id: '00300202',
                    name: '自动化02',
                    totalScore: '20',
                    totalNumber: 200
                  }
                ]
              },
              {
                id: '003003',
                name: 'CAD制图',
                totalScore: '20',
                totalNumber: 200
              }
            ]
          },
          {
            id: '004',
            name: '体育',
            totalScore: '20',
            totalNumber: 200
          },
          {
            id: '005',
            name: '高等数学',
            totalScore: '20',
            totalNumber: 200,
            children: [
              {
                id: '005001',
                name: '高等数学一',
                totalScore: '20',
                totalNumber: 200
              },
              {
                id: '005002',
                name: '高等数学二',
                totalScore: '20',
                totalNumber: 200
              },
            ]
          }
        ],
        tableColumn: [
          {
            text: '名称',
            indexName: 'id'
          },
          {
            text: '采集状态',
            indexName: 'name'
          },
          {
            text: '时间',
            indexName: 'totalScore'
          },
          {
            text: '操作',
            indexName: 'totalNumber'
          }
        ]
      },
      multipleSelection: '',
      tableContent: ''
    }
  },
  created () {
   this.getTableData()
  },
  methods: {
    // 为树形结构的数据添加相应的属性
    getTableData () {
      this.tableContent = getData.getTreeData (this.table.tableData, null, null, true)
    },
    getRowKeys (row) {
      return row.id
    },
    // 全选时
    handleSelectAll (val) {
      this.multipleSelection = val
    },
    // 有选项事件时
    handleSelect (val, row) {
      // 点击是选中时
      if (val.length && val.indexOf(row) !== -1) {
        // 当有父元素时，要求也选中
        if (row._parent) {
          this.selectParent(row._parent)
          this.$refs.myTable.toggleRowSelection(row._parent, true)
        }
        // 当有子元素时，子元素全选
        if (row.children) {
          row.children.forEach(val => {
            this.selectChild(val)
          })
        }
      // 点击是取消选择时
      } else {
        // 当有父元素时，需判断该父元素下的子元素是否选中，如果没有选中，则该父元素取消选中
        if (row._parent) {
          let count = 0
          row._parent.children.forEach(vals => {
            if (val.indexOf(vals) === -1) {
              count++
            }
          })
          if (count === row._parent.children.length) {
            this.$refs.myTable.toggleRowSelection(row._parent, false)
          }
          this.unSelectParent(val, row._parent)
        }
        // 当有子元素时，子元素取消选中
        if (row.children) {
          row.children.forEach(val => {
            this.unSelectChild(val)
          })
        }
      }
      this.multipleSelection = val
    },
    // 判断选中的选框是否有子菜单,有就全选
    selectChild (checkVal) {
      if (checkVal.children) {
        checkVal.children.forEach(val => {
          this.selectChild(val)
        })
      }
      this.$refs.myTable.toggleRowSelection(checkVal, true)
    },
    // 判断取消的选框是否有子菜单,有就取消选择
    unSelectChild (checkVal) {
      if (checkVal.children) {
        checkVal.children.forEach(val => {
          this.unSelectChild(val)
        })
      }
      this.$refs.myTable.toggleRowSelection(checkVal, false)
    },
    // 判断选中的选框是否有父菜单,有就选
    selectParent (parentRow) {
      if (parentRow._parent) {
        this.$refs.myTable.toggleRowSelection(parentRow._parent, true)
        this.selectParent(parentRow._parent)
      }
    },
    // 判断取消的选框是否有父菜单,有就判断该父菜单下有没有选中的子菜单，没有就取消选中
    unSelectParent (selectedVal, parentRow) {
      if (parentRow._parent) {
        let count = 0
        parentRow._parent.children.forEach(vals => {
          if (selectedVal.indexOf(vals) === -1) {
            count++
          }
        })
        if (count === parentRow._parent.children.length) {
          this.$refs.myTable.toggleRowSelection(parentRow._parent, false)
        }
        this.unSelectParent(selectedVal, parentRow._parent)
      }
    },
    // 显示行
    showTr (row, rowIndex) {
      let show = (row.row._parent ? (row.row._parent._expanded) : true)
      row._show = show
      return show ? '' : 'display:none;'
    },
    // 展开或收起下级
    showToggle (index) {
      let trs = this.tableContent[index]
      // 保证在父菜单收起时，子菜单全部都能够收起
      if (trs._expanded) {
        if (trs.children.length) {
          trs.children.forEach (evl => {
            if (evl._expanded) {
              evl._expanded = ! evl._expanded
            }
          })
        }
      }
      trs._expanded = !trs._expanded
    },
    // 显示层级关系的空格和图标
    spaceIconShow (index) {
      if (index === 0) {
        return true
      }
      return false
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow (index, record) {
      if (index === 0 && record.children && record.children.length > 0) {
        return true
      }
      return false
    }
  },
}
</script>
<style type="text/css">
.table_trSpace{
		padding-left: 40px;
	}
.el-table .cell {
		line-height: 25px;
}
.tableContent .el-table thead th{
	background: white;
}
</style>
