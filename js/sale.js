$(function () {
  const gameDuan = 0, // 端游
    gameHand = 1, // 手游
    gamePage = 2; // 页游

  var token = loadFromLocal('token', 'error');
  var user = loadFromLocal('user_name', 'error');

  // 加载公共顶侧菜单
  $('.drag-box').load('_menus-top.html', function () {
    changeMenuCurrent($(this).find('.item.data-statistics'), '.sale');
    $('.drag-box .user-name').text(user + '，欢迎您~');
  });

  // 控制菜单显示隐藏
  menuHover();

  // 初始化时间选择器
  $('#sDate').dcalendarpicker();
  $('#eDate').dcalendarpicker();

  // 下拉框点击事件
  $('.content .select-box .select-text').click(function (e) {
    showSlectBottom($(this).parent(), $(this).siblings('i'), 200);
  });
  $('.content .select-box .select-ul').on('click', 'li', function () {
    showSlectBottom($(this).parents('.select-box'), $(this).parent().siblings('i'), 200);
    liChangeStyle($(this));
    // 选择专区
    if ($(this).parent().hasClass('gameType')) {
      $(this).parent().attr('data-selected', $(this).attr('data-value'));
      getGameList(token, $(this).attr('data-value'), $('.content .statistics .gameList'), getData, emptyData);
    }
    // 选择游戏
    if ($(this).parent().hasClass('gameList')) {
      $(this).parent().attr('data-selected', $(this).attr('data-value'));
      getData();
    }
  });

  // 获取游戏
  getGameList(token, gameDuan, $('.content .statistics .gameList'), getData, emptyData);

  // 点击搜索
  $('.content .statistics #btn-search').click(function () {
    getData();
  });

  // 初始化折线图
  var chartLine = echarts.init($('.content .statistics .chart')[0]);
  var lineOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['利润', '成本']
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: []
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      }
    },
    series: [{
        name: '利润',
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
      },
      {
        name: '成本',
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
      }
    ]
  };

  // 初始化饼图
  var chartPie = echarts.init($('.content .ration .chart')[0]);
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
      name: '账号占比',
      type: 'pie',
      radius: ['0', '60%'],
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
    var gameId = $('.content .statistics .gameList').attr('data-selected');

    var params = {
      a: 'data_sale',
      token: token
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
        var head = data.param.head.cost;
        var dataPie = data.param.body.left;
        var dataTable = data.param.body.right;

        // 清空
        emptyData();

        // 头部
        if (head) {
          head.forEach(item => {
            lineOption.xAxis.data.push(item.dtime);
            lineOption.series[0].data.push(item.profit);
            lineOption.series[1].data.push(item.smoney);
          });
          chartLine.setOption(lineOption);
        }
        // 利润占比统计
        if (dataPie) {
          pieOption.series[0].data.push({
            name: '利润',
            value: dataPie.lr
          });
          pieOption.series[0].data.push({
            name: '成本',
            value: dataPie.cb
          });
          pieOption.series[0].data.push({
            name: '出售',
            value: dataPie.cs
          });
          chartPie.setOption(pieOption);
        }
        if (dataTable) {
          var htmStr = '';
          dataTable.forEach((item, index) => {
            htmStr += getTemplate('#dataRow', {
              saleTime: item.dtime,
              salePrice: item.cmoney,
              recoveryPrice: item.smoney,
              profit: item.bf_lr + '%',
              cost: item.bf_cost + '%'
            });
          });
          $('.chapter .data tbody').html(htmStr);
        }
      }
    }, 'json');
  }

  function emptyData(){
    lineOption.xAxis.data = [];
    lineOption.series[0].data = [];
    lineOption.series[1].data = [];
    chartLine.setOption(lineOption);

    pieOption.series[0].data = [];
    chartPie.setOption(pieOption);
  
    $('.chapter .data tbody').empty();
  }
});