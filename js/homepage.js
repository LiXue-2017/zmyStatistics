$(function () {
  var token = loadFromLocal('token', 'error');
  var user = loadFromLocal('user_name', 'error');
  // 加载公共顶侧菜单
  $('.drag-box').load('_menus-top.html', function () {
    changeMenuCurrent($(this).find('.item.homepage'));
    $('.drag-box .user-name').text(user + '，欢迎您~');
  });

  // 控制菜单显示隐藏
  menuHover();
  // 初始化时间选择器
  $('#sDate').dcalendarpicker();
  $('#eDate').dcalendarpicker();

  // 首次获取数据
  getData();
  
  // 下拉框点击事件  
  $('.main .select-box .select-text').click(function (e) {
    showSlectBottom($(this).parent(), $(this).siblings('i'), 200);
  });
  $('.main .select-box .select-ul').on('click', 'li', function () {
    showSlectBottom($(this).parents('.select-box'), $(this).parent().siblings('i'), 200);
    liChangeStyle($(this));
    // 数据类型
    if($(this).parent().hasClass('dataType')) {
      getData();
    }
  });
  // 点击搜索
  $('.main .search #btn-search').click(function () {
    getData();
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
        color: '#69d7d2' // 0% 处的颜色
      }, {
        offset: 0,
        color: '#36bbb5' // 100% 处的颜色
      }],
      globalCoord: false // 缺省为 false
    },
    dataZoom: {
      type: 'slider',
      show: true,
    },
    tooltip: {
      trigger: 'axis',
      formatter: "{b}: <br/> {c}"
    },
    legend: {
      type: 'scroll',
      bottom: 0,
      itemGap: 10
    },
    xAxis: {
      name: '时间',
      type: 'category',
      data: []
    },
    yAxis: {
      name: '人数',
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

  var pieOption = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: '30%',
      itemGap: 10,
      textStyle: {
        fontSize: 16
      },
      itemHeight: 18,
      data: []
    },
    series: [{
      name: '玩家数据占比',
      type: 'pie',
      radius: ['40%', '80%'],
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

  // 初始化饼图
  var chartBar = echarts.init($('.content .player-data .chart')[0]);
  var chartPie = echarts.init($('.content .visitor-percentage .chart')[0]);

  // 获取页面数据
  function getData() {
    var stime = $("#sDate").val();
    var etime = $("#eDate").val();
    var dataType = parseInt($('.content .dataType').attr('data-selected'));

    var params = {
      a: 'index',
      token: token,
      acc_type: dataType
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
        var head = data.param.head;
        var body = data.param.body;
        var foot = data.param.foot;
        // 清空
        barOption.xAxis.data = [];
        barOption.series[0].data = [];

        pieOption.legend.data = [];
        pieOption.series[0].data = [];
        1
        // 利润价格占比
        if (head) {
          $('.content .player-data .new-add .number').text(head.xz);
          $('.content .player-data .visit .number').text(head.fw);
          $('.content .player-data .place-order .number').text(head.xd);
          $('.content .player-data .sign-in .number').text(head.dl);
        }

        // 个人交易量
        if (body) {
          body.forEach(function (item) {
            barOption.xAxis.data.push(item.dtime);
            barOption.series[0].data.push(item.num);
          });
          chartBar.setOption(barOption);
        }
        // 游戏类型占比
        if (foot) {
          foot.forEach(item => {
            pieOption.legend.data.push(item.name);
            pieOption.series[0].data.push({
              name: item.name,
              value: item.num
            });
          });

          chartPie.setOption(pieOption);
        }

      }
    }, 'json');
  }
});