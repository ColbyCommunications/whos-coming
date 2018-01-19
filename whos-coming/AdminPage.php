<?php
/**
 * Creates the plugin admin page.
 *
 * @package colbycomms/whos-coming
 */

namespace ColbyComms\WhosComing;

use Carbon_Fields\{Container, Field};
use ColbyComms\WhosComing\WpFunctions as WP;

/**
 * Sets up an options page using Carbon Fields.
 */
class AdminPage {
	/**
	 * Adds hooks.
	 */
	public function __construct() {
		WP::add_action( 'carbon_fields_register_fields', [ $this, 'create_container' ] );
		WP::add_action( 'carbon_fields_register_fields', [ $this, 'add_plugin_options' ] );
	}

	/**
	 * Creates the options page.
	 */
	public function create_container() {
		$this->container = Container::make( 'theme_options', 'Who\'s Coming Options' )
			->set_page_parent( 'plugins.php' );
	}

	/**
	 * Provides an array of fields to add to the container.
	 *
	 * @return array An array of fields.
	 */
	public static function get_fields() : array {
		return [
			Field::make( 'complex', 'whos_coming__display_fields', 'Who\'s Coming fields to display' )
				->set_layout( 'grid' )
				->add_fields(
					[
						Field::make( 'text', 'whos_coming__field_key', 'Field key' )
							->set_help_text( 'The field key must correspond to a key in the data provided below. Otherwise the field will be ignored.' ),

						Field::make( 'text', 'whos_coming__field_display_name', 'Display text' )
							->set_help_text( 'E.g., "Visitor Name" for "name" field; "Class Year" for "class_year" field.' ),
					]
				),

			Field::make( 'text', 'whos_coming__search_field', 'Search Field' )
				->set_help_text( 'Enter the field key (from above) to search with a search box. If this field is empty, no search will be included.' ),

			Field::make( 'radio', 'whos_coming__data_format', 'Data format' )
					->add_options(
						[
							'json' => 'JSON',
							'csv' => 'CSV',
						]
					)
					->set_default_value( 'json' ),

			Field::make( 'radio', 'whos_coming__data_source', 'Data source' )
					->add_options(
						[
							'text' => 'Text field',
							'url' => 'URL',
						]
					)
					->set_default_value( 'text' ),

			Field::make( 'text', 'whos_coming__data_url', 'Data URL' )
				->set_help_text( 'This must be a public URL. The data will be cached periodically.' )
				->set_conditional_logic(
					[
						[
							'field' => 'whos_coming__data_source',
							'compare' => '=',
							'value' => 'url',

						],
					]
				),

			Field::make( 'textarea', 'whos_coming__data', 'Data' )
				->set_help_text( 'Paste the data into the box.' )
				->set_conditional_logic(
					[
						[
							'field' => 'whos_coming__data_source',
							'compare' => '=',
							'value' => 'text',

						],
					]
				),
		];
	}

	/**
	 * Adds the plugin options.
	 */
	public function add_plugin_options() {
		$this->container->add_fields( self::get_fields() );
	}
}
