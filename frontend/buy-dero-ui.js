import "./buy-dero-ui.scss"
import ReactDOM from "react-dom"
import React, { useState } from "react"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"

import { ReactComponent as Loading } from "./Loading.svg"

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

const BuyDERO = (props) => {
  const [loadingVisibility, setLoadingVisibility] = useState(false);
  const [DEROAmount, setDEROAmount] = useState(10);
  const [DEROAmountError, setDEROAmountError] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletAddressError, setWalletAddressError] = useState(false);
  const [successVisibility, setSuccessVisibility] = useState(false);
  // style={{ color: props.primaryColor, borderColor: props.primaryColor, backgroundColor: props.bgColor}}
  console.log('Wallet Address: ' + walletAddress + '\n' + 'DERO Amount: ' + DEROAmount);
  let quantity = DEROAmount;
  console.log('Quantity: ' + quantity);

  return (<>
    <div className="payBlock">
      <h3> Buy DERO </h3>

      <p> DERO:
        <input style={{ width: "30%" }} type='number' id='DEROAmount' value={DEROAmount} placeholder='DERO to Purchase'
        onChange={() => {
          if(event.target.value == 0) setDEROAmountError(true);
          else setDEROAmountError(false);
          
          setDEROAmount(event.target.value);
        }}/><br/><br/>
        
      </p>
      <p> Wallet Address:
        <input style={{ width: "68%" }} type='text' id='walletAddress' value={walletAddress} placeholder='Wallet Address'
        onChange={() => {
          if(event.target.value.length != 66)
          setWalletAddressError(true);
          else
          setWalletAddressError(false);
          setWalletAddress(event.target.value)}
        }/><br/><br/> 
      </p>
      
      { DEROAmountError? <p style={{color: "#DD2E44"}}> ❌ DERO Amount must be greater than zero </p> : null }
      { DEROAmount > 9999? <p style={{color: "#FFCC4D"}}> ⚠️ Your purchase may take some time to process </p> : null }
      { walletAddressError? <p style={{ color: "#DD2E44" }}> ❌ Invalid Wallet Address </p> : null }

      <div style={{ display: DEROAmountError || walletAddressError? "none" : "flex" }}>
        <PayPalScriptProvider options={{"client-id": props.clientID}}>
          <PayPalButtons
          style={{
            color: 'blue',
          }}
          createOrder={ async (data, actions) => {
            console.log('Paypal\nWallet Address: ' + walletAddress + '\n' + 'DERO Amount: ' + DEROAmount);
            console.log('Paypal Quantity: ' + quantity);
            return await fetch("http://139.162.176.124:8000/create-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                items: [{
                  id: 1,
                  quantity: quantity,
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

          onApprove={function (data, actions) {
            return actions.order.capture().then(function () {
              setSuccessVisibility(true);
            });
          }}

        />
        </PayPalScriptProvider>
      </div>
    </div>
    
    {/* Success Popup */}
    <div className="popupWrapper" style={{ display: successVisibility ? "flex" : "none" }}>
      <div className="popup" style={{ height: "85px", flexDirection: "row", alignItems: "flex-start" }}>
        <p> Congrats! Your DERO is on the way! 🚀 </p>
      </div>
    </div>
    
    {/* Loading Popup */}
    <div className="popupWrapper" style={{ display: loadingVisibility ? "flex" : "none" }}>
      <div className="popup" style={{ height: "125px", flexDirection: "row", alignItems: "flex-start" }}>
        <Loading/>
        <span> Loading, Please wait... </span>
      </div>
    </div>

  </>)
}