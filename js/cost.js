$(function () {
  const gameDuan = 0, // 端游
    gameHand = 1, // 手游
    gamePage = 2; // 页游

  var token = loadFromLocal('token', 'error');
  var user = loadFromLocal('user_name', 'error');

  // 加载公共顶侧菜单
  $('.drag-box').load('_menus-top.html', function () {
    changeMenuCurrent($(this).find('.item.data-statistics'), '.cost');
    $('.drag-box .user-name').text(user + '，欢迎您~');
  });

  // 控制菜单显示隐藏
  menuHover();

  // 初始化时间选择器
  $('#sDate').dcalendarpicker();
  $('#eDate').dcalendarpicker();
  // 时间默认当月第一天到当月最后一天
  $("#sDate").val(currentMonthFirst());
  $("#eDate").val(currentMonthLast());

  // 下拉框点击事件  
  $('.content .select-box .select-text').click(function (e) {
    showSlectRight($(this).parent(), $(this).siblings('i'), 200);
  });
  $('.content .select-box .select-ul').on('click', 'li', function () {
    showSlectRight($(this).parents('.select-box'), $(this).parent().siblings('i'), 200);
    liChangeStyle($(this));
    // 选择专区
    if ($(this).parent().hasClass('gameArea')) {
      getGameList(token, $(this).attr('data-value'), $('.content .cost-statistics .gameList'), getData, emptyData);
    }
    // 选择游戏
    if ($(this).parent().hasClass('gameList')) {
      $(this).parent().attr('data-selected', $(this).attr('data-value'));
      getData();
    }
  });
  // 点击选择账号状态
  $('.content .cost-statistics .account-status .status').click(function () {
    $(this).addClass('current').siblings().removeClass('current');
    $(this).parent().attr('data-selected', $(this).attr('data-value'));
    getData();
  });

  // 获取游戏分类
  getGameList(token, gameDuan, $('.content .chapter .gameList'), getData, emptyData);

  // 点击搜索
  $('.content .summary #btn-search').click(function () {
    getData();
  });

  // 点击选择游戏专区
  $('.chapter.account-statistics .game-area .area').click(function () {
    $(this).addClass('current').siblings().removeClass('current');
    $(this).parent().attr('data-selected', $(this).attr('data-value'));
    getData();
  });

  // 初始化柱状图
  var chartBar = echarts.init($('.content .cost-statistics .chart')[0]);
  var barOption = {
    color: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0,
        color: '#4098a9' // 0% 处的颜色
      }, {
        offset: 1,
        color: '#366fab' // 100% 处的颜色
      }],
      globalCoord: false // 缺省为 false
    },
    dataZoom: {
      type: 'slider',
      show: true,
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{a} <br/>{b} <br/> {c}元',
      axisPointer: {
        type: 'shadow'
      }
    },
    axisPointer: {
      show: true,
      type: 'line',

    },
    calculable: true,
    xAxis: [{
      name: '日期',
      type: 'category',
      axisTick: {
        show: true
      },
      nameTextStyle: {
        align: 'center',
        verticalAlign: 'middle'
      },
      axisLabel: { // 坐标轴标签
        interval: 0, // 显示每个x轴标签
        rotate: 0 // 倾斜
      },
      data: []
    }],
    yAxis: [{
      name: '成本/元',
      type: 'value'
    }],
    series: [{
      name: '成本统计',
      type: 'bar',
      barGap: 0,
      barWidth: 20,
      barMinHeight: 1,
      itemStyle: {
        barBorderRadius: [5, 5, 0, 0],
        shadowBlur: 5,
        shadowOffsetX: 0,
        shadowOffsetY: 5,
        shadowColor: 'rgba(17, 74, 123, 0.75)'
      },
      data: []
    }]
  }

  // 初始化饼图
  var chartPie = echarts.init($('.content .account-statistics .chart')[0]);
  var pieOption = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      type: 'scroll',
      left: '60px',
      bottom: 0,
      itemGap: 10,
      textStyle: {
        fontSize: 16
      },
      itemHeight: 18,
      data: []
    },
    series: [{
      name: '成本占比',
      type: 'pie',
      radius: ['36%', '60%'],
      label: {
        normal: {
          formatter: '{b|{b}：}{c}  {per|{d}%}  ',
          rich: {
            b: {
              fontSize: 16,
              lineHeight: 33
            },
            per: {
              color: '#eee',
              backgroundColor: '#334455',
              padding: [4, 4],
              borderRadius: 2
            }
          }
        }
      },
      labelLine: {
        normal: {
          show: true
        },
        emphasis: {
          show: true
        }
      },
      data: []
    }]
  };

  // 获取页面数据
  function getData() {
    var stime = $("#sDate").val();
    var etime = $("#eDate").val();
    // 专区
    var gameArea = parseInt($('.content .account-statistics .game-area').attr('data-selected'));
    var gameId = $('.content .cost-statistics .gameList').attr('data-selected');
    // 账号状态
    var gameStatus = parseInt($('.content .cost-statistics .account-status').attr('data-selected'));
    var params = {
      a: 'data_cost',
      token: token,
      acc_type: gameArea,
      fot_type: gameStatus
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
    console.table(params)
    $.post(HTTP_SERVERNAME + '/worksystem/statistical.php', params, function (data, status) {
      var code = data.code;
      checkToken(code);
      if (code == 0) {
        var head = data.param.head;
        var headDom = $('.content .summary .game-type');
        var footDom = $('.content .account-statistics');
        var body = data.param.body;
        var foot = data.param.foot.left;

        // 清空之前数据
        emptyData();

        // 头部
        if (head) {
          // 全部
          headDom.find('.cost .number').text(head.quan.all + '元');
          headDom.find('.cost .recovery').text('回收' + head.quan.rec + '个');
          headDom.find('.cost .return').text('找回' + head.quan.retr + '个');
          // 端游
          headDom.find('.duan .number').text(head.duan.all + '元');
          headDom.find('.duan .recovery').text('回收' + head.duan.rec + '个');
          headDom.find('.duan .return').text('找回' + head.duan.retr + '个');
          //手游
          headDom.find('.hand .number').text(head.shou.all + '元');
          headDom.find('.hand .recovery').text('回收' + head.shou.rec + '个');
          headDom.find('.hand .return').text('找回' + head.shou.retr + '个');
          // 页游
          if (head.ye != '') {
            headDom.find('.page .number').text(head.shou.all + '元');
            headDom.find('.page .recovery').text('回收' + head.shou.rec + '个');
            headDom.find('.page .return').text('找回' + head.shou.retr + '个');
          }
        }
        // 中部 成本统计
        if (body) {
          body.forEach(item => {
            barOption.xAxis[0].data.push(item.dtime)
            barOption.series[0].data.push(item.num);
          });
          chartBar.setOption(barOption);
        }
        // 账号统计
        if (foot) {
          foot.forEach((element, index) => {
            var recoveryNum = element.rec ? element.rec : 0;
            var recoveryCost = element.rec_money ? element.rec_money : 0;
            var returnNum = element.retr ? element.retr : 0;
            var returnCost = element.retr_money ? element.retr_money : 0;

            var htmStr = getTemplate('#dataRow', {
              rank: index + 1,
              gameName: element.yx_name,
              ratio: element.zb + '%',
              recoveryNum: recoveryNum + '个',
              recoveryCost: recoveryCost + '元',
              returnNum: returnNum + '个',
              returnCost: returnCost + '元'
            });
            footDom.find('.data tbody').append(htmStr);
            footDom.find('.data tbody tr:nth-child(' + (index + 1) + ') .ratio .ratio-box').animate({
              width: element.zb + '%'
            }, 500);
            pieOption.series[0].data.push({
              name: element.yx_name,
              value: element.zb
            });
            pieOption.legend.data.push(element.yx_name);
          });
          chartPie.setOption(pieOption);
        }
      }
    }, 'json');
  }

  // 清空页面数据
  function emptyData() {
    barOption.series[0].data = [];
    barOption.xAxis[0].data = [];

    $('.content .account-statistics .data tbody').empty();
    pieOption.series[0].data = [];
    pieOption.legend.data = [];

  }


});