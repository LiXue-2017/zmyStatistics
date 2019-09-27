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

  // 下拉框点击事件
  $('.main .select-box .select-text').click(function (e) {
    showSlectBottom($(this).parent(), $(this).siblings('i'), 200);
  });
  $('.main .select-box .select-ul').on('click', 'li', function () {
    showSlectBottom($(this).parents('.select-box'), $(this).parent().siblings('i'), 200);
    liChangeStyle($(this));
    // 选择专区
    if ($(this).parent().hasClass('gameType')) {
      getGameList(token, $(this).attr('data-value'), $('.main .volume .gameList'), false);
    }
    // 选择游戏
    if ($(this).parent().hasClass('gameList')) {
      $(this).parent().attr('data-selected', $(this).attr('data-value'));
      // getAccountData();
    }
  });

  // 获取游戏分类
  getGameList(token, gameDuan, $('.main .volume .gameList'), false);
  getData();
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
        var gameType = data.param.left;
        var profit = data.param.right;
        // 专区统计
        if (gameArea) {
          $('.main .game-area .all .number').text(gameArea.quan.all);
          $('.main .game-area .duan .number').text(gameArea.duan.all);
          $('.main .game-area .hand .number').text(gameArea.shou.all);
          $('.main .game-area .page .number').text(gameArea.ye.all);
        }
        // 游戏成交量
        if (gameVolume) {
          gameVolume.forEach(element => {
            lineOption.xAxis.data.push(element.dtime);
            lineOption.series[0].data.push(element.num);
          });
          var chartLine = echarts.init($('.main .volume .statistics .chart')[0]);
          chartLine.setOption(lineOption);
        }

      }
    }, 'json');
  }

});