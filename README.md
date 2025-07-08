# byte-weektime-picker-pro

> 在byte-weektime-picker基础上，进行改版，将时间细化到5分钟。

> Based on byte-weektime-picker, this version refines the time selection to 5-minute intervals.

## Installation

> Note: This package is not yet published to npm. Please install it directly from GitHub.
> 注意：此包尚未发布到 npm。请直接从 GitHub 安装。

```bash
npm install pandora1451/byte-weektime-picker-pro
```
## Usage
### 全局引入 (Global import)
```html
import Vue from 'vue';
import ByteWeektimePickerPro from 'byte-weektime-picker-pro';

Vue.use(ByteWeektimePickerPro);
```
### 局部引入 (Local import)
```html
import { ByteWeektimePickerPro } from 'byte-weektime-picker-pro';

export default {
  components: {
    ByteWeektimePickerPro
  }
}
```
### 在模板中使用 (Usage in template)
```html
<template>
  <div>
    <byte-weektime-picker-pro v-model="selectedTime" />
  </div>
</template>

<script>
import { ByteWeektimePickerPro } from 'byte-weektime-picker-pro';

export default {
  components: {
    ByteWeektimePickerPro
  },
  data() {
    return {
      selectedTime: ''
    };
  }
}
</script>
```
