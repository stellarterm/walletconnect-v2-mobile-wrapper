import '@babel/polyfill';
import { WalletConnectService } from './wallet-connect-service';

// initialize wallet connect instance
const WC = new WalletConnectService();


// GLOBAL METHODS


// methods declared on native platforms
window.customPostMessage = (data) => {
  const stringify = JSON.stringify(data);
  // IOS
  if (window.webkit) {
    try {
      window.webkit.messageHandlers.submitToiOS.postMessage(stringify);
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

window.onload = () => {
  customPostMessage({
    type: 'page_loaded'
  })
}

window.wcInit = (metadata) => {
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

window.wcPair = (uri) => {
  WC.pair(uri);
}

window.wcApproveSession = (publicKey, topic) => {
  WC.handleSessionUserApprove(publicKey, topic)
}

window.wcRejectSession = (topic) => {
  WC.handleSessionUserReject(topic);
}

window.wcDisconnect = (topic) => {
  WC.disconnect(topic);
}

window.wcRespondSuccess = (topic, id, status) => {
  WC.respondSuccess(topic, id, status);
}

window.wcRespondError = (topic, id, errorText) => {
  WC.respondError(topic, id, errorText);
}



