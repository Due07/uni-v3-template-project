/* eslint-disable */
const app = getApp();
Component({
  // options: {
  //   styleIsolation: 'shared',
  // },
  data: {
    selected: app.globalData?.selectedBar ?? 0,
    color: '#7A7E83',
    selectedColor: '#3cc51f',
    list: [
      {
        'name': 'test1',
        'pagePath': '/pages/tabBar/test1',
        userauth: false,
        // 'iconPath': '../static/image/tabBar/welfare.png',
        // 'selectedIconPath': '../static/image/tabBar/welfare-select.png'
        'text': 'test1'
      },
      {
        'name': 'test2',
        'pagePath': '/pages/tabBar/test2',
        userauth: false,
        // 'iconPath': '../static/image/tabBar/welfare.png',
        // 'selectedIconPath': '../static/image/tabBar/welfare-select.png'
        'text': 'test2'
      },
      {
        'name': 'test3',
        'pagePath': '/pages/tabBar/test3',
        userauth: false,
        // 'iconPath': '../static/image/tabBar/welfare.png',
        // 'selectedIconPath': '../static/image/tabBar/welfare-select.png'
        'text': 'test3'
      },
    ]
  },
  ready() {
    const [currentPages] = getCurrentPages();
    const findIndex = this.data.list.findIndex((item) => item.pagePath === `/${currentPages.route}`);
    this.setData({
      selected: findIndex,
    })
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      // console.log(data, getCurrentPages(), app);
      const url = data.path;
      console.log(url)
      // const [currentPages] = getCurrentPages();

      // 是否需要用户鉴权
      // if (data.userauth || !url) {
      //   if (!wx.getStorageSync('user').phone) {
      //     currentPages.$vm.dialogShow = true;
      //     return;
      //   }
      // }

      if (url) {
        app.globalData.selectedBar = data.index;

        this.setData(
          { selected: data.index },
          function () {
            wx.switchTab({ url });
          },
        );
      }
      //   else {
      //   currentPages.$vm.$alert('暂未开放, 尽情期待~');
      // }
    }
  }
});
