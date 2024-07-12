import { createSSRApp } from 'vue';
import uViewPlus from 'uview-plus';
import store from './store';
import jsConfig from '@/common/config';
import App from './App.vue';
import '@/assets/styles/index.scss';

const updateManager = uni.getUpdateManager();

updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调
  console.log('是否需要更新', res.hasUpdate);
});

updateManager.onUpdateReady(function () {
  uni.showModal({
    title: '更新提示',
    content: '新版本已经准备好，是否重启应用？',
    success(res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate();
      }
    }
  });
});

updateManager.onUpdateFailed(function (res) {
  // 新的版本下载失败
  console.error(res);
});

Object.assign(uni, jsConfig);

export function createApp() {
  const app = createSSRApp(App);
  app.use(store).use(uViewPlus);
  uni.$u.setConfig({
    config: { unit: 'rpx' },
  });

  return { app };
}
