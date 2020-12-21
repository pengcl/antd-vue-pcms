<template>
  <page-header-wrapper>
    <a-card :bordered="false" :loading="loading" :style="{ height: '100%' }">
      <div class="table-page-search-wrapper">
        <a-form-model
          ref="form"
          :model="form"
          :rules="rules"
          layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-model-item label="部门" prop="OrgGID">
                <a-tree-select
                  style="width: 100%"
                  :tree-data="dps"
                  :dropdown-style="{ maxHeight: '400px', overflowH: 'auto' }"
                  search-placeholder="请选择"
                  v-model="form.OrgGID"
                  @select="dpSelect"
                  :suffixIcon="dps ? '' : '加载中...'">
                </a-tree-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-model-item label="角色" prop="roleId">
                <a-select @change="roleSelect" v-model="form.roleId">
                  <a-select-option v-for="option in posts" :value="option.roleId" :key="option.roleId">{{
                    option.roleName
                  }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <a-row :gutter="24">
        <a-col :md="24">
          <h4>项目</h4>
          <a-tree
            checkable
            v-model="checkedKeys"
            :auto-expand-parent="true"
            :selected-keys="selectedKeys"
            :tree-data="cities"
            @expand="onExpand"
            @select="onSelect"
          />
        </a-col>
      </a-row>
      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          <a-button-group v-if=" ac('EDIT')">
            <a-button @click="save" type="success">
              储存
            </a-button>
          </a-button-group>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import { baseMixin } from '@/store/app-mixin'
  import { ProjectRolesService } from '@/views/role/project/projectRoles.service'
  import { formatTree } from '@/utils/util'
  import TagSelectOption from '@/components/TagSelect/TagSelectOption'
  import { ProjectService } from '@/views/project/project.service'
  import { acs, ac } from '@/views/user/user.service'
  import { SupplierService } from '@/views/supplier/supplier.service'

  const formatList = (items, option) => {
    const list = []
    items.forEach(item => {
      if (item.childs) {
        item.children = formatList(item.childs.items)
      } else {
        item.children = null
      }
      if (option) {
        item[option.key] = option.value
      }
      item.title = item.projectName
      item.key = item.projectGUID
      list.push(item)
    })
    return list
  }

  export default {
    name: 'ProjectRoles',
    mixins: [baseMixin],
    components: { TagSelectOption },
    data () {
      return {
        form: {
          OrgGID: '',
          roleId: '',
          projectGUIDList: []
        },
        mdl: {},
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        cities: [],
        dps: null,
        posts: null,
        OrgGID: '',
        loading: true,
        permissions: [],
        rules: {
          OrgGID: [
            { required: true, message: '请输入项目名称(中文)', trigger: 'change' }
          ],
          roleId: [{ required: true, message: '请选择招投标分判包', trigger: 'change' }]
        }
      }
    },
    watch: {
      checkedKeys (val) {
        console.log('onCheck', val)
      }
    },
    created () {
      console.log(acs(this.$route))
      ProjectRolesService.dps('').then(res => {
        const dps = formatTree([res.result.data], ['title:orgName', 'value:orgGID'])
        this.dps = dps
      })
      ProjectService.all().then(res => {
        this.loading = false
        const cities = []
        res.result.data.citys.forEach(item => {
          const children = formatList(item.projects.items, { key: 'type', value: 'project' })
          cities.push({
            selectable: false,
            title: item.city.nameCN,
            key: item.city.id,
            children: children
          })
        })
        this.cities = cities
        this.$forceUpdate()
      })
    },
    methods: {
      ac (action) {
        return ac(action, this.$route)
      },
      callback (val) {
        console.log(val)
      },

      onChangeCheck (permission) {
        permission.indeterminate = !!permission.selected.length && (permission.selected.length < permission.actionsOptions.length)
        permission.checkedAll = permission.selected.length === permission.actionsOptions.length
      },
      onChangeCheckAll (e, permission) {
        Object.assign(permission, {
          selected: e.target.checked ? permission.actionsOptions.map(obj => obj.value) : [],
          indeterminate: false,
          checkedAll: e.target.checked
        })
      },
      onExpand (expandedKeys) {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      onCheck (checkedKeys) {
        this.checkedKeys = checkedKeys
      },
      onSelect (selectedKeys, info) {
        this.selectedKeys = selectedKeys
      },
      dpSelect (e) {
        ProjectRolesService.posts(e).then(res => {
          this.posts = res.result.data
        })
      },
      roleSelect (e) {
         ProjectRolesService.items(e).then(res => {
          this.checkedKeys = res.result.data.projectGUIDList
          this.$forceUpdate()
        })
      },
      save () {
        this.$refs.form.validate(valid => {
          if (valid) {
            const keys = []
            this.checkedKeys.forEach(key => {
              if (typeof key !== 'number') {
                keys.push(key)
              }
            })
            this.form.projectGUIDList = keys
            ProjectRolesService.save(this.form).then(res => {
              if (res.result.statusCode === 200) {
                this.$message.success('保存成功')
              }else {
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
</style>
