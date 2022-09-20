![Powered by DERO](https://i.imgur.com/ulni3VS.jpg)

# Buy-DERO | WordPress 🔌 (https://img.shields.io/badge/1.0.0-brightgreen)
 This plugin provides a safe place to reliably exchange fiat for DERO, directly into their personal wallet. 
 
 The plugin uses `@paypal/react-paypal-js` (Paypal SDK for React) to create an Order ID with the requested amount of DERO. The price of the order is determined by the [NodeJS Server](https://github.com/CaptainUnknown/Buy-DERO-Server) that fetches the current exchange rate for DERO. Upon approval of the order, the server captures the transaction & releases the requested amount of DERO to the user's wallet.
 (You need to host the provided server to be able to use this Plugin.)


 ## Parameters 🔧

 **Paypal ClientID**:
 
 `string` - Paypal ClientID can be found in developers dashboard, (To obtain ClientID, visit: [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)).
 
 
 **Server URI**:
 
 `string` - URI to your hosted [NodeJS Server](https://github.com/CaptainUnknown/Buy-DERO-Server) to create & capture payments.

 ## Screenshots 🖼️
 **Editor:**
![Editor Block](https://i.imgur.com/Kj9hZFb.png)

**Frontend:**
![Frontend Block](https://i.imgur.com/cSdEDXu.png)
