
function setElementTitleById(id, text) {
  $('#'+id).attr('title',text);
};
function dom_notify(msg) {
  $('#notify').text(msg);
  $('#notify').fadeIn();
  setTimeout(function() {
    $('#notify').fadeOut
    ();
  }, 2000);
};

function stream(dom_id, txid, cssclass) {
  var base = "<%= EXTERNAL_TX_URL %>";
  // var ref = 'http://localhost:5000/api/v0/transactions/'+txid;
  var ref = base + txid
  d = new Date();
  trid = txid.substring(0,10);
  var newrow = '<tr id="'+trid+'" class="'+cssclass+'"><td><a href='+ref+' target="_blank">'+txid+'</a></td><td class="stream_time">[ '+d+' ]</td></tr>';
  $('#'+dom_id+' tr:last').fadeOut(2000);
  setTimeout(function() {
    $('#'+dom_id+' tr:last').remove();
  }, 2000); 
  setTimeout(function() {
    $('#'+dom_id+' tr:nth-child(2)').before(newrow);
    $('#'+dom_id+' tr:nth-child(2)').hide();
    $('#'+dom_id+' tr:nth-child(2)').fadeIn(1500);
  }, 1000);
};

function addCssClass(dom_id, class_name) {
  $('#'+dom_id).addClass(class_name);    
};

function changeCssClass(dom_id, old_class_name, new_class_name) {
  $('#'+dom_id).removeClass(old_class_name).addClass(new_class_name);
};

function addNewlineToElementTitleById(id, text_to_add) { 
  var e = $('#'+id).attr('title');
  e = trim_extra_lines(e,10); 
  $('#'+id).attr('title',text_to_add+'\x0A'+e);
};

function markCredit(dom_id, transition_time, duration) {
  // var original_bgd_color = $('#'+dom_id).css('backgroundColor');
  var original_bgd_color = $('#'+dom_id).attr('parity') == 1 ? '#D1E0E0': 'white';
  $('#'+dom_id).animate({backgroundColor: '#5CD65C', color: 'white'}, transition_time, 'linear').delay(duration);
  $('#'+dom_id).animate({backgroundColor: original_bgd_color, color: '#333'}, transition_time, 'linear');
  $('#'+dom_id + ' table tr td').animate({color: 'red'}, transition_time*2, 'linear');
};

function markDebit(dom_id, transition_time, duration) {
  // var original_bgd_color = $('#'+dom_id).css('backgroundColor');
  var original_bgd_color = $('#'+dom_id).attr('parity') == 1 ? '#D1E0E0': 'white';
  $('#'+dom_id).animate({backgroundColor: '#FF4D4D', color: 'white'}, transition_time, 'linear').delay(duration);
  $('#'+dom_id).animate({backgroundColor: original_bgd_color, color: '#333'}, transition_time, 'linear');
  $('#'+dom_id + ' table tr td').animate({color: 'red'}, transition_time*2, 'linear');
};

function trim_extra_lines(string, max_lines){
  array = string.split('\x0A');
  array.pop();
  l = array.length;
  if (l > max_lines) {
    for (var i = 0; i < l-max_lines; i++) {
      array.pop();
    };
    return array.join();
  } else {
    return string;
  };

  // if(string.lastIndexOf("\x0A")>0) {
  //   return string.substring(0, string.lastIndexOf("\x0A"));
  // } else {
  //   return string;
  // }
};
function updateBalance(dom_id, confirmed, unconfirmed, color){
  $('#'+dom_id+' td#confirmed_'+dom_id).animate({opacity: 0},250, 'linear');
  $('#'+dom_id+' td#unconfirmed_'+dom_id).animate({opacity: 0},250, 'linear');
  setTimeout(function() {
    $('#'+dom_id+' td#confirmed_'+dom_id).html(confirmed);
    $('#'+dom_id+' td#unconfirmed_'+dom_id).html(unconfirmed);
    $('#'+dom_id+' td#confirmed_'+dom_id).css('color',color);
    $('#'+dom_id+' td#unconfirmed_'+dom_id).css('color',color);    
    $('#'+dom_id+' td#confirmed_'+dom_id).animate({opacity:1}, 250, 'linear');
    $('#'+dom_id+' td#unconfirmed_'+dom_id).animate({opacity:1}, 250, 'linear');
  }, 500);
  // setTimeout(function() {
  //   $('#'+dom_id+' td#balance_'+dom_id).animate({color: '#333'}, 2000, 'linear');
  // }, 5000);
  // $('td#balance_'+dom_id).attr('title','Confirmed Balance: '+parseInt(confirmed)+'\x0A'+'Unconfirmed Balance: '+parseInt(unconfirmed)+'\x0A');  
};