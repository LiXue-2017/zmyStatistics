$(function () {
  const gameDuan = 0; // 端游

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
    showSlectRight($(this).parent(), $(this).siblings('i'), 200);
  });
  $('.content .select-box .select-ul').on('click', 'li', function () {
    showSlectRight($(this).parents('.select-box'), $(this).parent().siblings('i'), 200);
    liChangeStyle($(this));
    // 选择专区
    if ($(this).parent().hasClass('gameType')) {
      getGameList(token, $(this).attr('data-value'), $('.content .chapter .gameList'), false);
    }
    // 选择游戏
    if ($(this).parent().hasClass('gameList')) {
      $(this).parent().attr('data-selected', $(this).attr('data-value'));
      getAccountData();
    }
  });

  // 点击选择账号状态
  $('.content .time-statistics .account-status .status, .content .account-statistics .game-type .type').click(function () {
    $(this).addClass('current').siblings().removeClass('current');
    $(this).parent().attr('data-selected', $(this).attr('data-value'));
    getAccountData();
  });

  // 获取游戏分类
  getGameList(token, gameDuan, $('.content .chapter .gameList'), false);

  // 获取 账号的数据统计
  getAccountData();

  // 点击搜索
  $('.content .summary #btn-search').click(function () {
    getAccountData();
  });

  // 初始化柱状图
  var chartColumn = echarts.init($('.content .time-statistics .chart')[0]);
  var chartColumnOption = {
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
      axisPointer: {
        type: 'shadow'
      }
    },
    calculable: true,
    xAxis: [{
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
      type: 'value'
    }],
    series: [{
      name: '个数',
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
  var chartPieOption = {
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
      name: '账号占比',
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
  function getAccountData() {
    var stime = $("#sDate").val();
    var etime = $("#eDate").val();
    // 专区
    var gameType = parseInt($('.content .time-statistics .gameType').attr('data-selected'));
    var gameId = $('.content .time-statistics .gameList').attr('data-selected');
    // 账号状态
    var gameStatus = parseInt($('.content .time-statistics .account-status').attr('data-selected'));
    var params = {
      a: 'data_account',
      token: token,
      fot_type: gameType,
      acc_type: gameStatus
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
        var headDom = $('.content .summary .account-type');
        var body = data.param.body;
        var foot = data.param.foot.left;
        // 头部
        if (head) {
          // 全部
          headDom.find('.all .number').text(head.quan.all + '/个');
          headDom.find('.all .sale').text('售出' + head.quan.sell + '个');
          headDom.find('.all .recovery').text('回收' + head.quan.rec + '个');
          headDom.find('.all .return').text('找回' + head.quan.retr + '个');
          // 端游
          headDom.find('.duan .number').text(head.duan.all + '/个');
          headDom.find('.duan .sale').text('售出' + head.duan.sell + '个');
          headDom.find('.duan .recovery').text('回收' + head.duan.rec + '个');
          headDom.find('.duan .return').text('找回' + head.duan.retr + '个');
          //手游
          headDom.find('.hand .number').text(head.shou.all + '/个');
          headDom.find('.hand .sale').text('售出' + head.shou.sell + '个');
          headDom.find('.hand .recovery').text('回收' + head.shou.rec + '个');
          headDom.find('.hand .return').text('找回' + head.shou.retr + '个');
          //页游
          if(head.ye != '') {
            headDom.find('.page .number').text(page.all + '/个');
            headDom.find('.page .sale').text('售出' + page.sell + '个');
            headDom.find('.page .recovery').text('回收' + page.rec + '个');
            headDom.find('.page .return').text('找回' + page.retr + '个');
          }
          
        }
        // 时间统计
        if (body) {
          body.forEach(element => {
            headDom.find('.all .number').text(head.quan.all + '/个');
          });
          chartColumn.setOption(chartColumnOption);
        }
        // 账号统计
        if (foot) {
          var foodDom = $('.content .account-statistics');
          // 清空之前数据
          foodDom.find('.data tbody').empty();
          chartPieOption.series[0].data = [];
          chartPieOption.legend.data = [];
          foot.forEach((element, index) => {
            var recoveryNum = element.rec ? element.rec : 0;
            var saleNum = element.sell ? element.sell : 0;
            var returnNum = element.retr ? element.retr : 0;
            var htmStr = getTemplate('#dataRow', {
              rank: index + 1,
              gameName: element.yx_name,
              ratio: element.zb + '%',
              recoveryNum: recoveryNum,
              saleNum: saleNum,
              returnNum: returnNum
            });
            foodDom.find('.data tbody').append(htmStr);
            foodDom.find('.data tbody tr:nth-child(' + (index + 1) + ') .ratio .ratio-box').animate({
              width: element.zb + '%'
            }, 500);
            chartPieOption.series[0].data.push({
              name: element.yx_name,
              value: element.sum
            });
            chartPieOption.legend.data.push(element.yx_name);
          });
          chartPie.setOption(chartPieOption);
        }
      }
    }, 'json');
  }
});