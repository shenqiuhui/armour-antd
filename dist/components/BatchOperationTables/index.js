"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.array.sort");

var _react = _interopRequireWildcard(require("react"));

var _antd = require("antd");

require("antd/lib/table/style/css");

require("./index.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BatchOperationTables extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      selectedRowsMap: {},
      // 选中数据集合
      selectedRowKeys: [],
      // 选中数据在当前页索引集合
      pageSizeCollect: 10 // 选中数据默认条数

      /**
       * 给传入的 dataSourse 增加 key 属性
       * @param {Array<Object>} [dataSource] 数据源
       */

    });

    _defineProperty(this, "addKeyToDateSourse", dataSource => dataSource.map((val, i) => (val.key = i, val)));

    _defineProperty(this, "selectedRowsToArray", selectedRows => selectedRows.reduce((prev, next, current) => {
      let item = JSON.parse(JSON.stringify(next));
      item.key = current + 1;
      return prev.push(item), prev;
    }, []));

    _defineProperty(this, "selectedMapToArray", selectedRowsMap => Object.keys(selectedRowsMap).reduce((target, rowId) => {
      return selectedRowsMap[rowId].selected && target.push(selectedRowsMap[rowId].record), target;
    }, []).sort((a, b) => b.orderMark - a.orderMark));

    _defineProperty(this, "selectedArrayToMap", (rowId, selected, source, target = {}) => {
      return source.forEach(value => target[value[rowId]] = {
        [rowId]: value[rowId],
        record: value,
        selected
      }), target;
    });

    _defineProperty(this, "findSelectedRowKeys", (rowId, dataSource, selectedRowsMap) => dataSource.reduce((prev, next, index) => {
      return selectedRowsMap[next[rowId]] && selectedRowsMap[next[rowId]].selected && prev.push(index), prev;
    }, []));

    _defineProperty(this, "createOrderMark", source => {
      let selectedNum = this.selectedMapToArray(this.state.selectedRowsMap).length;
      let newSelectRows = Array.isArray(source) ? source : [source];
      return newSelectRows.reverse().forEach((v, idx) => v.orderMark = idx + selectedNum), newSelectRows;
    });

    _defineProperty(this, "sendDataOutComponent", (rowId, selected, source, callback) => {
      this.setState({
        selectedRowsMap: _objectSpread({}, this.state.selectedRowsMap, this.selectedArrayToMap(rowId, selected, this.createOrderMark(source)))
      }, callback);
    });

    _defineProperty(this, "initSelectedRowMapAndKeys", props => {
      let {
        dataSource = [],
        selectedRows = [],
        rowId = 'id'
      } = props; // 计算 Map 和选中项索引集合存入 state

      let selectedRowsMap = this.selectedArrayToMap(rowId, true, selectedRows);
      let selectedRowKeys = this.findSelectedRowKeys(rowId, dataSource, selectedRowsMap);
      this.setState({
        selectedRowsMap,
        selectedRowKeys
      });
    });
  }

  // 第一次挂载初始化（将合集数组转换 Map，计算当前选中项索引集合）
  componentDidMount() {
    this.initSelectedRowMapAndKeys(this.props);
  } // 每次更新变化时初始化（将合集数组转换 Map，计算当前选中项索引集合）


  componentWillReceiveProps(nextProps) {
    this.initSelectedRowMapAndKeys(nextProps);
  }

  render() {
    const {
      selectedRowKeys,
      pageSizeCollect
    } = this.state;
    const {
      rowId = 'id',
      columns = [],
      // 表格规则，遵循 antd（数组）
      dataSource = [],
      // 数据源（数组）
      selectedRows = [],
      // 选中的数据（数组）
      total = 0,
      // 数据总数（含未请求）
      current = 1,
      // 当前页码，默认为第 1 页，有可能后端数据的页码参数不是从 1 开始，而是从 0 开始，也可能是每一页数据的 start 值，所以需要这个参数来设置页码，表格组件只接受从 1 到 n 的也码数，可在外面自行计算
      pageSize = 10,
      // 每页数据条数，默认 10 条
      loading = false,
      // 是否加载 loading
      showQuickJumper = false,
      // 是否增加快速跳转页码
      showSizeChanger = false,
      // 是否增加改变每页条数
      collectTable = false,
      // 是否显示收集的表格
      pageSizeOptions = ['10', '20', '30', '40', '50'],
      // 表格默认支持分页选项
      styleOptions = {},
      // 样式选项
      textObtions = {},
      // 文本选项
      updatePagination,
      // 更新页码函数
      ejectCollectData // 将目标表格收集的数据合集（selectedRows）更新到外层组件或 Redux 的方法

    } = this.props;
    const {
      wrapperStyle = 'default-wrapper-class',
      // 容器样式的类名
      tableStyle = 'default-table-class',
      // 表格样式的类名
      totalStyle = 'default-total-class',
      // 数量信息样式的类名
      size = 'default',
      // 表格大小，可选 small、middle
      bordered = false // 是否有边框

    } = styleOptions;
    const {
      dataEmptyText = '暂无数据',
      // 数据表格无数据提示文本
      collectEmptyText = '暂无选中数据',
      // 收集数据表格无选中提示文本
      dataTotalText = ['共', '项'],
      // 数据总数文本
      collectTotalText = ['已选择', '项'],
      // 已选中数据总数文本
      sepText = '' // 单表格时数据总数文本和已选中数据总数文本分隔符，默认为一个制表符

    } = textObtions; // 复选框操作配置

    const rowSelection = {
      selectedRowKeys,
      onSelect: (record, selected) => this.sendDataOutComponent(rowId, selected, record, () => {
        ejectCollectData && ejectCollectData(this.selectedMapToArray(this.state.selectedRowsMap));
      }),
      onSelectAll: (selected, selectedRows, changeRows) => this.sendDataOutComponent(rowId, selected, changeRows, () => {
        ejectCollectData && ejectCollectData(this.selectedMapToArray(this.state.selectedRowsMap));
      })
    }; // 未搜索到数据提示

    const noData = {
      emptyText: dataEmptyText
    }; // 选中数据为空提示

    const noCollect = {
      emptyText: collectEmptyText
    }; // 分页器配置

    const pagination = {
      pageSize,
      current,
      total,
      showQuickJumper,
      showSizeChanger,
      pageSizeOptions,
      onChange: (current, pageSize) => updatePagination && updatePagination(current, pageSize),
      onShowSizeChange: (current, pageSize) => updatePagination && updatePagination(current, pageSize)
    };
    const paginationCollect = {
      pageSize: pageSizeCollect,
      showQuickJumper,
      showSizeChanger,
      onShowSizeChange: (current, pageSizeCollect) => this.setState({
        pageSizeCollect
      })
    }; // 将合集数据源处理并渲染（处理 key）

    const selectedRowsList = collectTable && this.selectedRowsToArray(selectedRows);
    return _react.default.createElement("div", {
      className: wrapperStyle
    }, _react.default.createElement("div", null, _react.default.createElement("div", {
      className: totalStyle
    }, _react.default.createElement("span", null, dataTotalText[0], " ", total, " ", dataTotalText[1]), !collectTable && _react.default.createElement(_react.Fragment, null, sepText ? _react.default.createElement("span", null, sepText) : _react.default.createElement("span", null, "\u2002"), _react.default.createElement("span", null, collectTotalText[0], " ", selectedRows.length, " ", collectTotalText[1]))), _react.default.createElement(_antd.Table, {
      className: tableStyle,
      bordered: bordered,
      size: size,
      rowSelection: rowSelection,
      columns: collectTable ? columns.slice(1, -1) : columns,
      pagination: pagination,
      dataSource: this.addKeyToDateSourse(dataSource),
      locale: noData,
      loading: loading
    })), dataSource.length > 0 && collectTable && _react.default.createElement("div", null, _react.default.createElement("div", {
      className: totalStyle
    }, collectTotalText[0], " ", selectedRowsList.length, " ", collectTotalText[1]), _react.default.createElement(_antd.Table, {
      className: tableStyle,
      bordered: bordered,
      size: size,
      columns: columns,
      pagination: paginationCollect,
      dataSource: selectedRowsList,
      locale: noCollect
    })));
  }

}

exports.default = BatchOperationTables;