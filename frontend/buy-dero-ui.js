import "./buy-dero-ui.scss"
import ReactDOM from "react-dom"
import React, { useState } from "react"
import ReactTooltip from 'react-tooltip'
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
  const [successVisibility, setSuccessVisibility] = useState(false);
  const [DEROAmount, setDEROAmount] = useState(10);
  const [walletAddress, setWalletAddress] = useState("");



  // style={{ color: props.primaryColor, borderColor: props.primaryColor, backgroundColor: props.bgColor}}

  return (<>
    <div className="payBlock">
      <h3> Buy DERO! </h3>

      <p> DERO: 
        <input data-tip="❕Amount of DERO you want to purchase" style={{ width: "30%" }} type='number' id='DEROAmount' value={DEROAmount} placeholder='DERO to Purchase' onChange={() => {setDEROAmount(event.target.value)}}/><br/><br/>
        
      </p>
      <p> Wallet Address:
        <input data-tip="❕Your wallet Address (You'll recieve DERO in this wallet, make sure to double check your wallet!)" style={{ width: "68%" }} type='text' id='walletAddress' value={walletAddress} placeholder='Wallet Address' onChange={() => {setWalletAddress(event.target.value)}}/><br/><br/>
        
      </p>
      
      <div>
        <PayPalScriptProvider options={{"client-id": props.clientID}}>
          <PayPalButtons 
          createOrder={async (data, actions) => {
            return await fetch("http://139.162.176.124:8000/create-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                amount: DEROAmount,
                address: walletAddress
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
              alert('Error: Failed to connect to the server. Please try again.');
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