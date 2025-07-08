<template>
  <div id="app">
    <byte-weektime-picker-pro v-model="time" />
  </div>
</template>

<script>
import ByteWeektimePickerPro from './components/ByteWeektimePicker.vue'

export default {
  name: 'App',
  components: {
    ByteWeektimePickerPro
  },
  data() {
    return {
      time: ''
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>