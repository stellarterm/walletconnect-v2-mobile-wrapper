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

- ### [Android](android.md)
- ### [iOS](ios.md)


## JavaScript methods description:

| Method name | Description | Parameters |
| --- | --- | --- |
| `wcInit(metadata)`| call this method first after the scripts at index.html are fully loaded (`page_loaded` event) to initialize WalletConnect service. | 1. `metadata` - JSON stringify object: <br>&nbsp;&nbsp;1.1. `name` : `STRING` -  app name <br>&nbsp;&nbsp;1.2. `description` : `STRING` -  app description <br>&nbsp;&nbsp;1.3. `url` : `STRING` -  app URL<br>&nbsp;&nbsp;1.4. `icons` : `ARRAY OF STRINGS` -  app icons |  
| `wcPair(uri)` | call this method after the QR code with URI is scanned | 1. `uri` - `STRING` -  URI scanned from WalletConnect-compatible DApp | 
| `wcApproveSession(publicKey)` | call this method to confirm the latest session proposal | 1. `publicKey` - `STRING` -  Stellar account public key | 
| `wcRejectSession()` | call this method to reject the latest session proposal |||
| `wcDisconnect(topic)` | call this method to disconnect from a session | 1. `topic` - `STRING` -  session topic | 
| `wcRespondSuccess(topic, id, status)` | call this method to confirm a request | 1. `topic` - `STRING` -  session topic<br>2. `id` - `NUMBER` -  request id<br>3. `status` - `success` or `pending` -  transaction status |
| `wcRespondError(topic, id, errorText)` | call this method to reject a request | 1. `topic` - `STRING` -  session topic<br>2. `id` - `NUMBER` -  request id<br>3. `errorText` - `optional - STRING` -  error text |


## postMessage events description
Payload for all events is JSON stringify object

| Event name | Description | Payload |
| --- | --- | --- |
| `page_loaded` | trigger after the page with scripts is fully loaded | | 
| `initial_settled_sessions` | trigger after the end of `wcInit` | sessions: `ARRAY OF WALLET CONNECT SESSION INSTANCES if exists or EMPTY ARRAY` | 
| `initial_session_requests` | trigger after the end of `wcInit` if settled sessions exist | requestEvents: `ARRAY OF WALLET CONNECT REQUEST EVENTS INSTANCES if exists or EMPTY ARRAY` | 
| `pair_success` | trigger after the end of `wcPair` if the result is successful | | ```{ type: 'pair_success' }``` |
| `pair_fail` | trigger after the end of `wcPair` if the result is fail | | ```{ type: 'pair_fail' }``` |
| `session_proposal` | trigger after `pair_success` if the application supports blockchain and methods from DApp | proposal: `WALLET CONNECT SESSION PROPOSAL INSTANCE` | 
| `session_created` | trigger after successful `wcApproveSession` | session: `WALLET CONNECT SESSION INSTANCE` | 
| `session_rejected` | trigger after `wcRejectSession` or if the application doesn't support blockchain and methods from DApp | | 
| `session_deleted` | trigger after `wcDisconnect` or after the session is disconnected by DApp | session: `WALLET CONNECT SESSION INSTANCE` | 
| `session_request` | trigger when you get a new request | requestEvents: `ARRAY WITH WALLET CONNECT REQUEST EVENT INSTANCE` | 
| `respond_sent` | trigger after `wcRespondSuccess` or after `wcRespondError` | | 
