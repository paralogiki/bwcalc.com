$(document).ready(function(){
  var nav= $(".collapse");
  nav.on("click", "a", null, function () {
    nav.collapse('hide');
  });
  $('.navbar-brand').click(function () {
    $('.collapse').collapse('hide');
  });
  $('.btn-do-calc').click(function (e) {
    e.preventDefault();
    doCalc();
    $('#link-bwcalc').click();
    $('#btn-addActivity').show();
    $('#btn-hideActivityList').hide();
    $('#container-activityList').hide();
  });
  $('#btn-addActivity').click(function (e) {
    e.preventDefault();
    $('#btn-addActivity').toggle();
    $('#btn-hideActivityList').toggle();
    $('#container-activityList').toggle();
  });
  $('#btn-hideActivityList').click(function (e) {
    e.preventDefault();
    $('#btn-addActivity').toggle();
    $('#btn-hideActivityList').toggle();
    $('#container-activityList').toggle();
  });
  $('#numDevices').change(function (e) {
    var val = $('#numDevices').val();
    if (!$.isNumeric(val)) {
      $('#numDevices').val('');
    }
    doCalc();
  });
  $('#bwcalc').on('click', '.selectActivity', function (e) {
    e.preventDefault();
    var sel = $(this);
    cost_code = sel.data('code');
    cost_cost = sel.data('cost');
    cost_activity = sel.data('activity');
    addActivity(cost_code, cost_cost, cost_activity);
    //$('#container-addActivity').toggle();
  });
  $('#bwcalc').on('click', '.btn-removeActivity', function (e) {
    e.preventDefault();
    var theParent = $(this).parents('.an_activity');
    theParent.remove();
    doCalc();
  });
  fillActivityList();
});

function doCalc() {
  var bw = 0;
  var activities = $('.an_activity');
  activities.each(function (index) {
    var cost = $(this).find('.activity_cost').html();
    if ($.isNumeric(cost)) bw += parseFloat(cost);
  });
  var devices = $('#numDevices').val();
  if ($.isNumeric(devices)) {
    bw += devices * 0.01;
  }
  $('#bandwidthRequired').html(bw.toFixed(2));
}

// TODO not used
function setDevices(num) {
  var maxId = $('.a_device').length;
  var i = 1;
  if (num < maxId) {
    for (i = maxId; i > num; i--) {
      $('#device_' + i + '-container').remove();
    }
    return;
  }
  if (num == maxId) return;
  var noDevices = 1;
  if (maxId) noDevices = 0;
  for (var i = (maxId + 1); i <= num; i++) {
    newId = i;
    template='<div class="form-group a_device" id="device_' + newId + '-container">' +
      '  <label for="device_' + newId + '">Device #' + newId + '</label>' +
      '  <input type="integer" class="form-control" id="device_' + newId + '" placeholder="Device ' + newId + '">' +
      '</div>';
    if (noDevices) {
      $('#numDevices-container').after(template);
      noDevices = 0;
    } else {
      $('#device_' + (newId - 1)).after(template);
    }
  }
}

function addActivity(cost_code, cost_cost, cost_activity) {
  var maxId = $('.an_activity').length;
  newId = maxId + 1;
  template='<div class="an_activity">' +
    '  <p style="display: none;"><span class="activity_cost">' + cost_cost + '</span></p>' +
    '  <p><button class="btn btn-danger btn-xs btn-removeActivity"><i class="fa fa-remove"></i></button> Selected: ' + cost_code + ' ' + cost_cost + ' ' + cost_activity + '</p>' +
    '</div>';
  $('#container-addActivity').before(template);
  doCalc();
}

// TODO not used
function addActivityOLD() {
  var maxId = $('.an_activity').length;
  newId = maxId + 1;
  template='<div class="form-group an_activity" id="activity_' + newId + '-container">' +
    '  <label for="activity_' + newId + '">Activity #' + newId + '</label>' +
    '  <select class="form-control">' +
    '    <option value="">Select an activity</option>';
  for (var i = 0; i < bwActivities.length; i++) {
    activity = bwActivities[i];
    template = template + '    <option value="' + activity.code + '">' + activity.name + '</option>';
  }
  template = template + '  </select>' +
    '  <span class="help-block">Select an activity from the list above</span>' +
    '</div>';
  $('#container-addActivity').before(template);
}

var bwActivities = [

  {
    code: 'video_stream',
    name: 'Video Streaming',
    description: 'Video streaming includes services such as NetFlix, Amazon Prime, Hulu, HBO Go, Twitch Livestream and many others. Added 1 activity per simultaneous steaming service. Keep in my some services like NetFlix only allow you to stream to 1 or 2 devices at once unless the account is upgraded.',
    costs: {
      sd:
      {
        name: 'Standard Definition Stream',
        description: 'Standard Definition is usually used when streaming to a cell phone or tablet.',
        cost: 3.0
      },
      hd:
      {
        name: 'High Definition Stream',
        description: 'High Definition is usually used when streaming to a Television at 720p or higher.',
        cost: 5.0
      },
      ultrahd:
      {
        name: 'Ultra HD Stream',
        description: 'Ultra HD is rarely used, the requirements are quite extreme.',
        cost: 25.0
      }
    }
  },

  {
    code: 'online_game',
    name: 'Online Multiplayer Game',
    description: 'Online multiplayer games like World of Warcraft, Call of Duty, League of Legends.',
    costs: {
      normal:
      {
        name: 'Normal',
        description: 'Most multi-player game uses the same amount of average bandwidth, in most cases pick this option.',
        cost: 0.025
      },
      high:
      {
        name: 'High',
        description: 'For some reason if you think the bandwidth usage on a game is high, pick this option, 3 time the Normal amount.',
        cost: 0.075
      }
    }
  },

  {
    code: 'web_browsing',
    name: 'Web Browsing',
    description: 'Internet web broswing, surfing the web.',
    costs: {
      low:
      {
        name: 'Low',
        description: 'Typical Internet browsing, frequently sites that do not have a lot of images or videos.',
        cost: 0.1
      },
      normal:
      {
        name: 'Normal',
        description: 'Browsing content heavy sites like news sites or Facebook.',
        cost: 0.5
      },
      heavy:
      {
        name: 'Heavy',
        description: 'Browsing sites that have heavy content, if you are thinking YouTube or something, then utilize a Video Streaming activity instead.',
        cost: 1.0
      }
    }
  },

  {
    code: 'voice_chat',
    name: 'Voice chat',
    description: 'Voice chat includes things like Skype Call (without video), TeamSpeak, Ventrillo.',
    costs: {
      normal:
      {
        name: 'Normal',
        description: 'The amount of users chatting does not have much impact on bandwidth usage.',
        cost: 0.05
      }
    }
  },

  {
    code: 'video_chat',
    name: 'Video chat',
    description: 'Video chat includes things like Skype Video Call, Google Hangout and other webcam based chat software.',
    costs: {
      oneonone:
      {
        name: '1 on 1',
        description: 'Video chat with a single person.',
        cost: 0.5
      },
      conference:
      {
        name: 'Conference',
        description: '3-way conference call',
        cost: 1.0
      }
    }
  },

  {
    code: 'email',
    name: 'Email',
    description: 'Checking and sending emails',
    costs: {
      normal:
      {
        name: 'Normal',
        description: 'A normal amount of email sending and received',
        cost: 0.3
      },
      heavy:
      {
        name: 'Heavy',
        description: 'Sending and receiving hundreds of emails per minute.',
        cost: 1.0
      }
    }
  },

  {
    code: 'server',
    name: 'Server',
    description: 'You have a personal server with various services -- web, email, game hosting.',
    costs: {
      normal:
      {
        name: 'Low Traffic',
        description: 'Your server receives a small amount of traffic at any given time.',
        cost: 0.3
      },
      moderate:
      {
        name: 'Moderate',
        description: 'You host a moderately visited website or game server (for example: MineCraft server).',
        cost: 1.0
      },
      heavy:
      {
        name: 'Heavy',
        description: 'A very heavily visited website or game server.',
        cost: 3.0
      }
    }
  }

];

function fillActivityList() {
  for (var i = 0; i < bwActivities.length; i++) {
    activity = bwActivities[i];
    template = '<p><strong>' + activity.name + ':</strong> ' + activity.description + '</p>';
    for (var costcode in activity.costs) {
      cost = activity.costs[costcode];
      template += '<p><button class="btn btn-success btn-xs selectActivity" data-code="' + costcode + '" data-cost="' + cost.cost +'" data-activity="' + activity.code + '"><i class="fa fa-plus"></i> ' + cost.name + '</button> <button type="button" class="btn btn-default btn-xs en-pop" data-toggle="popover" data-placement="top" title="' + cost.name + '" data-content="' + cost.description + '"><i class="fa fa-question"></i></button></p>';
    }
    template += '<hr>';
    $('#container-activityList').append(template);
  }
  $('.en-pop').popover();
}

//console.log(bwActivities);
