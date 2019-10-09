$(function () {
  var token = loadFromLocal('token', 'error');
  var user = loadFromLocal('user_name', 'error');

  // 加载公共顶侧菜单
  $('.drag-box').load('_menus-top.html', function () {
    changeMenuCurrent($(this).find('.item.log'));
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

  // 获取所有客服
  getAllKf();

  // 首次获取列表数据
  var requestParam = getRequestParam();
  getDataList(requestParam);

  // 下拉框点击事件  
  $('.infos .select-box .select-text').click(function (e) {
    isShowSlectUl($(this).siblings('.select-ul'), 200);
  });
  $('.infos .select-box .select-ul').on('click', 'li', function () {
    isShowSlectUl($(this).parent('.select-ul'), 200);
    liChangeStyle($(this));
  });


  // 点击搜索
  $('.infos #btn-search').click(function () {
    var requestParam = getRequestParam();
    getDataList(requestParam);
  });

  // 点击刷新
  $('.main .infos .icon-refresh').click(function () {
    // 重置搜索条件
    $('.main .infos')[0].reset();
    resetSelect($('.search-list .kfList'), '全部', '0');
    resetSelect($('.search-list .logType, .search-list .goodStatus'), '全部', '-999');
    // 时间默认当月第一天到当月最后一天
    $("#sDate").val(currentMonthFirst());
    $("#eDate").val(currentMonthLast());

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
      token: token,
      page: 1,
    }

    var sTime = $("#sDate").val();
    var eTime = $("#eDate").val();
    var kfId = parseInt($('.search-list .kfList').attr('data-selected'));
    var logType = parseInt($('.search-list .logType').attr('data-selected'));
    var goodStatus = parseInt($('.search-list .goodStatus').attr('data-selected'));
    var goodId = $.trim($('#good-id').val());
    var gameAccount = $.trim($('#game-account').val());

    params.cid = kfId,
      params.ltype = logType,
      params.gtype = goodStatus;

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
      params.gid = parseInt(goodId);
    }
    if (gameAccount != '') {
      params.acc = gameAccount;
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
        showRecordsNum($('.infos .num-box .number'), data.param.cont);
        var records = data.param.list;
        if (records) {
          $('.records tbody').html('');
          records.forEach(function (val, index) {
            var htmlStr = getTemplate('#recordRow', {
              recordId: val.id,
              kfName: val.username,
              goodId: val.goods_id,
              logType: val.ltype,
              doStatus: val.gStatus,
              account: val.acc,
              ip: val.ip,
              time: timeToDate(val.ctime),
              content: val.content
            });
            $('.records tbody').append(htmlStr);
          });
          var pager = getPages(parseInt(data.param.cont), params.page, 50);
          $('.records .pageWrapper').html(pager);
        }
        // 商品状态
        var status = data.param.gtype;
        if (status && $('.search-list .goodStatus').children().length == 0) {
          // $('.search-list .goodStatus').empty();
          var htmlStr = '<li class="current" data-value="-999">全部</li>';
          for (var i in status) {
            htmlStr += getTemplate('#typeRow', {
              id: i,
              value: status[i]
            });
          }
          $('.search-list .goodStatus').append(htmlStr);
        }

        //日志类型 
        var logType = data.param.ltype;
        console.log($('.search-list .logType').children().length == 0);
        if (logType && $('.search-list .logType').children().length == 0) {
          // $('.search-list .logType').empty();
          var htmlStr = '<li class="current" data-value="-999">全部</li>';
          for (var i in logType) {
            htmlStr += getTemplate('#typeRow', {
              id: i,
              value: logType[i]
            });
          }
          $('.search-list .logType').append(htmlStr);

        }

      }
      if (code == 400) {
        alert(data.msg);
      }
    }, 'json');
  }

  // 获取所有客服
  function getAllKf() {
    var params = {
      a: 'get_userlist',
      token: token
    }

    $.post(HTTP_SERVERNAME + '/worksystem/statistical.php', params, function (data, status) {
      checkToken(data.code);
      var code = data.code;
      if (code == 0) {
        var records = data.param;
        if (records) {
          var htmlStr = '<li class="current" data-value="0">全部</li>';
          records.forEach(function (val, index) {
            htmlStr += getTemplate('#kfRow', {
              kfId: val.user_id,
              kfName: val.username
            });
          });
          $('.search-list .kfList').append(htmlStr);

        }
      }
    }, 'json');

  }

});