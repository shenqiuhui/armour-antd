# armour-antd

**基于 Ant Design 封装的定制化功能组件库。**

## 安装

**使用 npm 或者 yarn 安装：**

> $ npm install armour-antd --save

> $ yarn add armour-antd

**如果网络状况不佳可以使用 cnpm 安装。**

## 示例

```js
import { BatchOperationTables } from 'armour-antd';

ReactDOM.render(<BatchOperationTables/>, mountNode);
```

## 按需加载

**使用 [`babel-plugin-armour-import`](https://github.com/shenqiuhui/babel-plugin-armour-import) 插件, 在 `.babelrc` 或者 `webpack` 配置文件 `babel-loader` 配置项中进行配置。**

```js
plugins: [
  [
    'armour-import',
    { libararyName: 'armour-antd' }
  ]
]
```

**然后只需从 `armour-antd` 引入模块即可，无需单独引入样式，等同于下面手动引入的方式。**

```js
import { BatchOperationTables } from 'armour-antd';
```

**手动引入**

```js
import BatchOperationTables from 'armour-antd/dist/components/BatchOperationTables';
```

## 组件使用

### BatchOperationTables 组件

该组件用于帮助收集 `Ant Design` 的 `Table` 组件通过请求每页数据变化时，所有被勾选的数据，同时提供收集数据列表方便你进一步操作选中数据，并在页码切换渲染每页新数据时帮你回显已收集数据的勾选状态，处理收集数据列表操作和数据表格勾选操作时勾选状态的联动。

#### Example

- [单表格 Demo](https://codesandbox.io/s/xj66m00p5z)
- [双表格 Demo](https://codesandbox.io/s/m56qmr69yx)

#### API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 表格列的配置描述，同 `Ant Design` 的 `Table` , 具体见 https://ant.design/components/table-cn/#Column | ColumnProps[] | - |
| dataSource | 数据数组 | any[] | [] |
| rowId | `dataSource` 中每一项数据的唯一标识字段 | string | 'id' |
| selectedRows | 存储数据表格中被选中项，可以是父级组件的 `state` 或 `redux` 等状态管理的 `state` 中某一个属性的引用 | any[] | [] |
| total | 数据表格的数据总数，用于实现分页功能 | number | 0 |
| current | 分页器默认选中的页码 | number | 1 |
| pageSize | 数据表格默认每页数据条数 | number | 10 |
| collectTable | 是否展示已选中数据列表，如果显示，则 `columns` 配置第一项为序号配置，最后一项为操作配置 | boolean | false |
| showQuickJumper | 是否可以快速跳转至某页，该配置同时在数据表格和已选中数据列表生效 | boolean | false |
| showSizeChanger | 是否可以改变 `pageSize`，该配置同时在数据表格和已选中数据列表生效 | boolean | false |
| loading | 是否加载 `loading`，同 `Ant Design` 的 `Table` 中的 `loading`，该配置同时在数据表格和已选中数据列表生效 | boolean | false |
| pageSizeOptions | 指定每页可以显示多少条，该配置同时在数据表格和已选中数据列表生效 | string[] | ['10', '20', '30', '40', '50'] |
| updatePagination | 修改数据表格分页器页码 `current` 和每页条数 `pageSize` 时触发，提供当前选中页码数和每页条数 | Function(page, pageSize) | noop |
| ejectCollectData | 数据表格勾选状态发生变化时触发，提供所有页码被勾选后的数据合集 | Function(selectedRows) | noop |
| styleOptions | 用于配置 `BatchOperationTables` 组件的样式选项集合 | styleOptionsProps{} | - |
| textObtions | 用于配置 `BatchOperationTables` 组件的文本选项集合 | textObtions{} | - |

#### styleOptions

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| wrapperStyle | 组件容器的类名，用于设置组件容器的样式 | string | 'default-wrapper-class' |
| totalStyle | 组件数据总数信息的类名，用于设置组件数据总数信息样式 | string | 'default-total-class' |
| tableStyle | 组件表格容器类名，用于设置组件表格的样式 | string | 'default-table-class' |
| size | 表格大小，同 `Ant Design` 的 `Table` | default \| middle \| small | default |
| bordered | 是否展示外边框和列边框，同 `Ant Design` 的 `Table` | boolean | false |

#### textObtions

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dataEmptyText | 数据表格无数据提示文本 | string | '暂无数据' |
| collectEmptyText | 已选中数据列表无数据提示文本 | string | '暂无选中数据' |
| dataTotalText | 数据总数文本 | string[] | ['共', '项'] |
| collectTotalText | 已选中数据总数文本 | string[] | ['已选择', '项'] |
| sepText | 单表格（`collectTable` 未设置或值为 `false`）时，数据总数文本和已选中数据总数文本的分隔符，双表格时该配置不生效 | string | \&ensp; |
