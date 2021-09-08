# Using walletconnect-v2-mobile-wrapper with iOS

```
Key Components:
WKWebView - allows web content to be loaded via a URL
WKScriptMessage - object created when a postMessage() is received
WKUserContentController - manages javascript posts and injection
WKScriptMessageHandler - protocol to access WKScriptMessage delegate methods
WKWebViewConfiguration - config passed to WKWebView
```

## Step 1: Initialize the WebView and load the required URL
```
var webView: WKWebView!

override func viewDidLoad() {
    super.viewDidLoad()
    
    let url = Bundle.main.url(forResource: "index", withExtension: "html")!
    webView.loadFileURL(url, allowingReadAccessTo: url)
    let request = URLRequest(url: url)
    webView.navigationDelegate = self
    webView.load(request)
}
```

## Step 2: Set up the configuration of your WebView

```
let contentController = WKUserContentController()
contentController.add(self, name: "submitToiOS")
let config = WKWebViewConfiguration()
config.userContentController = contentController
let frame = CGRect(x: 0, y: 0, width: 1, height: 1)
webView = WKWebView(frame: frame, configuration: config)

view.addSubview(webView)
```
In this example WebView is used only for passing data from Swift to Javascript, calling JS functions embedded in HTML Page, and receiving callbacks from Javascript functions to Swift Listener. The all UI is located on iOS native(Swift) Views.

## Step 3: Sending the required commands to interact with walletconnect-v2-mobile-wrapper
```
 func pairWithUri(_ uri: String) {
    webView.evaluateJavaScript("wc_pair('\(uri)')") { … }
}
```

## Step 4: Receiving a response from walletconnect-v2-mobile-wrapper
In order to listen to a function call from Javascript to Swift, the WebKit framework provides WKScriptMessagehandler delegate methods

```
extension WebViewController : WKScriptMessageHandler {

struct WCType: Codable {
  var type: String
}

func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    let messageString = message.body as? String ?? ""
    let data = Data(messageString.utf8)
    do {
        let wcType = try JSONDecoder().decode(WCType.self, from: data)
        if wcType.type.isEqual(to: "page_loaded") { … }
    } catch let error as NSError {
      print("Failed to load: \(error.localizedDescription)")
    }
}
```
When something happens in the HTML, page and a javascript function is called. This WKScriptMessageHandler delegate listens to it and based on the data passed (message body, message name) swift decides how to handle it.


