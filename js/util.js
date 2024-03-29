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


    /**
     * 分页代码
     * @param {int} total 总共多少条数据
     * @param {int} pindex 当前第几页
     * @param {int} psize 每页多少条
     * return {string} Html
     */
    function getPages(total, pindex, psize) {
      var totalPage = Math.ceil(total / psize);
      if (totalPage == 1 || totalPage == 0) {
        return "";
      }

      var pagerHtml = '<div class="paginator">';
      //判断是否有上一页
      if (pindex > 1) {
        var page = pindex - 1;
        pagerHtml += '<span class="page ilbk prev" data-page="' + page + '">上一页</span>';
      }

      if (totalPage <= 5) {
        for (var i = 1; i <= totalPage; i++) {
          var html = '<span class="page ilbk" data-page="' + i + '">' + i + '</span>';
          if (i == pindex) {
            html = '<span class="page ilbk current" data-page="' + i + '">' + i + '</span>';
          }
          pagerHtml += html;
        }
      } else {
        var startPage = pindex - 1;
        var endPage = pindex + 4;

        // 如果结束大于总页码
        if (endPage >= totalPage) {
          endPage = totalPage;
          startPage = totalPage - 4;
        }

        //循环已知页码
        for (var i = startPage; i <= endPage; i++) {
          var html = '';
          if (i > 0) {
            html = '<span class="page ilbk" data-page="' + i + '">' + i + '</span>';
          }
          if (i == pindex) {
            html = '<span class="page ilbk current" data-page="' + i + '">' + i + '</span>';
          }
          pagerHtml += html;
        }

        //表示后面还有页码
        if (endPage < totalPage) {
          pagerHtml += '<span class="ellipsis ilbk">...</span>';
        }
      }

      //判断是否有下一页
      if (pindex < totalPage) {
        var page = pindex + 1;
        pagerHtml += '<span class="page ilbk next" data-page="' + page + '">下一页</span>';
      }

      //共多少页
      pagerHtml += '<div class="all ilbk">共<span class="num cr10">' + totalPage + '</span> 页，</div>';

      //跳转到第几页
      pagerHtml += '<div class="ilbk turn-to">转到第<input class="ct cr6" type="text" name="turn-to" value="" />页</div>';
      pagerHtml += '<div class="ilbk go"><i class="ilbk iconz icon-arrow-right"></i></div>';
      pagerHtml += "</div>";

      return pagerHtml;
    }

    /**
     * 时间戳转日期
     */
    function timeToDate(timeInt) {
      var timeInt = parseInt(timeInt);
      var date = new Date(timeInt * 1000);
      return date.getFullYear() + "-" +
        (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " +
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" +
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":" +
        (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
    }

    function timeToDay(timeInt) {
      var timeInt = parseInt(timeInt);
      var date = new Date(timeInt * 1000);
      return date.getFullYear() + "/" +
        (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "/" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
    }


    // 获取本月第一天
    function currentMonthFirst () {
      var date = new Date();
      date.setDate(1);
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      var date2 = new Date(year, month, day, 0);
      date2 = parseInt(date2.getTime() / 1000);
      date2 = timeToDay(date2);
      return date2;
    }

    // 获取本月最后一天
    function currentMonthLast() {
      var date = new Date();
      var date2 = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
      date2.setDate(0);
      date = new Date(date.getFullYear(), date.getMonth(), date2.getDate(), 0);
      date = parseInt(date.getTime() / 1000);
      date = timeToDay(date);
      return date;
    }