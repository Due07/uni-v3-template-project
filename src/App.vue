<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useSystemStore } from './store/state/system';

onLaunch(() => {
  console.log('App Launch');

  // wx 添加finally函数
  Promise.prototype.finally = function(callback: any){
    return this.then(
      (value) => Promise.resolve(callback()).then(() => value),
      (rej) => Promise.resolve(callback()).then(() => rej),
    );
  };
  console.log('%c ENV ', 'background: #aaa; color: #bada55', import.meta.env.MODE);
  // 系统配置刘海高度
  const systemStore = useSystemStore();
  systemStore.setStatusBarHeight();

});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>
<style lang="scss">
@import 'uview-plus/index.scss';
</style>
