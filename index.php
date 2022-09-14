<?php

/*
  Plugin Name: Buy DERO
  Description: No KYC Portal to buy DERO
  Version: 0.1.0
  Author: CaptainUnknown
  Author URI: https://web3naut.com
  License: MIT
  License URI: https://opensource.org/licenses/MIT
  Update URI: https://github.com/CaptainUnknown/Buy-DERO/releases/latest
*/

if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly (For example by malicious bots that want to exploit this plugin)

class BuyDEROBlock {
    function __construct($name) {
        $this->name = $name;
        add_action('init', array($this,'onInit'));
    }

    function onInit() {
        wp_register_script($this->name . '_script', plugin_dir_url(__FILE__) . "build/{$this->name}.js", array('wp-blocks', 'wp-editor'));
        wp_register_style($this->name . '_style', plugin_dir_url(__FILE__) . "build/{$this->name}.css");

        $arguments = array(
            'render_callback' => array($this, 'onRender'),
            'editor_style' => "{$this->name}_style",
            'editor_script' => "{$this->name}_script",
        );

        register_block_type("deropay/{$this->name}", $arguments);
    }

    function onRender($attributes) {
        $attributes['name'] = $this->name;

        if (!is_admin()) {
            wp_enqueue_script($this->name . '_ui_script', plugin_dir_url(__FILE__) . "build/{$this->name}-ui.js", array('wp-element')); // Make sure to use double quotes after plugin_dir_url, single quotes won't use {$this->name}
            wp_enqueue_style($this->name . '_ui_style', plugin_dir_url(__FILE__) . "build/{$this->name}-ui.css");
        }

        ob_start();
        ?>

        <pre class="attributes" style="display:none;">
            <?php echo wp_json_encode($attributes) ?>
        </pre>

        <div class="replace-<?php echo $this->name;?>">
        </div>

        <?php return ob_get_clean();
    }
}

$buy_dero = new BuyDEROBlock('buy-dero');