    // 获取html模板
    function getTemplate(templateElement, param) {
      var html = $(templateElement).html();
      var regTest = new RegExp('{([a-zA-Z]+)}', "igm");
      html = html.replace(regTest, function (note, key) {
        return param[key];
      });
      return html;
    };

    // 设置数据存储
    function saveToLocal(key, val) {
      var account = window.localStorage.__account__;
      if (!account) {
        account = {};
      } else {
        account = JSON.parse(account);
      }

      account[key] = val;
      account = JSON.stringify(account);
      window.localStorage.__account__ = account;
    }

    // 读取数据存储
    function loadFromLocal(key, def) {
      var account = window.localStorage.__account__;
      if (!account) {
        return def;
      } else {
        account = JSON.parse(account);
        if (!account[key]) {
          return def;
        }
        var val = account[key];
        return val;
      }
    }