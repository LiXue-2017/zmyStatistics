$(function () {
  const gameDuan = 0, // 端游
  gameHand = 1, // 手游
  gamePage = 2; // 页游

  var token = loadFromLocal('token', 'error');
  var user = loadFromLocal('user_name', 'error');

  // 加载公共顶侧菜单
  $('.drag-box').load('_menus-top.html', function () {
    changeMenuCurrent($(this).find('.item.data-statistics'), '.account');
    $('.drag-box .user-name').text(user + '，欢迎您~');
  });

  // 控制菜单显示隐藏
  menuHover();

  // 初始化时间选择器
  $('#sDate').dcalendarpicker();
  $('#eDate').dcalendarpicker();

// 下拉框点击事件  
  $('.content .select-box .select-text').click(function (e) {
    console.log($(this).innerWidth());
    showSlectUlRight($(this).parent(), $(this).innerWidth(),  $(this).innerHeight(), $(this).siblings('.select-ul'), $(this).siblings('i'), 200);
  });

  // 获取游戏分类
  getGameList(token, gameDuan, $('.content .chapter .gameList'), false);
  
});