// 菜单选择的样式变化
function changeMenuCurrent(menuItem, subItemClass) {
  menuItem.addClass('current').siblings().removeClass('current');
  if (subItemClass != '') {
    menuItem.find(subItemClass).addClass('current').siblings().removeClass('current');
  }
  menuItem.siblings().find('.current').removeClass('current');
}

// 页面顶部菜单事件
function menuHover() {
  $('.drag-box').on('mouseover', '.menus-top .item:has(.submenu)', function () {
    $(this).find('.submenu').show();
  });
  $('.drag-box').on('mouseout', '.menus-top .item:has(.submenu)', function (e) {
    var submenu = $(this).find('.submenu');
    var maxOffsetX = submenu.offset().left + submenu.width();
    var maxOffsetY = submenu.offset().top + submenu.height();
    if (e.pageX > submenu.offset().left && e.pageX < maxOffsetX && e.pageY < maxOffsetY) {
      submenu.show();
    } else {
      submenu.hide();
    }
  });
}

// 重置下拉框
function resetSelect(selectUlDom, selectTxt, dataSelected) {
  selectUlDom.each(function () {
    selectUlDom.siblings('.select-text').text(selectTxt);
    selectUlDom.attr('data-selected', dataSelected);
    if (dataSelected != '') {
      selectUlDom.find('li[data-value=' + dataSelected + ']').addClass('current').siblings().removeClass('current');
    } else {
      selectUlDom.children('li').removeClass('current');
    }
  });
}

// 往右展开下拉框
function showSlectRight(selectBox, icon, speed) {
  var showBox = selectBox.children('.select-ul');
  var showBoxWidth = showBox.innerWidth();
  // 下拉展开框可见时
  if (showBox.is(':visible')) {
    showBox.animate({
      opacity: '0',
      left: '50%',
    }, speed, function () {
      $(this).css({
        display: 'none',
        left: '50%',
      });
      selectBox.removeClass('focus');
      icon.removeClass('icon-arrow-left').addClass('icon-arrow-right');
    });
  } else { // 下拉展开框不可见时 ，让其可见
    showBox.animate({
      left: showBoxWidth + 4,
      opacity: 1,
    }, speed, function () {
      showBox.css({
        display: 'block',
        left: showBoxWidth + 4,
      });
      selectBox.addClass('focus');
      icon.removeClass('icon-arrow-right').addClass('icon-arrow-left');
    });
  }
}

// 往下展开下拉框
function showSlectBottom(selectBox, icon, speed) {
  var showBox = selectBox.children('.select-ul');
  var showBoxHeight = showBox.innerHeight();
  if (showBox.is(':visible')) {
    showBox.animate({
      opacity: 0,
      bottom: '50%',
    }, speed, function () {
      $(this).css({
        display: 'none',
        bottom: '50%',
      });
      selectBox.removeClass('focus');
      icon.removeClass('icon-arrow-up').addClass('icon-arrow-down');
    });
  } else { // 下拉展开框不可见时 ，让其可见
    showBox.animate({
      opacity: 1,
      bottom: -(showBoxHeight + 4),
    }, speed, function () {
      showBox.css({
        display: 'block',
        bottom: -(showBoxHeight + 4),
      });
      selectBox.addClass('focus');
      icon.removeClass('icon-arrow-down').addClass('icon-arrow-up');
    });
  }
}

// 点击下拉框某项
function liChangeStyle(liDom) {
  liDom.addClass('current').siblings().removeClass('current');
  liDom.parent().siblings('.select-text').text(liDom.text());
  liDom.parent().attr('data-selected', liDom.attr('data-value'));
  if (liDom.parent().attr('data-event') == 'getPrice') {
    liDom.parent().attr('data-selected', liDom.text());
  }
}

// 检查token状态
function checkToken(code) {
  if (code == 1200) {
    alert('登录已过期，请重新登录！');
    window.location.href = '../index.html';
    return;
  }
}

// 设置下拉框选中某项
function liSelected(liDom) {
  liDom.addClass('current').siblings().removeClass('current');
  liDom.parent().siblings('.select-text').text(liDom.text());
  liDom.parent().attr('data-selected', liDom.attr('data-value'));
}

// 显示共多少数据
function showRecordsNum(el, num) {
  el.text(num);
}

function isShowSlectUl(showBox, speed) {
  if (showBox.is(':visible')) {
    showBox.slideUp(speed);
    showBox.parent('.select-box').removeClass('focus');
    showBox.siblings('.iconz').removeClass('icon-arrow-up').addClass('icon-arrow-down');
  } else {
    showBox.slideDown(speed);
    showBox.parent('.select-box').addClass('focus');
    showBox.siblings('.iconz').removeClass('icon-arrow-down').addClass('icon-arrow-up');
  }
}
