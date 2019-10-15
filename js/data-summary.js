$(function () {
  const TIME_CUSTOM = 5, // 时间 自定义
    TIME_DAY = 0, // 时间 天, 默认
    TIME_WEEK = 1, // 时间 周
    TIME_MONTH = 2, // 时间 月
    TIME_QUARTER = 3, // 时间 季度
    TIME_YEAR = 4; // 时间 年

  var token = loadFromLocal('token', 'error');
  // var user = loadFromLocal('user_name', 'error');

  // 加载页面左侧和头部菜单
  $('.menu-left-box').load('_menus-left.html', function () {
    $(this).find('.menus-left .item.data-statistics').addClass('current');
  });
  $('.main .menu-top-box').load('_menus-top.html', function () {
    $(this).find('.menus-left .item.data-statistics').addClass('current');
  });

  // 初始化时间选择器
  $('#sDate').dcalendarpicker();
  $('#eDate').dcalendarpicker();

  // 获取库存数量
  getInventory(getParams(TIME_DAY), showOverview);

  // 获取上下架情况
  getShelf(getParams(TIME_DAY), showOverview);

  // 获取人效情况
  getPersonEfficiency(getParams(TIME_DAY), showOverview);

  // 获取库存风险情况
  getInventoryRisk(getParams(TIME_DAY), showOverview);

  // 点击 日、天、月、季、年
  // $('').click(function () {
  // getInventory(getParams(TIME_DAY), showOverview);
  // getShelf(getParams(TIME_DAY), showOverview);
  // getPersonEfficiency(getParams(TIME_DAY), showOverview);
  // getInventoryRisk(getParams(TIME_DAY), showOverview);

  // 自定义
  // if ($(this).attr('data-value') == TIME_CUSTOM) {
  //   // 时间选择器 显示
  //   $('').show();
  // } else {
  //   $('').hide();
  // }
  // });

  // 返回 今日数据概览 接口参数
  function getParams(timeInt) {
    var params = {
      token: token,
      tim: timeInt
    }
    var stime = $('#sDate').val();
    var etime = $('#eDate').val();
    if (stime != '') {
      stime = (new Date(stime)).getTime() / 1000;
    }
    if (etime != '') {
      etime = ((new Date(etime)).getTime() / 1000) + 24 * 60 * 60;
    }
    // 如果是 自定义
    if (timeInt == TIME_CUSTOM) {
      params.stime = stime;
      params.etime = etime;
    }

    return params;
  }

  function showOverview(data, typeStr) {
    if (data) {
      // 库存数量情况
      if (typeStr == 'index') {
        console.log('showOverview');
        console.table(data);

        // 总
        $('.overview table.kc tbody tr.all td.num').text(data.all.num);
        $('.overview table.kc tbody tr.all td.money').text(data.all.money);
        $('.overview table.kc tbody tr.all td.avg').text(data.all.avg);
        // 出售
        $('.overview table.kc tbody tr.cs td.num').text(data.cs.num);
        $('.overview table.kc tbody tr.cs td.money').text(data.cs.money);
        $('.overview table.kc tbody tr.cs td.avg').text(data.cs.avg);
        // 回收
        $('.overview table.kc tbody tr.hs td.num').text(data.hs.num);
        $('.overview table.kc tbody tr.hs td.money').text(data.hs.money);
        $('.overview table.kc tbody tr.hs td.avg').text(data.hs.avg);
      }
      // 上下架情况
      if (typeStr == 'data_shelf') {
        console.table(data);
        // 合计待售
        $('.overview table.shelf tbody tr:nth-child(1) td.num').text(data.ds.num);
        $('.overview table.shelf tbody tr:nth-child(1) td.money').text(data.ds.money);
        $('.overview table.shelf tbody tr:nth-child(1) td.avg').text(data.ds.avg);
        // 今日上架
        $('.overview table.shelf tbody tr:nth-child(2) td.num').text(data.sj.num);
        $('.overview table.shelf tbody tr:nth-child(2) td.money').text(data.sj.money);
        $('.overview table.shelf tbody tr:nth-child(2) td.avg').text(data.sj.avg);
        // 今日下架
        $('.overview table.shelf tbody tr:nth-child(3) td.num').text(data.xj.num);
        $('.overview table.shelf tbody tr:nth-child(3) td.money').text(data.xj.money);
        $('.overview table.shelf tbody tr:nth-child(3) td.avg').text(data.xj.avg);
        // 今日未上架
        $('.overview table.shelf tbody tr:nth-child(4) td.num').text(data.ws.num);
        $('.overview table.shelf tbody tr:nth-child(4) td.money').text(data.ws.money);
        $('.overview table.shelf tbody tr:nth-child(4) td.avg').text(data.ws.avg);
        // 合计未上架
        $('.overview table.shelf tbody tr:nth-child(5) td.num').text(data.wsz.num);
        $('.overview table.shelf tbody tr:nth-child(5) td.money').text(data.ws.money);
        $('.overview table.shelf tbody tr:nth-child(5) td.avg').text(data.ws.avg);
      }
      
      // 人效情况
      if (typeStr == 'data_user') {
        console.table(data);
        // 人均回收
        $('.overview table.user tbody tr:nth-child(1) td.num').text(data.avg_z.num);
        $('.overview table.user tbody tr:nth-child(1) td.num').text(data.avg_z.money);
        $('.overview table.user tbody tr:nth-child(1) td.num').text(data.avg_z.avg);
        // 今日最多回收(数量)
        $('.overview table.user tbody tr:nth-child(2) td.num').text(data.num_one.num);
        $('.overview table.user tbody tr:nth-child(2) td.num').text(data.num_one.money);
        $('.overview table.user tbody tr:nth-child(2) td.num').text(data.num_one.avg);
        // 今日最多回收(金额)
        $('.overview table.user tbody tr:nth-child(2) td.num').text(data.money_one.num);
        $('.overview table.user tbody tr.hs td.num').text(data.money_one.money);
        $('.overview table.user tbody tr.hs td.num').text(data.money_one.avg);
      }
      // 库存风险情况
      if (typeStr == 'data_zhui') {
        console.table(data);
        // 合计待追回
        $('.overview table.kc tbody tr.hs td.num').text(data.avg_z.num);
        $('.overview table.kc tbody tr.hs td.num').text(data.avg_z.money);
        $('.overview table.kc tbody tr.hs td.num').text(data.avg_z.avg);
        // 今日已追回
        $('.overview table.kc tbody tr.hs td.num').text(data.zhui.num);
        $('.overview table.kc tbody tr.hs td.num').text(data.zhui.money);
        $('.overview table.kc tbody tr.hs td.num').text(data.zhui.avg);
        // 今日被找回
        $('.overview table.kc tbody tr.hs td.num').text(data.zhao.num);
        $('.overview table.kc tbody tr.hs td.num').text(data.zhao.money);
        $('.overview table.kc tbody tr.hs td.num').text(data.zhao.avg);
      }

    }
  };



});