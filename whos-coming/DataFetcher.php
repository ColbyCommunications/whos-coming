<?php
/**
 * DataFetcher.php
 *
 * @package colbycomms/whos-coming
 */

namespace ColbyComms\WhosComing;

use Carbon_Fields\Helper\Helper as Carbon;
use ColbyComms\WhosComing\WpFunctions as WP;

/**
 * Handles data used by the plugin.
 */
class DataFetcher {
	/**
	 * Undocumented function
	 *
	 * @return array The fetched data.
	 */
	public static function fetch() : array {
		$data = WP::apply_filters( 'whos_coming__data', [] );

		if ( ! empty( $data ) ) {
			return $data;
		}

		$fetcher = new DataFetcher();
		return $fetcher->get_data();
	}

	/**
	 * Adds hooks.
	 */
	public function __construct() {
		$this->source_type = Carbon::get_theme_option( 'whos_coming__data_source' );
		$this->data_format = Carbon::get_theme_option( 'whos_coming__data_format' );
	}

	/**
	 * Formats the data.
	 *
	 * @param string $data Input data in string format.
	 * @return array The processed data.
	 */
	public function format_data( string $data ) : array {
		switch ( $this->data_format ) {
			case 'csv':
				return self::format_csv( $data );
			case 'json':
				return self::format_json( $data );
			default:
				return [];
		}
	}

	/**
	 * Takes a CSV string and converts it to an array.
	 *
	 * The first line of the CSV string should be a comma-separated list of the array's values.
	 *
	 * @param string $data The CSV data.
	 * @return array The formatted data.
	 */
	public static function format_csv( string $data ) : array {
		$csv_rows = array_map( 'str_getcsv', preg_split( "/[\r\n]+/", $data ) );
		$keys = $csv_rows[0];

		return array_reduce(
			array_slice( $csv_rows, 1 ),
			function( $output, $items ) use ( $keys ) {
				$row = [];
				foreach ( $items as $key => $value ) {
					if ( empty( $keys[ $key ] ) ) {
						continue;
					}

					$row[ $keys[ $key ] ] = $value;
				}

				$output[] = $row;

				return $output;
			},
			[]
		);
	}

	/**
	 * Converts a JSON string to an array.
	 *
	 * @param string $data The input data.
	 * @return array The output.
	 */
	public static function format_json( string $data ) : array {
		$decode_to_assoc_array = true;

		return json_decode( $data, $decode_to_assoc_array ) ?: [];
	}

	/**
	 * Retreives the data.
	 *
	 * @return array The retreived data.
	 */
	public function get_data() : array {
		switch ( $this->source_type ) {
			case 'text':
				return $this->format_data( $this->get_data_from_text() );
			case 'url':
				return $this->format_data( $this->get_data_from_url() );
			default:
				return [];
		}
	}

	/**
	 * Fetches data when the option is text.
	 *
	 * @return string The data.
	 */
	public function get_data_from_text() : string {
		return Carbon::get_theme_option( 'whos_coming__data' );
	}

	/**
	 * Fetches data when the option is URL.
	 *
	 * @return string The data.
	 */
	public function get_data_from_url() : string {
		$url = Carbon::get_theme_option( 'whos_coming__data_url' );
		$response = WP::wp_remote_get( $url );

		if ( WP::is_wp_error( $response ) ) {
			return '';
		}

		$data = WP::wp_remote_retrieve_body( $response );

		if ( WP::is_wp_error( $data ) ) {
			return '';
		}

		return $data ?: [];
	}
}
