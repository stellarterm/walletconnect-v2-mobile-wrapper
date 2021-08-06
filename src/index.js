import '@babel/polyfill';
import { WalletConnectService } from './wallet-connect-service';

// initialize wallet connect
const WC = new WalletConnectService();

// GLOBAL METHODS

// need to call first for initialization
window.wc_init = (metadata) => {
  WC.init(JSON.parse(metadata));
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
