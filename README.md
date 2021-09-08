# walletconnect-v2-mobile-wrapper

## Build HTML

Install node modules

`yarn install`

Build an HTML file using the command

`yarn build`

Copy the `index.html` from the `dist/` folder to your mobile wallet application project. Instructions on how to start working with index.html, declare the postMessage method and call the JS methods on mobile platforms are available below:

- [Android](android.md)
- [iOS](ios.md)


## JavaScript methods description:

- `wcInit(metadata)` - call this method first after the scripts at index.html are fully loaded (`page_loaded` event) to initialize WalletConnect service.
  
    #### Parameters:
    ```
    1. `metadata` - JSON stringify object:
    	1.1. `name` : `STRING` -  app name
    	1.2. `description` : `STRING` -  app description
    	1.3. `url` : `STRING` -  app URL
    	1.4. `icons` : `ARRAY OF STRINGS` -  app icons
    ```        

    #### Example:
    ```json
       "{\"name\": \"my name\", \"description\": \"my description\", \"url\": \"https://mydomain.com\", \"icons\":[\"https://my-icon.com\"] }"
    ```
  
- `wcPair(uri)` - call this method after the QR code with URI is scanned
  
    #### Parameters:
    ```
    1. `uri` - `STRING` -  URI scanned from WalletConnect-compatible DApp
    	
    ```        
    #### Example:
    ```javascript
        'wc:ab8ddaee949e82n4ys62152ea84ecc569b306e26c9c15b19089786ca0a8fcfc1@2?controller=false&publicKey=704a5ea21310fe3784740731def05c8155b088c083hd63df7eeba56eb3af4a34&relay=%7B%22protocol%22%3A%22waku%22%7D'
    ```

- `wcApproveSession(publicKey)` - call this method to confirm the latest session proposal
  
  #### Parameters:
    ```
    1. `publicKey` - `STRING` -  Stellar account public key
    	
    ```        
  #### Example:
    ```javascript
        'GCKBS2ANCY2Z36LKS3EHUZJU2KXUQTW55DUIHG7WYEZORNUBA6TOLHRS'
    ```

- `wcRejectSession()` - call this method to reject the latest session proposal
  
  #### Parameters:
    ```
    Without parameters
  ```

- `wcDisconnect(topic)` - call this method to disconnect from a session
  
  #### Parameters:
    ```
    1. `topic` - `STRING` -  session topic
    	
    ```        
  #### Example:
    ```javascript
        'dd438a35a62dc04f3ec55ec6da750f55528fb4cb1f13039ed79da082e828843b'
    ``` 

- `wcRespondSuccess(topic, id, status)` - call this method to confirm a request
  
  #### Parameters:
    ```
    1. `topic` - `STRING` -  session topic
    2. `id` - `NUMBER` -  request id
    3. `status` - `success` or `pending` -  transaction status
    	
    ```        
  #### Example:
    ```javascript
        'dd438a35a62dc04f3ec55ec6da750f55528fb4cb1f13039ed79da082e828843b', // topic
        1631088500476687, //id
        'success' // status
    ``` 

- `wcRespondError(topic, id, errorText)` - call this method to reject a request
  #### Parameters:
    ```
    1. `topic` - `STRING` -  session topic
    2. `id` - `NUMBER` -  request id
    3. `errorText` - `optional - STRING` - error text
    	
    ```        
  #### Example:
    ```javascript
        'dd438a35a62dc04f3ec55ec6da750f55528fb4cb1f13039ed79da082e828843b', // topic
        1631088500476687, //id
        'Sequence error' // errorText
    ``` 


## postMessage events description
Payload for all events is JSON stringify object

- `page_loaded` - trigger after the page with scripts is fully loaded
  
  #### Payload:
  ```
    Without payload
  ```

- `initial_settled_sessions` - trigger after the end of `wcInit`
  
  #### Payload:
  ```
      {
        sessions: `ARRAY OF WALLET CONNECT SESSION INSTANCES if exists or EMPTY ARRAY`
      }
  ```
  
- `initial_session_requests` - trigger after the end of `wcInit` if settled sessions exist
  
  #### Payload:
  ```
      {
        requestEvents: `ARRAY OF WALLET CONNECT REQUEST EVENTS INSTANCES if exists or EMPTY ARRAY`
      }
  ```
  
- `pair_success` - trigger after the end of `wcPair` if the result is successful
  
  #### Payload:
    ```
      Without payload
    ```

- `pair_fail` - trigger after the end of `wcPair` if the result is fail
  
  #### Payload:
    ```
      Without payload
    ```
  
- `session_proposal` - trigger after `pair_success` if the application supports blockchain and methods from DApp
  
  #### Payload:
    ```
        {
          proposal: `WALLET CONNECT SESSION PROPOSAL INSTANCE`
        }
    ```
  
- `session_created` - trigger after successful `wcApproveSession`
  
  #### Payload:
    ```
        {
          session: `WALLET CONNECT SESSION INSTANCE`
        }
    ```

- `session_rejected` - trigger after `wcRejectSession` or if the application doesn't support blockchain and methods from DApp
  
  #### Payload:
    ```
      Without payload
    ```

- `session_deleted` - trigger after `wcDisconnect` or after the session is disconnected by DApp
  
  #### Payload:
    ```
        {
          session: `WALLET CONNECT SESSION INSTANCE`
        }
    ```
  
- `session_request` - trigger when you get a new request
  
  #### Payload:
    ```
        {
          requestEvents: `ARRAY WITH WALLET CONNECT REQUEST EVENT INSTANCE`
        }
    ```
  
- `respond_sent` - trigger after `wcRespondSuccess` or after `wcRespondError`
  
  #### Payload:
    ```
      Without payload
    ```
