<template>
  <div class="weektime">
    <div class="weektime-main">
      <div class="weektime-hd">
        <div class="weektime-hd-title">星期\时间</div>
        <div class="weektime-hd-con">
          <div class="weektime-hd-con-top">
            <div
              v-for="(range, index) in dateRanges"
              :key="index"
              class="weektime-date-range"
              :class="{ active: activeRangeIndex === index }"
              @click="selectRange(index)"
            >
              {{ range }}
            </div>
          </div>
        </div>
      </div>
      <div class="weektime-bd">
        <div class="week-body">
          <div v-for="w in weekDays" :key="w" class="week-item">{{ w }}</div>
        </div>
        <div class="time-body">
          <div
            v-for="(item, key) in weekTimes"
            :key="key"
            class="time-cell"
            :class="{
              'time-cell-active': isCellActive(key),
              'time-cell-selecting': isCellSelecting(key)
            }"
            @mousedown="handleMousedown(key)"
            @mouseup="mouseup(key)"
            @mousemove="mousemove(key)"
          >
            <span class="time-cell-tip">{{ tiptxt(key) }}</span>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="select-all-box">
          <div class="select-all">
            <div class="select-box">
              <div class="select un-select"></div>
              <span>未选</span>
            </div>
            <div class="select-box">
              <div class="select already-select"></div>
              <span>已选</span>
            </div>
          </div>
          <!-- <div class="select-time">{{ showSelectTime() }}</div> -->
        </div>
        <div class="clear-box">
          <span class="clear" @click="initList">清空选择</span>
        </div>
      </div>
    </div>
    <!-- <div class="weektime-help">
      <div class="weektime-help-tx">
        <div class="weektime-help-bd">
          <span class="color-box"></span>
          <span class="text-box">未选</span>
          <span class="color-box color-active"></span>
          <span class="text-box">已选</span>
        </div>
        <div class="weektime-help-ft" @click="initList()">清空选择</div>
      </div>
    </div> -->
    <div class="weektime-help-select">
      <p v-for="(week, key) in weekDays" :key="key" v-show="showTimeText[key]" class="weektime-help-select-item">
        <span class="weektime-help-week-tx">{{ week + '：' }}</span>
        <span>{{ showTimeText[key] }}</span>
      </p>
    </div>
  </div>
</template>

<script>
const DayTimes = 24 * 12; // 一天24小时，每小时12个5分钟
const week = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
const day = ["一", "二", "三", "四", "五", "六", "日"];
export default {
  name: "ByteWeektimePicker",
  props: {
    value: {
      type: [Array, String],
      default: () => new Array(7 * 24 * 12).fill(false),
    },
  },
  data() {
    return {
      weekDays: week,
      day,
      DayTimes: 48, // 每天显示48个格子 (4小时 * 12个/小时)
      weekTimes: 7 * 48, // 一周7天
      list: new Array(7 * 24 * 12).fill(false),
      isMouseDown: false,
      isSelect: false,
      startKey: -1, // 拖动选择的起始单元格索引
      endKey: -1, // 拖动选择的结束单元格索引
      dateRanges: [
        "00:00 - 04:00",
        "04:00 - 08:00",
        "08:00 - 12:00",
        "12:00 - 16:00",
        "16:00 - 20:00",
        "20:00 - 24:00",
      ],
      activeRangeIndex: -1, // 当前选择的时间段索引
    };
  },
  computed: {
    showTimeText() {
      const timeText = {};
      for (let i = 0; i < 7; i++) {
        let s = "";
        let flag = false;
        for (let j = 0; j < 24 * 12; j++) {
          const index = i * (24 * 12) + j;
          if (this.list[index]) {
            if (!flag) {
              flag = true;
              const h = Math.floor((j * 5) / 60)
                .toString()
                .padStart(2, "0");
              const m = ((j * 5) % 60).toString().padStart(2, "0");
              s += `${h}:${m}`;
            }
          } else {
            if (flag) {
              flag = false;
              const h = Math.floor((j * 5) / 60)
                .toString()
                .padStart(2, "0");
              const m = ((j * 5) % 60).toString().padStart(2, "0");
              s += `-${h}:${m}；`;
            }
          }
        }
        if (flag) {
          s += `-24:00；`;
        }
        timeText[i] = s;
      }
      return timeText;
    },
  },
  watch: {
    value: {
      handler(val) {
        if (typeof val === 'string') {
          this.list = val.split('').map(item => item === '1');
        } else {
          this.list = val;
        }
      },
      immediate: true,
    },
    list: {
      handler(val) {
        this.$emit("input", val);
      },
      deep: true,
    },
  },
  mounted() {
    this.initList();
  },
  methods: {
    // 清空选择
    initList() {
      this.list = new Array(7 * 24 * 12).fill(false);
      this.activeRangeIndex = 0;
    },
    // 选择时间段
    selectRange(index) {
      this.activeRangeIndex = index;
    },
    // 鼠标按下
    handleMousedown(key) {
      this.isMouseDown = true;
      this.startKey = key;
      this.endKey = key;

      const listIndex = this.getListIndex(key);
      this.isSelect = !this.list[listIndex];
    },
    // 鼠标抬起
    mouseup() {
      if (this.isMouseDown) {
        this.applySelection();
        this.isMouseDown = false;
        this.startKey = -1;
        this.endKey = -1;
      }
    },
    // 鼠标移动
    mousemove(key) {
      if (this.isMouseDown) {
        this.endKey = key;
      }
    },
    isCellActive(key) {
      const listIndex = this.getListIndex(key);
      if (this.isMouseDown && this.startKey !== -1 && this.endKey !== -1) {
        const { startRow, endRow, startCol, endCol } = this.getSelectionRect();
        const dayIndex = Math.floor(key / 48);
        const cellInDay = key % 48;
        if (dayIndex >= startRow && dayIndex <= endRow && cellInDay >= startCol && cellInDay <= endCol) {
          return this.isSelect;
        }
      }
      return this.list[listIndex];
    },
    isCellSelecting(key) {
      if (!this.isMouseDown) return false;
      const { startRow, endRow, startCol, endCol } = this.getSelectionRect();
      const dayIndex = Math.floor(key / 48);
      const cellInDay = key % 48;
      return dayIndex >= startRow && dayIndex <= endRow && cellInDay >= startCol && cellInDay <= endCol;
    },
    getListIndex(key) {
      const currentRangeIndex = this.activeRangeIndex === -1 ? 0 : this.activeRangeIndex;
      const dayIndex = Math.floor(key / 48);
      const cellInDay = key % 48;

      const rangeStartHour = currentRangeIndex * 4;
      const minuteOffset = cellInDay * 5;
      const totalMinutesInDay = rangeStartHour * 60 + minuteOffset;
      return dayIndex * (24 * 12) + Math.floor(totalMinutesInDay / 5);
    },
    getSelectionRect() {
      const startDay = Math.floor(this.startKey / 48);
      const startCell = this.startKey % 48;
      const endDay = Math.floor(this.endKey / 48);
      const endCell = this.endKey % 48;

      const startRow = Math.min(startDay, endDay);
      const endRow = Math.max(startDay, endDay);
      const startCol = Math.min(startCell, endCell);
      const endCol = Math.max(startCell, endCell);

      return { startRow, endRow, startCol, endCol };
    },
    applySelection() {
      const { startRow, endRow, startCol, endCol } = this.getSelectionRect();
      for (let day = startRow; day <= endRow; day++) {
        for (let cell = startCol; cell <= endCol; cell++) {
          const key = day * 48 + cell;
          const listIndex = this.getListIndex(key);
          this.$set(this.list, listIndex, this.isSelect);
        }
      }
    },
    // 提示文字
    tiptxt(key) {
      const currentRangeIndex = this.activeRangeIndex === -1 ? 0 : this.activeRangeIndex;
      const dayIndex = Math.floor(key / 48);
      const cellInDay = key % 48;

      const rangeStartHour = currentRangeIndex * 4;
      const startMinute = cellInDay * 5;

      const totalStartMinutes = rangeStartHour * 60 + startMinute;
      const totalEndMinutes = totalStartMinutes + 5;

      const format = (totalMinutes) => {
        const h = Math.floor(totalMinutes / 60)
          .toString()
          .padStart(2, "0");
        const m = (totalMinutes % 60).toString().padStart(2, "0");
        return `${h}:${m}`;
      };

      return `星期${day[dayIndex]} ${format(totalStartMinutes)}-${format(totalEndMinutes)}`;
    },
    // 显示已选择时间
    showSelectTime() {
      let str = "";
      for (let i = 0; i < 7; i++) {
        let flag = false;
        let s = "";
        for (let j = 0; j < 24 * 12; j++) {
          const index = i * (24 * 12) + j;
          if (this.list[index]) {
            if (!flag) {
              flag = true;
              const h = Math.floor((j * 5) / 60)
                .toString()
                .padStart(2, "0");
              const m = ((j * 5) % 60).toString().padStart(2, "0");
              s += `星期${day[i]} ${h}:${m}`;
            }
          } else {
            if (flag) {
              flag = false;
              const h = Math.floor((j * 5) / 60)
                .toString()
                .padStart(2, "0");
              const m = ((j * 5) % 60).toString().padStart(2, "0");
              s += `-${h}:${m}；`;
            }
          }
        }
        if (flag) {
          s += `-24:00；`;
        }
        str += s;
      }
      return str;
    },
  },
};
</script>

<style lang="scss" scoped>
.weektime {
  width: 100%;
  border: 1px solid #ccc;
  user-select: none;
}
.weektime-main {
  /* flex: 1; */
}
.weektime-hd {
  display: flex;
  height: 60px;
  border-bottom: 1px solid #ccc;
}
.weektime-hd-title {
  width: 80px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  border-right: 1px solid #ccc;
  box-sizing: border-box;
}
.weektime-hd-con {
  flex: 1;
}
.weektime-hd-con-top {
  height: 60px; /* 调整高度以容纳两行 */
  line-height: 30px;
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  text-align: center;
}
.weektime-date-range {
  flex: 1 1 33.33%; /* 每个元素占据大约三分之一的宽度 */
  cursor: pointer;
  box-sizing: border-box;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc; // Add bottom border to each range
  &:nth-child(3n) {
    border-right: none;
  }
  &:nth-child(n + 4) {
    border-bottom: none; // Remove bottom border for the second row
  }
}
.weektime-date-range.active {
  background-color: #409eff;
  color: white;
}
.weektime-bd {
  display: flex;
  height: 210px; // 7 rows * 30px/row
}
.week-body {
  width: 80px;
  border-right: 1px solid #ccc;
  box-sizing: border-box;
}
.week-item {
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  &:last-child {
    border-bottom: none;
  }
}
.time-body {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}
.time-cell {
  width: calc(100% / 48);
  height: 30px;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
  cursor: pointer;
  position: relative;
  &:hover {
    .time-cell-tip {
      display: block;
    }
  }
}
.time-cell-active {
  background: #409eff;
}
.time-cell-selecting {
  background: #79bbff;
}
.time-cell-tip {
  display: none;
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: #303133;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
}
.select-all-box {
  display: flex;
  align-items: center;
}
.select-all {
  display: flex;
}
.select-box {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.select {
  width: 15px;
  height: 15px;
  border: 1px solid #ccc;
  margin-right: 5px;
}
.un-select {
  background: #fff;
}
.already-select {
  background: #409eff;
}
.select-time {
  font-size: 12px;
  color: #999;
}
.clear-box {
  cursor: pointer;
  color: #409eff;
}
.weektime-help-select {
  padding: 10px;
}
.weektime-help-select-item {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}
.weektime-help-week-tx {
  font-weight: bold;
}
</style>