(function () {
  // global vars
  var hotSpotWidth = 30;
  var spotId = 0;
  var form = $('#toolTipGenerator form');
  var image = $('#toolTipGenerator .image');

  var imageOffsetTop = $(image).offset().top;
  var imageOffsetLeft = $(image).offset().left;

  var hotSpots = [];

  var selectedSpot;
  var moving = false;

  init();

  function init() {

    disableForm();
    formActions();
    $(image).on('mousedown', function (e) {
      if ($(e.target).hasClass('t_hotSpot')) {
        hotSpots[$(e.target).attr('id').replace('t_hotspot_', '')].select();
      } else {
        if (selectedSpot) {
          selectedSpot.deselect();
        } else {
          drawHotSpot(e);
        }
      }
    });
  }

  function drawHotSpot(e) {

    var x = e.pageX;
    var y = e.pageY;
    var relativeToImageTop = y - imageOffsetTop;
    var relativeToImageLeft = x - imageOffsetLeft;


    // alert(e.pageX)
    // alert(relativeToImageLeft)
    // alert($("#user_image").width())
    // alert(window.innerWidth)
    // alert(parseInt(relativeToImageLeft) * 100 / $("#user_image").width())
    // alert(parseInt(relativeToImageTop) * 100 / $("#user_image").height())
    var x_percentage = parseInt(relativeToImageLeft) * 100 / $("#user_image").width();
    var y_percentage = parseInt(relativeToImageTop) * 25 / $("#user_image").height();
    //xPercent = parseInt(e.pageX / window.innerWidth * 100);
    var hotSpot = new HotSpot(x_percentage, y_percentage, $(image));
    hotSpot.init();
    hotSpots.push(hotSpot);
  }
  function disableForm() {
    $(form).find('input, select, textarea').attr('disabled', 'disabled');
  }
  function enableForm() {
    $(form).find('input, select, textarea').removeAttr('disabled');
  }

  function applySettingToSpot(id) {

    $('#' + id).on('change', function () {
      if (selectedSpot) {
        selectedSpot.settings[id] = $(this).val();
        selectedSpot.applySettings();
      }
    });
  }
  function formActions() {
    applySettingToSpot('t_spotType');
    applySettingToSpot('t_spotSize');
    applySettingToSpot('t_spotColor');
    $('#t_toolTipWidth').on('change', function () {
      if (selectedSpot) {
        if ($('#t_toolTipWidthAuto')[0].checked) {
          $('#t_toolTipWidthAuto').click();
        }
        selectedSpot.settings['t_toolTipWidth'] = parseInt($(this).val());
        selectedSpot.applySettings();
      }
    });
    $('#t_toolTipWidthAuto').on('change', function () {
      if (selectedSpot) {

        if ($(this)[0].checked) {
          selectedSpot.settings['t_toolTipWidthAuto'] = true;
        } else {
          selectedSpot.settings['t_toolTipWidthAuto'] = false;
        }
        selectedSpot.applySettings();
      }
    });
    $('#t_toolTipVisible').on('change', function () {
      if (selectedSpot) {
        if ($(this)[0].checked) {
          selectedSpot.settings['t_toolTipVisible'] = true;
        } else {
          selectedSpot.settings['t_toolTipVisible'] = false;
        }
        selectedSpot.applySettings();
      }
    });
    applySettingToSpot('t_popupPosition');
    applySettingToSpot('tag_products');
    applySettingToSpot('t_content');
    $('#t_content').on('keyup', function () {
      if (selectedSpot) {
        selectedSpot.settings['t_content'] = $(this).val();
        selectedSpot.applySettings();
      }
    });
    $('#t_deleteSpot').on('click', function () {
      if (selectedSpot) {
        selectedSpot.delete();
      }
    });
  }
  function applySpotSettingsToForm() {
    var settings = selectedSpot.settings;

    for (var i in settings) {
      $('#' + i).val(settings[i]);
    }
    if (selectedSpot.settings['t_toolTipWidthAuto']) {
      $('#t_toolTipWidthAuto').attr('checked', 'checked');
    } else {
      $('#t_toolTipWidthAuto').removeAttr('checked');
    }
  }
  function getFinalSetting() {
    var settings = selectedSpot.settings;
  }


  function HotSpot(x, y, parent) {
    this.parent = parent;
    this.id = spotId;
    this.x = x;
    this.y = y;

    this.html = '<div class="t_hotSpot" id="t_hotspot_' + this.id + '"><div class="t_tooltip_content_wrap"><div class="t_tooltip_content"></div></div></div>';
    this.root = '';

    this.settings = {
      "t_spotType": "circle"
      , "t_spotSize": "small"
      , "t_spotColor": "red"
      , "t_popupPosition": "left"
      , "tag_products": "0"
      , "t_toolTipVisible": false
      , "t_content": ""
      , "t_toolTipWidth": 200
      , "t_toolTipWidthAuto": true
    };

    spotId++;

  }



  HotSpot.prototype.init = function () {

    this.parent.append(this.html);
    this.root = $('#t_hotspot_' + this.id).draggable({ containment: "parent" });

    this.root.css({ "left": this.x + "%", "top": this.y + "%" });

    this.applySettings();

  };

  HotSpot.prototype.select = function () {

    $('.t_hotSpot.selected').removeClass('selected');
    this.root.addClass('selected');

    this.root.find('.t_tooltip_content_wrap').css({ opacity: 1 });
    selectedSpot = this;
    applySpotSettingsToForm();
    enableForm();
  };
  HotSpot.prototype.deselect = function () {
    $('.t_hotSpot.selected').removeClass('selected');

    this.root.find('.t_tooltip_content_wrap').css("opacity", "");

    selectedSpot = null;
    disableForm();
  };
  HotSpot.prototype.delete = function () {
    this.deselect();
    this.root.remove();

    hotSpots[this.id] = null;
  };

  HotSpot.prototype.applySettings = function () {

    this.root.removeClass('circle').removeClass('square').removeClass('circleOutline').removeClass('squareOutline').removeClass('small').removeClass('medium').removeClass('large').removeClass('red').removeClass('green').removeClass('blue').removeClass('purple').removeClass('pink').removeClass('orange');

    var wrap = this.root.find('.t_tooltip_content_wrap');
    wrap.removeClass('top').removeClass('left').removeClass('bottom').removeClass('right');


    this.root.addClass(this.settings['t_spotType']);
    this.root.addClass(this.settings['t_spotSize']);
    this.root.addClass(this.settings['t_spotColor']);
    wrap.addClass(this.settings['t_popupPosition']);
    wrap.addClass(this.settings['tag_products']);
    wrap.find('.t_tooltip_content').html(this.settings['t_content']);

    wrap.removeClass('alwaysVisible');
    if (this.settings['t_toolTipVisible']) {
      wrap.addClass('alwaysVisible')
    }

    if (!this.settings['t_toolTipWidthAuto']) {
      wrap.css({ 'width': this.settings['t_toolTipWidth'] }).addClass('specificWidth');
    } else {
      wrap.css({ 'width': 'auto' }).removeClass('specificWidth');
    }

  };
})();