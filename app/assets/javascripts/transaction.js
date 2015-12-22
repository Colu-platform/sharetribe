window.ST = window.ST || {};

window.ST.transaction = window.ST.transaction || {};

(function(module, _) {

  function toOpResult(submitResponse) {
    if (submitResponse.op_status_url) {
      return ST.utils.baconStreamFromAjaxPolling(
        { url: submitResponse.op_status_url },
        function(pollingResult) {
          return pollingResult.completed;
        }
      ).flatMap(function (pollingResult) {
        var opResult = pollingResult.result;
        if (opResult.success) {
          return opResult;
        }
        else {
          return new Bacon.Error({ errorMsg: submitResponse.op_error_msg });
        }
      });
    } else {
      return new Bacon.Error({ errorMsg: submitResponse.error_msg });
    }
  }


  function setupSpinner($form) {
    var spinner = new Image();
    spinner.src = "https://s3.amazonaws.com/sharetribe/assets/ajax-loader-grey.gif";
    spinner.className = "paypal-button-loading-img";
    var $spinner = $(spinner);
    $form.find(".paypal-button-wrapper").append(spinner);
    $spinner.hide();

    return $spinner;
  }

  function toggleSpinner($spinner, show) {
    if (show === true) {
      $spinner.show();
    } else {
      $spinner.hide();
    }
  }


  function redirectFromOpResult(opResult) {
    window.location = opResult.data.redirect_url;
  }

  function showErrorFromOpResult(opResult) {
    ST.utils.showError(opResult.errorMsg, "error");
  }


  function initializePayPalBuyForm(formId) {
    var $form = $('#' + formId);
    var formAction = $form.attr('action');
    var $spinner = setupSpinner($form);

    // EventStream of true/false
    var submitInProgress = new Bacon.Bus();

    var formSubmitWithData = $form.asEventStream('submit', function(ev) {
      ev.preventDefault();
      return $form.serialize();
    })
      .filter(submitInProgress.not().toProperty(true)); // Prevent concurrent submissions

    var opResult = formSubmitWithData
      .flatMapLatest(function (data) { return Bacon.$.ajaxPost(formAction, data); })
      .flatMapLatest(toOpResult);

    submitInProgress.plug(formSubmitWithData.map(true));
    // Success response to operation keeps submissions blocked, error releases
    submitInProgress.plug(opResult.map(true).mapError(false));
    submitInProgress.skipDuplicates().onValue(_.partial(toggleSpinner, $spinner));

    opResult.onValue(redirectFromOpResult);
    opResult.onError(showErrorFromOpResult);
  }

  function initializeCreatePaymentPoller(opStatusUrl, redirectUrl) {
    ST.utils.baconStreamFromAjaxPolling(
      { url: opStatusUrl },
      function(pollingResult) {
        return pollingResult.completed;
      }
    ).onValue(function () { window.location = redirectUrl; });
  }

  var initialBalance=-1;
  var increment =0;
  var iterations = 40;
  var waitMiliseconds = 3000;

  function waitForPrice(address,asset_id,price) {      
      var checkBalanceUrl = 'http://testnet.api.coloredcoins.org/v3/addressinfo/'+address;
      var asset_id = asset_id;
      var price = price;
      var balance = balance;
      var req = $.ajax({
          type: "GET", url: checkBalanceUrl,
          crossDomain: true,
          xhrFields: {
              withCredentials: false
          },
          timeout: 10000,
          success: function (response) {
            var currentBalance = extractBalance(response,address,asset_id);
            if (initialBalance<0) {
              initialBalance = currentBalance;
              alert('You have 2 minutes to pay');
            };
            setTimeout(
              function(){
                if (increment >= iterations) {
                  alert('Payment period timed out, please refresh the page to try again');
                  return
                } else {
                  if (parseInt(currentBalance) < parseInt(initialBalance)+parseInt(price)) {
                    waitForPrice(address,asset_id,price)
                  } else {
                    alert('Your payment was received, Thank you!');
                    return 
                  };                  
                }
              }
            , waitMiliseconds);            
          },
          error: function (ajaxContext,response) {
            alert('error'+response);
          }
      });
  }

  function extractBalance(response,address,asset_id){
    // console.log('response', JSON.stringify(response));
    var assets = response['utxos'].map(function(u){return u['assets']});
    // console.log('assets', JSON.stringify(assets));
    relevant_assets = [].concat.apply([], assets).filter(function(e){return e['assetId']==asset_id});
    amounts = relevant_assets.map(function(u) {return u['amount']});
    return amounts.reduce(function(a,b){return a+b});    
  }

  function initializeFreeTransactionForm(locale) {
    window.auto_resize_text_areas("text_area");
    $('textarea').focus();
    var form_id = "#transaction-form";
    $(form_id).validate({
      rules: {
        "message": {required: true}
      },
      submitHandler: function(form) {
        window.disable_and_submit(form_id, form, "false", locale);
      }
  });

  }

  module.initializePayPalBuyForm = initializePayPalBuyForm;
  module.initializeCreatePaymentPoller = initializeCreatePaymentPoller;
  module.initializeFreeTransactionForm = initializeFreeTransactionForm;
  module.waitForPrice = waitForPrice;
})(window.ST.transaction, _);
