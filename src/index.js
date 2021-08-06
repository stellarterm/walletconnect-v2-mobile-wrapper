import '@babel/polyfill';
import { WalletConnectService } from './wallet-connect-service';

// initialize wallet connect
const WC = new WalletConnectService();


// GLOBAL METHODS


// methods declared on native platforms
window.customPostMessage = (data) => {
  const stringify = JSON.stringify(data);
  // IOS
  if (window.webkit) {
    try {
      window.webkit.messageHandlers.sumbitToiOS.postMessage(stringify);
    } catch (e) {
      console.log(e)
    }
  }

  // android
  if (window.android) {
    window.android.postMessage(stringify);
  }

  // web
  console.log(stringify);
}

// wait until the scripts are loaded
window.onload = () => {
  customPostMessage({
    type: 'page_loaded'
  })
}

// need to call first for initialization after scripts loading
// metadata is json object
window.wc_init = (metadata) => {
  try {
    const parsedMeta = JSON.parse(metadata);

    WC.init(parsedMeta);
  } catch (e) {
    customPostMessage({
      type: 'error parse',
      message: e.message,
    })
  }
}

// after scanning the QR-code, we call this method
window.wc_pair = (uri) => {
  WC.pair(uri);
}

// method for confirming the session
window.wc_approve_session = (publicKey) => {
  WC.handleSessionUserApprove(publicKey)
}

// method for rejecting the session
window.wc_reject_session = () => {
  WC.handleSessionUserReject();
}

// method for disconnect from session
window.wc_disconnect = (topic) => {
  WC.disconnect(topic);
}

// method for confirming the request
window.wc_respond_success = (topic, id) => {
  WC.respondSuccess(topic, id);
}

// method for canceling the request
window.wc_respond_error = (topic, id, errorText) => {
  WC.respondError(topic, id, errorText);
}



