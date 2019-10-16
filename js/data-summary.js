$(function () {
  const TIME_CUSTOM = 5, // 时间 自定义
    TIME_DAY = 0, // 时间 天, 默认
    TIME_WEEK = 1, // 时间 周
    TIME_MONTH = 2, // 时间 月
    TIME_QUARTER = 3, // 时间 季度
    TIME_YEAR = 4; // 时间 年

  var token = loadFromLocal('token', 'error');
  var user = loadFromLocal('user_name', 'error');

  // 加载页面左侧和头部菜单
  $('.menu-left-box').load('_menus-left.html', function () {
    $(this).find('.menus-left .item.data-statistics').addClass('current');
  });
  $('.main .menu-top-box').load('_menus-top2.html', function () {
    $(this).find('.menus-top .data-statistics').addClass('current');
    $(this).find('.user-name .txt').text(user);
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
  $('.search input[name=btn-time]').click(function () {
    $(this).addClass('current').parent().siblings('.btn-box').children().removeClass('current');

    // 自定义
    if ($(this).attr('data-value') == TIME_CUSTOM) {
      // 时间选择器 显示
      $('.search .time').css({
        'visibility': 'visible'
      });
      return;
    } else {
      $('.search .time').css({
        'visibility': 'hidden'
      });
    }

    var timeInt = parseInt($(this).attr('data-value'));
    getInventory(getParams(timeInt), showOverview);
    getShelf(getParams(timeInt), showOverview);
    getPersonEfficiency(getParams(timeInt), showOverview);
    getInventoryRisk(getParams(timeInt), showOverview);
  });
  // 选择时间范围
  $('#sDate, #eDate').change(function () {
    getInventory(getParams(TIME_CUSTOM), showOverview);
    getShelf(getParams(TIME_CUSTOM), showOverview);
    getPersonEfficiency(getParams(TIME_CUSTOM), showOverview);
    getInventoryRisk(getParams(TIME_CUSTOM), showOverview);
  });

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
        $('.sec.inventory tr.all .num').text(data.all.num+'个');
        $('.sec.inventory tr.all .money').text('￥' + data.all.money);
        $('.sec.inventory tr.all .pct').text(data.all.avg);

        // 回收
        $('.sec.inventory tr.recovery .num').text(data.hs.num+'个');
        $('.sec.inventory tr.recovery .money').text('￥' + data.hs.money);
        $('.sec.inventory tr.recovery .pct').text(data.hs.avg);
        // 出售
        $('.sec.inventory tr.sale .num').text(data.cs.num+'个');
        $('.sec.inventory tr.sale .money').text('￥' + data.cs.money);
        $('.sec.inventory tr.sale .pct').text(data.cs.avg);
      }
      // 上下架情况
      if (typeStr == 'data_shelf') {
        console.table(data);
        // 合计待售
        $('.sec.shelf .list .to-sale .num').text(data.ds.num+'个');
        $('.sec.shelf .list .to-sale .amount').text('￥' + data.ds.money);
        $('.sec.shelf .list .to-sale .pct').text(data.ds.avg);
        // 今日上架
        $('.sec.shelf .list .day-shelf .num').text(data.sj.num+'个');
        $('.sec.shelf .list .day-shelf .amount').text('￥' + data.sj.money);
        $('.sec.shelf .list .day-shelf .pct').text(data.sj.avg);
        // 今日下架
        $('.sec.shelf .list .day-rm .num').text(data.xj.num+'个');
        $('.sec.shelf .list .day-rm .amount').text('￥' + data.xj.money);
        $('.sec.shelf .list .day-rm .pct').text(data.xj.avg);
        // 今日未上架
        $('.sec.shelf .list .day-nshelf .num').text(data.ws.num+'个');
        $('.sec.shelf .list .day-nshelf .amount').text('￥' + data.ws.money);
        $('.sec.shelf .list .day-nshelf .pct').text(data.ws.avg);
        // 合计未上架
        $('.sec.shelf .list .all-nshelf .num').text(data.wsz.num+'个');
        $('.sec.shelf .list .all-nshelf .amount').text('￥' + data.ws.money);
        $('.sec.shelf .list .all-nshelf .pct').text(data.ws.avg);
      }

      // 人效情况
      if (typeStr == 'data_user') {
        console.table(data);
        // 人均回收
        $('.sec .people .avg .name').text(data.avg_z.num+'个');
        $('.sec .people .avg .money').text('￥' + data.avg_z.money);
        $('.sec .people .avg .percent').text(data.avg_z.avg);
        // 今日最多回收(数量)
        $('.sec .people .max-num .name').text(data.num_one.username);
        $('.sec .people .max-num .top-num').text(data.num_one.num+'个');
        $('.sec .people .max-num .money').text('￥' + data.num_one.money);
        // 今日最多回收(金额)
        $('.sec .people .max-money .name').text(data.money_one.username);
        $('.sec .people .max-money .top-num').text(data.money_one.num+'个');
        $('.sec .people .max-money .money').text('￥' + data.money_one.money);
      }
      // 库存风险情况
      if (typeStr == 'data_zhui') {
        console.table(data);
        // 合计待追回
        $('.sec.risk .data .tobe-re .num').text(data.avg_z.num+'个');
        $('.sec.risk .data .tobe-re .amount').text('￥' + data.avg_z.money);
        $('.sec.risk .data .tobe-re .pct').text(data.avg_z.avg);
        // 今日已追回
        $('.sec.risk .data .day-re .num').text(data.zhui.num+'个');
        $('.sec.risk .data .day-re .amount').text('￥' + data.zhui.money);
        $('.sec.risk .data .day-re .pct').text(data.zhui.avg);
        // 今日被找回
        $('.sec.risk .data .day-back .num').text(data.zhao.num+'个');
        $('.sec.risk .data .day-back .amount').text('￥' + data.zhao.money);
        $('.sec.risk .data .day-back .pct').text(data.zhao.avg);
      }

    }
  };



});