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

// 是否展开下拉列表
function showSlectUlRight(selectBox, showBoxWidth, showBoxHeight, showBox, icon, speed) {
  if (showBox.is(':visible')) {
    showBox.animate({
      left: '0px',
      display: 'none'
    }, 200);
    selectBox.removeClass('focus');
    icon.removeClass('icon-arrow-left').addClass('icon-arrow-right');
  } else {
    showBox.animate({
      left: showBoxWidth + 'px',
      display: 'block',
      marginTop: -(showBoxHeight/2) + 'px'
    }, 200);
    selectBox.addClass('focus');
    icon.removeClass('icon-arrow-right').addClass('icon-arrow-left');
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