$(function () {
  var token = loadFromLocal('token', 'error');
  var user = loadFromLocal('user_name', 'error');

  // 加载公共顶侧菜单
  $('.drag-box').load('_menus-top.html', function () {
    changeMenuCurrent($(this).find('.item.data-statistics'), '.return-cycle');
    $('.drag-box .user-name').text(user + '，欢迎您~');
  });

  // 控制菜单显示隐藏
  menuHover();

  // 初始化时间选择器
  $('#sDate').dcalendarpicker();
  $('#eDate').dcalendarpicker();

  // 首次获取列表数据
  var requestParam = getRequestParam();
  getDataList(requestParam);

  // 点击搜索
  $('.infos #btn-search').click(function () {
    var requestParam = getRequestParam();
    getDataList(requestParam);
  });

  // 点击刷新
  $('.main .infos .icon-refresh').click(function () {
    // 重置搜索条件
    $('.main .infos')[0].reset();
    resetValue($('.search-list .select-ul[data-event=getKF], .search-list .select-ul[data-event=getGames]'), $('.search-list .select-ul[data-event=getPrice]'));
    var recordParams = getRequestParam();
    getDataList(recordParams);
  });

  // 点击分页器中的每一项
  $('.records .pageWrapper').on('click', '.page', function () {
    var requestParam = getRequestParam();
    requestParam.page = parseInt($(this).attr('data-page'));
    getDataList(requestParam);
  });

  // 分页器, 点击跳转到第几页
  $('.records .pageWrapper').on('click', '.go', function () {
    var requestParam = getRequestParam();
    var nowPage = $(this).siblings('.turn-to').children('input').val();
    if (nowPage != '') {
      nowPage = parseInt(nowPage);
      requestParam.page = nowPage;
      getDataList(requestParam);
    }
  });


  // 获取请求列表数据需要的参数
  function getRequestParam() {
    var params = {
      a: 'data_log',
      token: token
    }
    var sTime = $("#sDate").val();
    var eTime = $("#eDate").val();
    var kfId = parseInt($('.search-list .kfList').attr('data-selected'));
    var goodId = $.trim($('#good-id').val());
    var logType = parseInt($('.search-list .logType').attr('data-selected'));
    var goodStatus = parseInt($('.search-list .goodStatus').attr('data-selected'));
    var gameAccount = $.trim($('#game-account').val());

    params.cid = kfId;


    if (sTime != '') {
      sTime = new Date(sTime);
      sTime = parseInt(sTime.getTime() / 1000);
      params.stime = sTime;
    }
    if (eTime != '') {
      eTime = new Date(eTime);
      eTime = parseInt(eTime.getTime() / 1000);
      params.etime = eTime + 24 * 60 * 60;
    }

    if (goodId != '') {
      params.gid = goodId;
    }

    console.log('列表参数');
    console.table(params);
    return params;
  }

  // 获取数据列表
  function getDataList(params) {
    $.post(HTTP_SERVERNAME + '/worksystem/statistical.php', params, function (data, status) {
      checkToken(data.code);
      var code = data.code;
      if (code == 0) {
        // showRecordsNum($('.infos .num-box .account'), data.param.cont);
        // showRecordsNum($('.infos .num-box .money'), data.param.price);
        var records = data.param.list;
        if (records) {
          $('.records tbody').html('');
          records.forEach(function (val, index) {
            var htmlStr = getTemplate('#recordRow', {
              recordId: val.id,
              kfId: val.yx_name,
              goodId: val.money,
              account: val.account,
              rKf: val.uname,
              rTime: timeToDate(val.ctime),
              aKf: val.username,
              aTime: timeToDate(val.shtime),
              payAccount: val.tkfs,
              payUser: val.name
            });
            $('.records tbody').append(htmlStr);
          });
          var pager = getPages(parseInt(data.param.cont), requestParam.page, 10)
          $('.records .pageWrapper').html(pager);
        }
        if ($('.search-list .priceList').children().length == 0) {
          if (data.param.money) {
            getPrices(data.param.money, $('.search-list .priceList'));
          }
        }
      }
      if (code == 400) {
        alert(data.msg);
      }
    }, 'json');
  }

  
});