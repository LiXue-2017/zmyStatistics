// 获取游戏分类
function getGameList(token, typeInt, listDom, hasAll){
  var params = {
    a: 'get_yxlist',
    token: token,
    ctype: typeInt
  }

  $.post(HTTP_SERVERNAME + '/worksystem/statistical.php', params, function (data, status) {
    var code = data.code;
    // checkToken(code);
    if (code == 0) {
      var kfList = data.param;
      if (kfList) {
        if(hasAll) {
          var htmlStr = '<li class="current" data-value="0">全部</li>';
        } else {
          var htmlStr = '';
        }
        kfList.forEach(function (val, index) {
          htmlStr += getTemplate('#gameRow', {
            kfId: val.user_id,
            kfName: val.username
          });
        });
        listDom.html(htmlStr);
      }
    }
  }, 'json');

}