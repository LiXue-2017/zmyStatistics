$(function () {
  var token = loadFromLocal('token', 'error');
  var user = loadFromLocal('user_name', 'error');

  // 加载公共顶侧菜单
  $('.drag-box').load('_menus-top.html', function () {
    changeMenuCurrent($(this).find('.item.data-statistics'), '.service-volume');
    $('.drag-box .user-name').text(user + '，欢迎您~');
  });

  // 控制菜单显示隐藏
  menuHover();
  // 获取交易客服
  getDealkF(token, $('.main .head .kfList'), true);
  getData();

  // 初始化时间选择器
  $('#sDate').dcalendarpicker();
  $('#eDate').dcalendarpicker();
  // 时间默认当月第一天到当月最后一天
  $("#sDate").val(currentMonthFirst());
  $("#eDate").val(currentMonthLast());

  // 下拉框点击事件
  $('.main .select-box .select-text').click(function (e) {
    isShowSlectUl($(this).siblings('.select-ul'), 200);
  });
  $('.main .select-box .select-ul').on('click', 'li', function () {
    isShowSlectUl($(this).parent(), 200);
    liChangeStyle($(this));
    getData();
  });
  // 点击搜索
  $('.main .head #btn-search').click(function () {
    getData();
  });

  var pieOption = {
    title: {
      text: '',
      x: 'left',
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
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      type: 'scroll',
      bottom: 0,
      itemGap: 10,
      data: []
    },
    series: [{
      name: '',
      type: 'pie',
      radius: ['0', '60%'],
      label: {
        normal: {
          formatter: '{b|{b}：}{c}  {per|{d}%} ',
          rich: {
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
  // 柱状图
  var barOption = {
    title: {
      text: '个人交易量',
      textStyle: {
        color: '#00bfb4',
        fontSize: 22
      },
      borderWidth: '1px',
      borderColor: '#dfdfdf',
      padding: [28, 26, 0]
    },
    grid: {
      left: 100,
      top: 100,
      borderWidth: 1
    },
    tooltip: {
      trigger: 'axis',
      formatter: "{a} <br/>{b}：{c}个"
    },
    legend: {
      type: 'scroll',
      bottom: 0,
      itemGap: 10,
      data: []
    },
    xAxis: [{
      name: '日期',
      type: 'category',
      data: []
    }],
    yAxis: [{
      name: '交易量/个',
      type: 'value'
    }],
    series: [{
      name: '个人交易量',
      type: 'bar',
      data: []
    }]
  };
  var lineOption = {
    title: {
      text: '账号利润统计',
      textStyle: {
        color: '#00bfb4',
        fontSize: 22
      },
      borderWidth: '1px',
      borderColor: '#dfdfdf',
      padding: [28, 26, 0]
    },
    grid: {
      left: 100,
      top: 100,
      borderWidth: 1
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{a} <br/> {b}：{c}元'
    },
    xAxis: {
      name: '日期',
      type: 'category',
      boundaryGap: true,
      data: []
    },
    yAxis: [{
      name: '利润/元',
      type: 'value'
    }],
    series: [{
      name: '账号利润统计',
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

  // 初始化图表
  var chartPie1 = echarts.init($('.main .statistics .profit-price')[0]);
  var chartBar = echarts.init($('.main .statistics .person-volume')[0]);
  var chartPie2 = echarts.init($('.main .statistics .game-type')[0]);
  var chartLine = echarts.init($('.main .statistics .profit')[0]);

  // 获取页面数据
  function getData() {
    var stime = $("#sDate").val();
    var etime = $("#eDate").val();
    var kfId = parseInt($('.main .head .kfList').attr('data-selected'));

    var params = {
      a: 'data_volume',
      token: token,
      cid: kfId
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

    console.table(params);
    $.post(HTTP_SERVERNAME + '/worksystem/statistical.php', params, function (data, status) {
      var code = data.code;
      checkToken(code);
      if (code == 0) {
        var profitPrice = data.param.head;
        var personVolume = data.param.body;
        var gameType = data.param.left;
        var profit = data.param.right;

        // 清空
        emptyData();

        // 利润价格占比
        if (profitPrice) {
          pieOption.title.text = '利润价格占比';
          pieOption.series[0].name = '利润价格占比';

          pieOption.legend.data = ['0~500元', '500~1000元', '1000元以上'];
          pieOption.series[0].data.push({
            name: '0~500元',
            value: profitPrice.x
          })
          pieOption.series[0].data.push({
            name: '500~1000元',
            value: profitPrice.z
          })
          pieOption.series[0].data.push({
            name: '1000元以上',
            value: profitPrice.d
          })

          chartPie1.setOption(pieOption);
        }

        // 个人交易量
        if (personVolume) {
          personVolume.forEach(function (item) {
            barOption.xAxis[0].data.push(item.dtime);
            barOption.series[0].data.push(item.num);
          });

          chartBar.setOption(barOption);
        }
        // 游戏类型占比
        if (gameType) {
          pieOption.title.text = '游戏类型占比';
          pieOption.series[0].name = '游戏类型占比';
          pieOption.legend.data = [];
          pieOption.series[0].data = [];

          gameType.forEach(function (item) {
            pieOption.legend.data.push(item.yx_name);
            pieOption.series[0].data.push({
              name: item.yx_name,
              value: item.num
            });
          });

          chartPie2.setOption(pieOption);
        }

        // 账号利润统计
        if (profit) {
          profit.forEach(function (item) {
            lineOption.xAxis.data.push(item.dtime);
            lineOption.series[0].data.push(item.profit);
          });

          chartLine.setOption(lineOption);
        }
      }
    }, 'json');
  }

  // 清空页面数据
  function emptyData() {
    pieOption.legend.data = [];
    pieOption.series[0].data = [];
    chartPie1.setOption(pieOption);
    chartPie2.setOption(pieOption);

    barOption.xAxis[0].data = [];
    barOption.series[0].data = [];
    chartBar.setOption(barOption);

    lineOption.xAxis.data = [];
    lineOption.series[0].data = [];
    chartLine.setOption(lineOption);
  }

});