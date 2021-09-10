# walletconnect-v2-mobile-wrapper

## Overview 

This repository allows you to run the Javascript [WalletConnect v2 monorepo](https://github.com/WalletConnect-Labs/walletconnect-v2-monorepo) in mobile native wallets (iOS and Android codebase) through webview integration.


## Build HTML

Install node modules

`yarn install`

Build an HTML file using the command

`yarn build`

## Run Wallet Connect Monorepo v2.0 in iOS and Android

Copy the `index.html` from the `dist/` folder to your mobile wallet application project. Instructions on how to start working with index.html, declare the postMessage method and call the JS methods on mobile platforms are available below:

- [Android](android.md)
- [iOS](ios.md)


## JavaScript methods description:

| Method name | Description | Parameters | Parameters example |
| --- | --- | --- | --- |
| `wcInit(metadata)`| call this method first after the scripts at index.html are fully loaded (`page_loaded` event) to initialize WalletConnect service. | 1. `metadata` - JSON stringify object: <br> 1.1. `name` : `STRING` -  app name <br>1.2. `description` : `STRING` -  app description <br>1.3. `url` : `STRING` -  app URL<br>1.4. `icons` : `ARRAY OF STRINGS` -  app icons |  <div style="max-width: 200px;"><code>"{\"name\": \"my name\", \"description\":  \"my description\", \"url\": \"https://mydomain.com\",  \"icons\":[\"https://my-icon.com\"] }"<code></div> | 
| `wcPair(uri)` | call this method after the QR code with URI is scanned | 1. `uri` - `STRING` -  URI scanned from WalletConnect-compatible DApp | <div style="max-width: 200px;">``` 'wc:ab8ddaee949e82n4ys62152ea84ecc569b306e26c9c15b19089786ca0a8fcfc1@2?controller=false&publicKey=704a5ea21310fe3784740731def05c8155b088c083hd63df7eeba56eb3af4a34&relay=%7B%22protocol%22%3A%22waku%22%7D'```</div> |
| `wcApproveSession(publicKey)` | call this method to confirm the latest session proposal | 1. `publicKey` - `STRING` -  Stellar account public key | <div style="max-width: 200px;">```'GCKBS2ANCY2Z36LKS3EHUZJU2KXUQTW55DUIHG7WYEZORNUBA6TOLHRS'```</div> |
| `wcRejectSession()` | call this method to reject the latest session proposal |||
| `wcDisconnect(topic)` | call this method to disconnect from a session | 1. `topic` - `STRING` -  session topic | <div style="max-width: 200px;">```'dd438a35a62dc04f3ec55ec6da750f55528fb4cb1f13039ed79da082e828843b'```</div> |
| `wcRespondSuccess(topic, id, status)` | call this method to confirm a request | 1. `topic` - `STRING` -  session topic<br>2. `id` - `NUMBER` -  request id<br>3. `status` - `success` or `pending` -  transaction status | <div style="max-width: 200px;"><code>'dd438a35a62dc04f3ec55ec6da750f55528fb4cb1f13039ed79da082e828843b', // topic <br><br>1631088500476687, //id<br><br>'success' // status</code></div> |
| `wcRespondError(topic, id, errorText)` | call this method to reject a request | 1. `topic` - `STRING` -  session topic<br>2. `id` - `NUMBER` -  request id<br>3. `errorText` - `optional - STRING` -  error text | <div style="max-width: 200px;"><code>'dd438a35a62dc04f3ec55ec6da750f55528fb4cb1f13039ed79da082e828843b', // topic <br><br>1631088500476687, //id<br><br>'Sequence error' // error text</code></div> |


## postMessage events description
Payload for all events is JSON stringify object

| Event name | Description | Payload | postMessage example(JSON parsed) |
| --- | --- | --- | --- |
| `page_loaded` | trigger after the page with scripts is fully loaded | | ```{ type: 'page_loaded' }``` |
| `initial_settled_sessions` | trigger after the end of `wcInit` | sessions: `ARRAY OF WALLET CONNECT SESSION INSTANCES if exists or EMPTY ARRAY` | <code>{<br>&nbsp;&nbsp;type: 'initial_settled_sessions',<br>&nbsp;&nbsp;sessions: [] <br>}</code> |
| `initial_session_requests` | trigger after the end of `wcInit` if settled sessions exist | requestEvents: `ARRAY OF WALLET CONNECT REQUEST EVENTS INSTANCES if exists or EMPTY ARRAY` | <code>{\ &nbsp;&nbsp;type: 'initial_session_requests',<br>&nbsp;&nbsp;requestEvents: [] <br>}</code> |
| `pair_success` | trigger after the end of `wcPair` if the result is successful | | ```{ type: 'pair_success' }``` |
| `pair_fail` | trigger after the end of `wcPair` if the result is fail | | ```{ type: 'pair_fail' }``` |
| `session_proposal` | trigger after `pair_success` if the application supports blockchain and methods from DApp | proposal: `WALLET CONNECT SESSION PROPOSAL INSTANCE` | <code>{<br>&nbsp;&nbsp;type: 'session_proposal',<br>&nbsp;&nbsp;proposal: {...} <br>}</code> |
| `session_created` | trigger after successful `wcApproveSession` | session: `WALLET CONNECT SESSION INSTANCE` | <code>{<br>&nbsp;&nbsp;type: 'session_created',<br>&nbsp;&nbsp;session: {...} <br>}</code> |
| `session_rejected` | trigger after `wcRejectSession` or if the application doesn't support blockchain and methods from DApp | | ```{ type: 'session_rejected' }``` |
| `session_deleted` | trigger after `wcDisconnect` or after the session is disconnected by DApp | session: `WALLET CONNECT SESSION INSTANCE` | <code>{<br>&nbsp;&nbsp;type: 'session_deleted',<br>&nbsp;&nbsp;session: {...} <br>}</code> |
| `session_request` | trigger when you get a new request | requestEvents: `ARRAY WITH WALLET CONNECT REQUEST EVENT INSTANCE` | <code>{<br>&nbsp;&nbsp;type: 'session_request',<br>&nbsp;&nbsp;requestEvents: [{...}] <br>}</code> |
| `respond_sent` | trigger after `wcRespondSuccess` or after `wcRespondError` | | ```{ type: 'respond_sent' }``` |
