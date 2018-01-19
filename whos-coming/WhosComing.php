<?php
/**
 * WhosComing.php
 *
 * @package colbycomms/whos-coming
 */

namespace ColbyComms\WhosComing;

use Carbon_Fields\Helper\Helper as Carbon;
use ColbyComms\WhosComing\{DataFetcher, WpFunctions as WP};

/**
 * Handles the [whos-coming] shortcode.
 */
class WhosComing {
	/**
	 * The shortcode tag.
	 *
	 * @var string
	 */
	public static $shortcode = 'whos-coming';

	/**
	 * Add hook callbacks.
	 */
	public function __construct() {
		WP::add_action( 'template_redirect', [ $this, 'set_up' ] );

		if ( ! WP::shortcode_exists( self::$shortcode ) ) {
			WP::add_shortcode(
				self::$shortcode,
				[ $this, 'whos_coming_shortcode' ]
			);
		}
	}

	/**
	 * Should the setup work be done.
	 *
	 * @return boolean Yes or no.
	 */
	public static function should_set_up() : bool {
		global $post;

		return WP::is_singular()
			&& ! empty( $post )
			&& WP::has_shortcode( $post->post_content, self::$shortcode );
	}

	/**
	 * Gets the data ready for the shortcode.
	 *
	 * @return void
	 */
	public function set_up() {
		if ( ! self::should_set_up() ) {
			return;
		}

		WP::add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_scripts_and_styles' ] );
		$this->data = self::get_data();
		$this->fields = Carbon::get_theme_option( 'whos_coming__display_fields' );
		$this->search_field = Carbon::get_theme_option( 'whos_coming__search_field' );
	}

	/**
	 * Gets data from the DataFetcher class.
	 *
	 * @return array The data array.
	 */
	public static function get_data() : array {
		return DataFetcher::fetch();
	}

	/**
	 * The shortcode callback.
	 *
	 * @return string HTML output.
	 */
	public function whos_coming_shortcode() : string {
		ob_start();

		self::render( $this->data, $this->fields );

		return ob_get_clean();
	}

	/**
	 * Renders a search input if a search field has been provided.
	 *
	 * @param string $field The provided search field.
	 * @return void
	 */
	public static function render_search_field( string $field ) : void {
		if ( ! $field ) {
			return;
		}

		?>
<label class="whos-coming__search">
	<span>Search</span>
	<input type="search" placeholder="Search" data-whos-coming-search="<?php echo WP::esc_attr( $field ); ?>"  />
</label>
		<?php
	}

	/**
	 * Renders the first row.
	 *
	 * @param array $fields The fields.
	 * @return void
	 */
	public static function render_key_bar( array $fields = [] ) : void {
		?>
		<div class="whos-coming__row whos-coming__row--key">
		<?php foreach ( $fields as $field ) : ?>
			<span data-whos-coming-column="<?php echo WP::esc_attr( $field['whos_coming__field_key'] ); ?>"
				class="whos-coming__cell whos-coming__<?php echo WP::esc_attr( $field['whos_coming__field_key'] ); ?>">
				<?php echo WP::wp_kses_post( $field['whos_coming__field_display_name'] ); ?>
			</span>
		<?php endforeach; ?>
		</div>
		<?php
	}

	/**
	 * Outputs the HTML.
	 *
	 * @param array  $data Items to iterate through.
	 * @param array  $fields Fields to include.
	 * @param string $search_field The field to provide a search box for.
	 * @return void
	 */
	public static function render( array $data = [], array $fields = [], string $search_field = '' ) : void {
		?>
<?php self::render_search_field( $search_field ); ?>
<div data-whos-coming class="whos-coming">
	<?php self::render_key_bar( $fields ); ?>
	<?php foreach ( array_filter( $data ) as $person ) : ?>
		<div class="whos-coming__row">
		<?php foreach ( $fields as $field ) : ?>
			<?php if ( ! empty( $person[ $field['whos_coming__field_key'] ] ) ) : ?>
				<span data-whos-coming-data="<?php echo WP::esc_attr( $field['whos_coming__field_key'] ); ?>"
					class="whos-coming__cell whos-coming__<?php echo WP::esc_attr( $field['whos_coming__field_key'] ); ?>">
					<?php echo WP::wp_kses_post( $person[ $field['whos_coming__field_key'] ] ); ?>
				</span>
			<?php endif; ?>
		<?php endforeach; ?>
		</div>
	<?php endforeach; ?>
</div>
		<?php
	}

	/**
	 * Enqueues plugin assets.
	 *
	 * @return void
	 */
	public static function enqueue_scripts_and_styles() : void {
		$dist = self::get_dist_directory();
		$min = defined( 'PROD' ) && PROD ? '.min' : '';
		/**
		 * Filters whether to enqueue this plugin's script.
		 *
		 * @param bool Yes or no.
		 */
		if ( apply_filters( 'colbycomms__whos_coming__enqueue_script', true ) === true ) {
			wp_enqueue_script(
				TEXT_DOMAIN,
				"{$dist}whos-coming$min.js",
				[],
				VERSION,
				true
			);
		}

		/**
		 * Filters whether to enqueue this plugin's stylesheet.
		 *
		 * @param bool Yes or no.
		 */
		if ( apply_filters( 'colbycomms__whos_coming__enqueue_style', true ) === true ) {
			wp_enqueue_style(
				TEXT_DOMAIN,
				"{$dist}whos-coming$min.css",
				[],
				VERSION
			);
		}
	}

	/**
	 * Gets the plugin's dist/ directory URL, whether this package is installed as a plugin
	 * or in a theme via composer. If the package is in neither of those places and the filter
	 * is not used, this whole thing will fail.
	 *
	 * @return string The URL.
	 */
	public static function get_dist_directory() : string {
		/**
		 * Filters the URL location of the /dist directory.
		 *
		 * @param string The URL.
		 */
		$dist = apply_filters( 'colbycomms__whos_coming__dist', '' );

		if ( ! empty( $dist ) ) {
			return $dist;
		}

		if ( file_exists( dirname( __DIR__, 3 ) . '/plugins' ) ) {
			return plugin_dir_url( dirname( __DIR__ ) . '/index.php' ) . '/dist/';
		}

		return get_template_directory_uri() . '/vendor/colbycomms/whos-coming/dist/';
	}
}
