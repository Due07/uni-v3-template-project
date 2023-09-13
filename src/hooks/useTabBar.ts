import { judgmentType } from '@/common/base';
import { onShow } from '@dcloudio/uni-app';

export default () => {
  /** 矫正自定义tabBar 切换失效问题 */
  onShow(() => {
    const { globalData } = getApp();
    const [currentPage] = getCurrentPages<{getTabBar: Function}>();

    if (judgmentType(currentPage.getTabBar, 'Function') && currentPage.getTabBar()) {
      currentPage.getTabBar().setData({
        selected: globalData?.selectedBar ?? 0,
      });
    }
  });
};
