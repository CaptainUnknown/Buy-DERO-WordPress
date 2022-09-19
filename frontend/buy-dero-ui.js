import "./buy-dero-ui.scss"
import ReactDOM from "react-dom"
import React, { useState } from "react"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"

var attributes;
document.addEventListener("DOMContentLoaded", (event) => {
  const allAttributes = document.querySelectorAll(".attributes");
  allAttributes.forEach(attributeElement => {
    attributes = JSON.parse(attributeElement.innerText);
    const currentBlockName = attributes.name;
    const currentBlock = document.querySelectorAll('.replace-' + currentBlockName)[0];
    ReactDOM.render(<BuyDERO {...attributes} />, currentBlock);
    currentBlock.classList.remove("replace-" + currentBlockName);
  });
});

var quantity = 10;
var wallet = "";

const BuyDERO = (props) => {
  const [DEROAmount, setDEROAmount] = useState(10);
  const [DEROAmountError, setDEROAmountError] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletAddressError, setWalletAddressError] = useState(false);
  const [successVisibility, setSuccessVisibility] = useState(false);
  const [dispatchedTx, setDispatchedTx] = useState("");
  const [errorVisibility, setErrorVisibility] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  return (<>
    <div className="payBlock">
      <h3> Buy DERO </h3>

      <p> DERO:
        <input style={{ width: "30%" }} type='number' id='DEROAmount' value={DEROAmount} placeholder='DERO to Purchase'
          onChange={() => {
            if (event.target.value == 0) setDEROAmountError(true);
            else setDEROAmountError(false);

            setDEROAmount(event.target.value);
            quantity = event.target.value;
          }} /><br /><br />

      </p>
      <p> Wallet Address:
        <input style={{ width: "68%" }} type='text' id='walletAddress' value={walletAddress} placeholder='Wallet Address'
          onChange={() => {
            if (event.target.value.length != 66)
              setWalletAddressError(true);
            else
              setWalletAddressError(false);
            setWalletAddress(event.target.value);
            wallet = event.target.value;
          }
          } /><br /><br />
      </p>

      {DEROAmountError ? <p style={{ color: "#DD2E44" }}> ❌ DERO Amount must be greater than zero </p> : null}
      {DEROAmount > 9999 ? <p style={{ color: "#FFCC4D" }}> ⚠️ Your purchase may take some time to process </p> : null}
      {walletAddressError ? <p style={{ color: "#DD2E44" }}> ❌ Invalid Wallet Address </p> : null}

      <div style={{ display: DEROAmountError || walletAddressError ? "none" : "flex" }}>
        <PayPalScriptProvider options={{ "client-id": props.clientID }}>
          <PayPalButtons
            style={{ color: 'blue' }}
            createOrder={async (data, actions) => {
              console.log('Wallet: ' + wallet);
              console.log('Quantity: ' + parseInt(Math.round(quantity)));
              return await fetch("http://localhost:8000/create-order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  items: [{
                    id: 1,
                    quantity: parseInt(Math.floor(quantity)),
                    wallet: walletAddress,
                  }],
                }),
              })
              .then(res => {
                if (res.ok) return res.json();
                return res.json().then(json => Promise.reject(json));
              })
              .then(({ id }) => {
                return id;
              })
              .catch(e => {
                console.error(e.error);
                alert('Error: ' + e.error);
              })
            }}

            onApprove={async (data, actions) => {
              return await fetch("http://localhost:8000/capture-order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderID: data.orderID,
                  wallet: wallet
                }),
              })
              .then(res => res.json())
              .then(data => {
                console.log(data);
                setDispatchedTx(data.transactionID);
                setSuccessVisibility(true);
              })
              .catch(e => {
                console.error(e.error.message);
                setErrorMessage(e.error.message);
              })
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>

    {/* Success Popup */}
    <div onClick={() => { setSuccessVisibility(false) }} className="popupWrapper" style={{ display: successVisibility ? "flex" : "none" }}>
      <div className="popup" style={{ height: "145px", alignItems: "center" }}>
        <p> Congrats! Your DERO are on the way! 🚀 </p>
        <p> {dispatchedTx} </p>
      </div>
    </div>
    
    {/* Error Popup */}
    <div onClick={() => { setErrorVisibility(false) }} className="popupWrapper" style={{ display: errorVisibility ? "flex" : "none" }}>
      <div className="popup" style={{ height: "145px", alignItems: "center" }}>
        <p> Oops! This wasn't supposed to happen. </p>
        <p> {errorMessage} </p>
      </div>
    </div>

  </>)
}