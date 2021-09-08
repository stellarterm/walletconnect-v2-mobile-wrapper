# Using walletconnect-v2-mobile-wrapper with Android

## Step 1: Add WebView to your app’s layout xml
First, add the WebView to your Activity/Fragment’s manifest:
```
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
   ...
    <WebView
        android:id="@+id/webView"
        android:layout_width="0dp"
        android:layout_height="0dp"/>

</FrameLayout>
```
Alternatively, the WebView widget can also be initialized as a local variable.

Don't forget to add internet permission in our app's AndroidManifest.xml file.


## Step 2: Initialize the WebView from the Activity
The next step is to configure it from the Activity using Kotlin:

```
webView.settings.domStorageEnabled = true
webView.webChromeClient = WebChromeClient()
webView.webViewClient = WebViewClient()
webView.addJavascriptInterface(JsObject(), "android") // the name "android" is used in the customPostMessage from index.html, make sure that they match 
```

## Step 3. Load the required URL
Use the `loadUrl()` method after initializing the WebView to load the desired URL (walletconnect-v2-mobile-wrapper).

If you want to load pages in a WebView not from the Internet, but from your application, place the necessary files in a folder with assets, for example, assets / index.html. You can access the file using the `"file: ///android_asset/index.html"` construct:
```
webView.loadUrl("file:///android_asset/index.html")    
```

## Step 4. Sending the required commands to interact with walletconnect-v2-mobile-wrapper
Use the `evaluateJavascript()` method to send commands to the WebView.
```
webView?.evaluateJavascript("wcApproveSession('publicKey')") {
          
}
```

## Step 5. Receiving a response from walletconnect-v2-mobile-wrapper
To listen to responses from WebView use @JavascriptInterface postMessage
```
internal class JsObject(/*val context: Context?*/) {

        @JavascriptInterface
        fun postMessage(json: String?): Boolean {
            if (json.isNullOrEmpty()) {
                return false
            }
            // handle json here
            return true
        }
    }
```



