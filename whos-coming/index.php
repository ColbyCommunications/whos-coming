<?php
/**
 * Plugin entry point.
 *
 * @package colbycomms/whos-coming
 */

namespace ColbyComms\WhosComing;

use ColbyComms\WhosComing\WpFunctions as WP;

define( __NAMESPACE__ . '\TEXT_DOMAIN', 'whos-coming' );
define( __NAMESPACE__ . '\VERSION', '1.0.0' );
define( __NAMESPACE__ . '\PROD', false );

WP::add_action(
	'plugins_loaded',
	function() {
		new AdminPage();
	}
);

WP::add_action(
	'init',
	function() {
		new WhosComing();
	}
);
