// 获取游戏分类
function getGameList(token, typeInt, listDom, hasAll) {
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
        var htmlStr = hasAll == true ? '<li class="current" data-value="0">全部</li>' : '';
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