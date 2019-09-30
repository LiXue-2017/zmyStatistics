$(function () {
  const gameDuan = 0; // 端游
  var token = loadFromLocal('token', 'error');
  var user = loadFromLocal('user_name', 'error');

  // 加载公共顶侧菜单
  $('.drag-box').load('_menus-top.html', function () {
    changeMenuCurrent($(this).find('.item.data-statistics'), '.game-volume');
    $('.drag-box .user-name').text(user + '，欢迎您~');
  });

  // 控制菜单显示隐藏
  menuHover();

  // 初始化时间选择器
  $('#sDate').dcalendarpicker();
  $('#eDate').dcalendarpicker();

  // 获取游戏分类
  getGameList(token, gameDuan, $('.main .statistics .gameList'), getData, emptyData);

  // 下拉框点击事件
  $('.main .select-box .select-text').click(function (e) {
    showSlectBottom($(this).parent(), $(this).siblings('i'), 200);
  });
  $('.main .select-box .select-ul').on('click', 'li', function () {
    showSlectBottom($(this).parents('.select-box'), $(this).parent().siblings('i'), 200);
    liChangeStyle($(this));
    // 选择专区
    if ($(this).parent().hasClass('gameType')) {
      $(this).parent().attr('data-selected', $(this).attr('data-value'));
      getGameList(token, parseInt($(this).attr('data-value')), $('.main .statistics .gameList'), getData, emptyData);
      // getGameList(token, $(this).attr('data-value'), $('.main .volume .gameList'), false);
      // getGames();
    }
    // 选择游戏
    if ($(this).parent().hasClass('gameList')) {
      $(this).parent().attr('data-selected', $(this).attr('data-value'));
      getData();
    }
  });

  // 点击搜索
  $('.main .head #btn-search').click(function () {
    getData();
  });


  var lineOption = {
    title: {
      text: '游戏成交量统计',
      textStyle: {
        color: '#00bfb4',
        fontSize: 22
      },
      backgroundColor: '#f8f8f8',
      borderWidth: '1px',
      borderColor: '#dfdfdf',
      padding: [28, 26]
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: []
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      }
    },
    series: [{
      name: '游戏成交量',
      type: 'line',
      data: [],
      markPoint: {
        data: [{
            type: 'max',
            name: '最大值'
          },
          {
            type: 'min',
            name: '最小值'
          }
        ]
      },
      markLine: {
        data: [{
          type: 'average',
          name: '平均值'
        }]
      }
    }]
  }
  var chartLine = echarts.init($('.main .volume .statistics .chart')[0]);

  // 获取游戏分类
  function getGames(gameArea) {
    var params = {
      a: 'get_yxlist',
      token: token,
      ctype: gameArea
    }

    $.post(HTTP_SERVERNAME + '/worksystem/statistical.php', params, function (data, status) {
      var code = data.code;
      checkToken(code);
      if (code == 0) {
        var list = data.param;
        var listDom = $('.main .volume .gameList');
        if (list && list.length > 0) {
          var htmlStr = '';
          list.forEach(function (val, index) {
            htmlStr += getTemplate('#gameRow', {
              gameId: val.yx_id,
              gameName: val.yx_name
            });
          });
          listDom.html(htmlStr);
          // 默认选中第一个
          liSelected(listDom.children('li').first());
        } else {
          resetSelect(listDom, '', '');
          listDom.empty();
        }
        getData();
      }
    }, 'json');
  }

  // 获取页面数据
  function getData() {
    var stime = $("#sDate").val();
    var etime = $("#eDate").val();
    var gameId = $('.main .volume .gameList').attr('data-selected');

    var params = {
      a: 'data_turnover',
      token: token,
      yxid: gameId
    }

    if (stime != '') {
      stime = new Date(stime);
      stime = parseInt(stime.getTime() / 1000);
      params.stime = stime;
    }
    if (etime != '') {
      etime = new Date(etime);
      etime = parseInt(etime.getTime() / 1000);
      params.etime = etime + 24 * 60 * 60;;
    }
    if (gameId != '') {
      params.yxid = parseInt(gameId);
    }

    console.table(params);
    $.post(HTTP_SERVERNAME + '/worksystem/statistical.php', params, function (data, status) {
      var code = data.code;
      checkToken(code);
      if (code == 0) {
        var gameArea = data.param.head;
        var gameVolume = data.param.body;
        var rankData = data.param.foot;
   
        emptyData();

        // 专区统计
        if (gameArea) {
          $('.main .game-area .all .number').text(gameArea.quan.all);
          $('.main .game-area .duan .number').text(gameArea.duan.all);
          $('.main .game-area .hand .number').text(gameArea.shou.all);
          $('.main .game-area .page .number').text(gameArea.ye.all);
        }
        // 游戏成交量
        if (gameVolume) {
          lineOption.xAxis.data = [];
          lineOption.series[0].data = [];

          gameVolume.forEach(element => {
            lineOption.xAxis.data.push(element.dtime);
            lineOption.series[0].data.push(element.num);
          });
          chartLine.setOption(lineOption);
        }
        // 游戏成交量排行
        if (rankData) {
          var htmlStr = '';
          rankData.forEach(function (item, index) {
            htmlStr += getTemplate('#rankRow', {
              rank: index + 1,
              gameName: item.yx_name,
              volume: item.num
            });
          });
          var rankList = $('.main .volume .rank-list .list');
          $('.main .volume .rank-list .list').html(htmlStr);
          rankList.find('.item:nth-child(1), .item:nth-child(2), .item:nth-child(3)').find('.rank').addClass('has-icon').find('.icon').removeClass('hide');
        }
      }
    }, 'json');
  }

// 清空页面数据
function emptyData() {
  lineOption.xAxis.data = [];
  lineOption.series[0].data = [];
  chartLine.setOption(lineOption);
}

});