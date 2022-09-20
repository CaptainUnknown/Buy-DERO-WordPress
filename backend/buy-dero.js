import "./buy-dero.scss"
import ReactTooltip from 'react-tooltip'
import { registerBlockType } from "@wordpress/blocks"
import { InspectorControls } from "@wordpress/block-editor"
import { PanelBody, PanelRow, ColorPicker } from "@wordpress/components"

const EditComponent = (props) => {
    const updateClientID = (event) => {
        props.setAttributes({clientID: event.target.value});
    }
    const updateServerURI = (event) => {
        props.setAttributes({serverURI: event.target.value});
    }
    
    function updateBgColor(colorCode) {
        props.setAttributes({bgColor: colorCode.hex})
    }
    function updatePrimaryColor(colorCode) {
        props.setAttributes({primaryColor: colorCode.hex})
    }

    return (<>
        <div className="configurationBlock">
            <h3> Buy DERO Config 🔧</h3>
            <p>❕ You'll need to host a NodeJS Server that can be found <a href="https://github.com/CaptainUnknown/Buy-DERO-Server"> here </a>. </p><br/>
            <p> Paypal ClientID: 
                <input data-tip="❕ Paypal ClientID can be found in Paypal Dashboard." type='text' id='clientID' value={props.attributes.clientID} placeholder='ClientID' onChange={updateClientID}/><br/><br/>
                <ReactTooltip/>
            </p>
            <p> Server URI: 
                <input data-tip="❕ URI of the hosted NodeJS Server." type='text' id='serverURI' value={props.attributes.serverURI} placeholder='https://ip:port' onChange={updateServerURI}/><br/><br/>
                <ReactTooltip/>
            </p>
        </div>

        <InspectorControls>
            <PanelBody>
            <h2> Background Color: </h2><br/>
                <PanelRow>
                    <ColorPicker color={props.attributes.color} defaultValue="#000000" disableAlpha onChangeComplete={updateBgColor} />
                </PanelRow>
            </PanelBody>
            <PanelBody>
            <h2> Primary Color: </h2><br/>
                <PanelRow>
                    <ColorPicker color={props.attributes.color} defaultValue="#000000" disableAlpha onChangeComplete={updatePrimaryColor} />
                </PanelRow>
            </PanelBody>
        </InspectorControls>

    </>)
}

registerBlockType("deropay/buy-dero", {
    title: 'Buy DERO',
    icon: 'privacy',
    category: "common",
    attributes: {
        clientID: {type: 'string'},
        serverURI: {type: 'string'},

        bgColor: { type: "string", default: "#000000" },
        primaryColor: { type: "string", default: "#000000" }
    },
    edit: EditComponent,
    save: function() {
        return null
    }
});