/**
 * 获取游戏分类
 * @param {} token 
 * @param {游戏类型} typeInt 
 * @param {容纳数据的父元素} listDom 
 * @param {有数据时执行的回调} callback1 
 * @param {无数据时执行的回调} callback2 
 */
function getGameList(token, typeInt, listDom, callback1, callback2) {
  var params = {
    a: 'get_yxlist',
    token: token,
    ctype: typeInt
  }

  $.post(HTTP_SERVERNAME + '/worksystem/statistical.php', params, function (data, status) {
    var code = data.code;
    checkToken(code);
    if (code == 0) {
      var list = data.param;
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
        callback1();
      } else {
        resetSelect(listDom, '', '');
        listDom.empty();
        callback2();
      }

    }
  }, 'json');
}

// 获取游戏名字并填充到下拉列表中
function getGames(token, listDom, hasAll) {
  $.get(HTTP_SERVERNAME + '/worksystem/main.php', {
    a: "yx_list",
    token: token
  }, function (data) {
    var code = data.code;
    checkToken(code);
    if (code == 0) {
      var recordList = data.param;
      var htmlStr = hasAll == true ? '<li class="current" data-value="0">全部</li>' : '';
      recordList.forEach(function (val, index) {
        htmlStr += getTemplate("#gameRow", {
          gameId: val.yx_id,
          gameName: val.yx_name,
        });
      });
      listDom.html(htmlStr);
      // 默认选中第一个
      liSelected($('.content .statistics .gameList li').first());
    } else {
      resetSelect(listDom, '', '');
      listDom.empty();
    }
    if (data.code == 400) {
      alert(data.msg);
    }
  }, "JSON");
}

// 获取交易客服
function getDealkF(token, listDom, hasAll) {
  var params = {
    a: 'get_jyry',
    token: token
  }
  $.post(HTTP_SERVERNAME + '/worksystem/gmaccount.php', params, function (data, status) {
    var code = data.code;
    if (code == 0) {
      var kfList = data.param;
      if (kfList) {
        var htmlStr = hasAll == true ? '<li class="current" data-value="0">全部</li>' : '';
        kfList.forEach(function (val, index) {
          htmlStr += getTemplate('#kfRow', {
            kfId: val.user_id,
            kfName: val.username
          });
        });
        listDom.html(htmlStr);
      }
    }
  }, 'json');
}


// 获取库存数量
function getInventory(dataObj, callbackS) {
  var params = {
    a: 'index'
  }
  Object.assign(params, dataObj);

  $.post(HTTP_SERVERNAME2 + '/worksystem/statistical.php', params, function (data) {
    checkToken(data.code)
    if (data.code == 0) {
      callbackS(data.param, params.a);
    } else {
      alert(data.msg);
    }
  }, 'json');
}

// 获取上下架情况
function getShelf(dataObj, callbackS) {
  var params = {
    a: 'data_shelf'
  }
  Object.assign(params, dataObj);

  $.post(HTTP_SERVERNAME2 + '/worksystem/statistical.php', params, function (data) {
    checkToken(data.code)
    if (data.code == 0) {
      callbackS(data.param, params.a);
    } else {
      alert(data.msg);
    }
  }, 'json');
}

// 获取人效情况
function getPersonEfficiency(dataObj, callbackS) {
  var params = {
    a: 'data_user'
  }
  Object.assign(params, dataObj);
  
  $.post(HTTP_SERVERNAME2 + '/worksystem/statistical.php', params, function (data) {
    checkToken(data.code)
    if (data.code == 0) {
      callbackS(data.param, params.a);
    } else {
      alert(data.msg);
    }
  }, 'json');
}

// 获取库存风险情况
function getInventoryRisk(dataObj, callbackS) {
  var params = {
    a: 'data_zhui'
  }
  Object.assign(params, dataObj);

  $.post(HTTP_SERVERNAME2 + '/worksystem/statistical.php', params, function (data) {
    checkToken(data.code)
    if (data.code == 0) {
      callbackS(data.param, params.a);
    } else {
      alert(data.msg);
    }

  }, 'json');

  
};