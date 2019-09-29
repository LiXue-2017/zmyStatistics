$(function () {
  const gameDuan = 0; // 端游

  var token = loadFromLocal('token', 'error');
  var user = loadFromLocal('user_name', 'error');

  // 加载公共顶侧菜单
  $('.drag-box').load('_menus-top.html', function () {
    changeMenuCurrent($(this).find('.item.data-statistics'), '.capital');
    $('.drag-box .user-name').text(user + '，欢迎您~');
  });

  // 控制菜单显示隐藏
  menuHover();

  // 初始化时间选择器
  $('#sDate').dcalendarpicker();
  $('#eDate').dcalendarpicker();

  // 获取游戏分类
  getGames(gameDuan);
  getData();
  // 下拉框点击事件  
  $('.main .select-box .select-text').click(function (e) {
    showSlectBottom($(this).parent(), $(this).siblings('i'), 200);
  });
  $('.main .select-box .select-ul').on('click', 'li', function () {
    showSlectBottom($(this).parents('.select-box'), $(this).parent().siblings('i'), 200);
    liChangeStyle($(this));
    // 选择专区
    if ($(this).parent().hasClass('gameType')) {
      getGames($(this).attr('data-value'));
      // getData();
      getData($(this).parent().attr('data-part'));
    }
    // 选择游戏
    if ($(this).parent().hasClass('gameList')) {
      $(this).parent().attr('data-selected', $(this).attr('data-value'));
      // getData();
      getData($(this).parent().attr('data-part'));
    }
  });

  // 点击搜索
  $('.main .head #btn-search').click(function () {
    getData();
  });

    // 点击选择账号状态
    $('.main .statistics .capital-status .status').click(function () {
      $(this).addClass('current').siblings().removeClass('current');
      $(this).parent().attr('data-selected', $(this).attr('data-value'));
      getData();
    });


  // 回报周期统计 点击选择 专区
  $('.main .return-cycle .data-table .game-type .type').click(function () {
    $(this).addClass('current').siblings().removeClass('current');
    $(this).parent().attr('data-selected', $(this).attr('data-value'));
    getData($(this).parent().attr('data-part'));
  });

  // 柱状图
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
      axisPointer: {
        type: 'shadow'
      },
      formatter: "{b}: <br/> {c} 元"
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '',
      type: 'bar',
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
  };

  // 扇形图
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
      name: '游戏统计',
      type: 'pie',
      radius: ['0', '60%'],
      avoidLabelOverlap: false,
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
  // 初始化图表
  var chartBar = echarts.init($('.main .statistics .chart')[0]);
  var chartPie = echarts.init($('.main .pay-statis .stastics-ratio .chart')[0]);

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
        var listDom = $('.main .statistics .gameList');
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
      }
    }, 'json');
  }

  // 获取 回报周期 数据
  function getData() {
    var stime = $("#sDate").val();
    var etime = $("#eDate").val();
    var gameId = $('.main .statistics .gameList').attr('data-selected');
    var areaId = parseInt($('.main .data-table .game-type').attr('data-selected'));
    var capStatus = parseInt($('.main .statistics .capital-status').attr('data-selected'));

    var params = {
      a: 'data_capital',
      token: token,
      fot_type: areaId,
      acc_type: capStatus
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
        var bodyData = data.param.body;
        var footData = data.param.foot.left;
        var dataDom = $('.main .pay-statis .data-table .data tbody');
        // 清空
        // chartBar.dispose();
        barOption.xAxis.data = [];
        barOption.series[0].data = [];
         
        pieOption.series[0].data = [];
        pieOption.legend.data = [];
        dataDom.empty();

        // 专区统计
        if (gameArea) {
          $('.main .game-area .all .number').text(gameArea.quan.all + '元');
          $('.main .game-area .duan .number').text(gameArea.duan.all + '元');
          $('.main .game-area .hand .number').text(gameArea.shou.all + '元');
          $('.main .game-area .page .number').text(gameArea.ye.all + '元');

          $('.main .game-area .all .pay').text('支出' + gameArea.quan.zc + '元');
          $('.main .game-area .duan .pay').text('支出' + gameArea.duan.zc + '元');
          $('.main .game-area .hand .pay').text('支出' + gameArea.shou.zc + '元');
          $('.main .game-area .page .pay').text('支出' + gameArea.ye.zc + '元');

          $('.main .game-area .all .return').text('找回' + gameArea.quan.zh + '元');
          $('.main .game-area .duan .return').text('找回' + gameArea.duan.zh + '元');
          $('.main .game-area .hand .return').text('找回' + gameArea.shou.zh + '元');
          $('.main .game-area .page .return').text('找回' + gameArea.ye.zh + '元');
        }

        // 获取 平均回报周期 
        if (bodyData) {
          bodyData.forEach(element => {
            barOption.xAxis.data.push(element.dtime);
            barOption.series[0].data.push(element.num);
          });
          chartBar.setOption(barOption);
        }

        // 底部数据
        if (footData) {
          footData.forEach(function (item, index) {
            var income = item.sell_money ? item.sell_money : 0;
            var payNum = item.rec_money ? item.rec_money : 0;
            var returnNum = item.retr_money ? item.retr_money : 0;

            var htmlStr = getTemplate('#dataRow', {
              rank: index + 1,
              gameName: item.yx_name,
              ratio: item.zb + '%',
              income: income,
              pay: payNum,
              return: returnNum
            });
            dataDom.append(htmlStr);
            dataDom.find('tr:nth-child(' + (index + 1) + ') .ratio .ratio-box').animate({
              width: item.zb + '%'
            }, 400);

            pieOption.series[0].data.push({
              name: item.yx_name,
              value: item.zb
            });
            pieOption.legend.data.push(item.yx_name);
          });
          chartPie.setOption(pieOption);
        }

      }
    }, 'json');
  }


});