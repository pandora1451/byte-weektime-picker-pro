import ByteWeektimePicker from './components/ByteWeektimePicker.vue';

// 为组件提供 install 安装方法，供按需引入
ByteWeektimePicker.install = function (Vue) {
  Vue.component(ByteWeektimePicker.name, ByteWeektimePicker);
};

// 默认导出组件
export default ByteWeektimePicker;