<?php

/**
 * Salient functions and definitions.
 *
 * @package Salient
 * @since 1.0
 */


 /**
  * Define Constants.
  */


define( 'NECTAR_THEME_DIRECTORY', get_template_directory() );
define( 'NECTAR_FRAMEWORK_DIRECTORY', get_template_directory_uri() . '/nectar/' );
define( 'NECTAR_THEME_NAME', 'salient' );


if ( ! function_exists( 'get_nectar_theme_version' ) ) {
	function nectar_get_theme_version() {
		return '15.0.8';
	}
}


/**
 * Load text domain.
 */
add_action( 'after_setup_theme', 'nectar_lang_setup' );

if ( ! function_exists( 'nectar_lang_setup' ) ) {
	function nectar_lang_setup() {
		load_theme_textdomain( 'salient', get_template_directory() . '/lang' );
	}
}


/**
 * General WordPress.
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/wp-general.php';


/**
 * Get Salient theme options.
 */
function get_nectar_theme_options() {

	$legacy_options  = get_option( 'salient' );
	$current_options = get_option( 'salient_redux' );
	
	if ( ! empty( $current_options ) && is_array($current_options) ) {
		return $current_options;
	} elseif ( ! empty( $legacy_options ) && is_array($legacy_options) ) {
		return $legacy_options;
	} else {
		return array();
	}
}

$nectar_options                    = get_nectar_theme_options();
$nectar_get_template_directory_uri = get_template_directory_uri();


require_once NECTAR_THEME_DIRECTORY . '/includes/class-nectar-theme-manager.php';


/**
 * Register/Enqueue theme assets.
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/icon-collections.php';
require_once NECTAR_THEME_DIRECTORY . '/includes/class-nectar-element-assets.php';
require_once NECTAR_THEME_DIRECTORY . '/includes/class-nectar-element-styles.php';
require_once NECTAR_THEME_DIRECTORY . '/includes/class-nectar-lazy.php';
require_once NECTAR_THEME_DIRECTORY . '/includes/class-nectar-delay-js.php';
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/enqueue-scripts.php';
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/enqueue-styles.php';
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/dynamic-styles.php';


/**
 * Salient Plugin notices.
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/plugin-notices/salient-plugin-notices.php';


/**
 * Salient welcome page.
 */
 require_once NECTAR_THEME_DIRECTORY . '/nectar/welcome/welcome-page.php';


/**
 * Theme hooks & actions.
 */
function nectar_hooks_init() {

	require_once NECTAR_THEME_DIRECTORY . '/nectar/hooks/hooks.php';
	require_once NECTAR_THEME_DIRECTORY . '/nectar/hooks/actions.php';

}

add_action( 'after_setup_theme', 'nectar_hooks_init', 10 );


/**
 * Post category meta.
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/meta/category-meta.php';


/**
 * Media and theme image sizes.
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/media.php';


/**
 * Navigation menus
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/assets/functions/wp-menu-custom-items/menu-item-custom-fields.php';
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/nav-menus.php';


/**
 * TGM Plugin inclusion.
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/tgm-plugin-activation/class-tgm-plugin-activation.php';
require_once NECTAR_THEME_DIRECTORY . '/nectar/tgm-plugin-activation/required_plugins.php';


/**
 * WPBakery functionality.
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/wpbakery-init.php';


/**
 * Theme skin specific class and assets.
 */
$nectar_theme_skin    = NectarThemeManager::$skin;
$nectar_header_format = ( ! empty( $nectar_options['header_format'] ) ) ? $nectar_options['header_format'] : 'default';

add_filter( 'body_class', 'nectar_theme_skin_class' );

function nectar_theme_skin_class( $classes ) {
	global $nectar_theme_skin;
	$classes[] = $nectar_theme_skin;
	return $classes;
}


function nectar_theme_skin_css() {
	global $nectar_theme_skin;
	wp_enqueue_style( 'skin-' . $nectar_theme_skin );
}

add_action( 'wp_enqueue_scripts', 'nectar_theme_skin_css' );



/**
 * Search related.
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/search.php';


/**
 * Register Widget areas.
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/widget-related.php';


/**
 * Header navigation helpers.
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/header.php';


/**
 * Blog helpers.
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/blog.php';


/**
 * Page helpers.
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/page.php';
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/footer.php';

/**
 * Theme options panel (Redux).
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/redux-salient.php';


/**
 * WordPress block editor helpers (Gutenberg).
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/gutenberg.php';


/**
 * Admin assets.
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/admin-enqueue.php';


/**
 * Pagination Helpers.
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/pagination.php';


/**
 * Page header.
 */
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/page-header.php';


/**
 * Third party.
 */
require_once NECTAR_THEME_DIRECTORY . '/includes/third-party-integrations/seo.php';
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/wpml.php';
require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/woocommerce.php';


/**
 * v10.5 update assist.
 */
 require_once NECTAR_THEME_DIRECTORY . '/nectar/helpers/update-assist.php';
 
 

/**
 * ========================================
 * CUSTOM SITEMAP FUNCTIONALITY
 * ========================================
 * 
 * Custom XML Sitemap at /sitemap_aksias.xml
 * 
 * This creates a custom sitemap that includes all published posts and pages
 * with proper XML formatting and SEO optimization.
 * 
 * Added by: Custom Development
 * Date: 2024
 */

// Add rewrite rule for custom sitemap
add_action('init', function () {
    add_rewrite_rule('^sitemap_aksias\.xml$', 'index.php?sitemap_aksias=1', 'top');
});

// Alternative approach: Catch sitemap request early
add_action('parse_request', function ($wp) {
    if (isset($wp->query_vars['sitemap_aksias']) || 
        (isset($_GET['sitemap_aksias']) && $_GET['sitemap_aksias'] == '1')) {
        
        // Completely bypass WordPress output
        while (ob_get_level()) {
            ob_end_clean();
        }
        
        // Set headers
        header('Content-Type: application/xml; charset=utf-8');
        header('X-Robots-Tag: noindex');
        
        // Generate and output sitemap
        echo generate_sitemap_xml();
        exit;
    }
});

// Add custom query variable
add_filter('query_vars', function ($vars) {
    $vars[] = 'sitemap_aksias';
    return $vars;
});

// Handle sitemap generation
add_action('template_redirect', function () {
    if (get_query_var('sitemap_aksias')) {
        // Completely clear all output buffers
        while (ob_get_level()) {
            ob_end_clean();
        }
        
        // Disable all WordPress output
        remove_all_actions('wp_head');
        remove_all_actions('wp_footer');
        remove_all_actions('wp_print_styles');
        remove_all_actions('wp_print_scripts');
        
        // Set proper headers
        header('Content-Type: application/xml; charset=utf-8');
        header('X-Robots-Tag: noindex');
        header('Cache-Control: public, max-age=3600');
        
        // Generate sitemap content
        $sitemap_content = generate_sitemap_xml();
        
        // Output directly without any buffering
        echo $sitemap_content;
        exit;
    }
});

// Function to generate sitemap XML content
function generate_sitemap_xml() {
    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    // Add homepage
    $xml .= '  <url>' . "\n";
    $xml .= '    <loc>' . esc_url(home_url('/')) . '</loc>' . "\n";
    $xml .= '    <lastmod>' . date('c') . '</lastmod>' . "\n";
    $xml .= '    <changefreq>daily</changefreq>' . "\n";
    $xml .= '    <priority>1.0</priority>' . "\n";
    $xml .= '  </url>' . "\n";

    // Query all published posts and pages
    $args = [
        'post_type'      => ['post', 'page'],
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'orderby'        => 'modified',
        'order'          => 'DESC',
        'meta_query'     => [
            [
                'key'     => '_yoast_wpseo_meta-robots-noindex',
                'compare' => 'NOT EXISTS'
            ]
        ]
    ];
    
    $posts = get_posts($args);

    foreach ($posts as $post) {
        // Skip if post is noindex
        if (get_post_meta($post->ID, '_yoast_wpseo_meta-robots-noindex', true) === '1') {
            continue;
        }
        
        $xml .= '  <url>' . "\n";
        $xml .= '    <loc>' . esc_url(get_permalink($post)) . '</loc>' . "\n";
        $xml .= '    <lastmod>' . get_the_modified_time('c', $post) . '</lastmod>' . "\n";
        $xml .= '    <changefreq>weekly</changefreq>' . "\n";
        
        // Set priority based on post type
        $priority = ($post->post_type === 'page') ? '0.9' : '0.8';
        $xml .= '    <priority>' . $priority . '</priority>' . "\n";
        $xml .= '  </url>' . "\n";
    }

    $xml .= '</urlset>';
    
    return $xml;
}

/**
 * Flush rewrite rules on theme activation
 * This ensures the custom sitemap URL works immediately
 */
add_action('after_switch_theme', function () {
    flush_rewrite_rules();
});

/**
 * Debug function to test sitemap rewrite
 * Remove this after testing - it's only for debugging
 */
add_action('template_redirect', function () {
    if (isset($_GET['debug_sitemap'])) {
        wp_die('Sitemap rewrite is working! Query var: ' . get_query_var('sitemap_aksias'));
    }
});

/**
 * Simple test sitemap - minimal version for debugging
 */
add_action('parse_request', function ($wp) {
    if (isset($_GET['test_sitemap']) && $_GET['test_sitemap'] == '1') {
        // Clear all output
        while (ob_get_level()) {
            ob_end_clean();
        }
        
        header('Content-Type: application/xml; charset=utf-8');
        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        echo '  <url>' . "\n";
        echo '    <loc>' . home_url('/') . '</loc>' . "\n";
        echo '    <lastmod>' . date('c') . '</lastmod>' . "\n";
        echo '    <changefreq>daily</changefreq>' . "\n";
        echo '    <priority>1.0</priority>' . "\n";
        echo '  </url>' . "\n";
        echo '</urlset>';
        exit;
    }
});

/**
 * Add sitemap link to robots.txt
 */
add_filter('robots_txt', function ($output, $public) {
    if ($public) {
        $output .= "\nSitemap: " . home_url('/sitemap_aksias.xml') . "\n";
    }
    return $output;
}, 10, 2);

/**
 * Performance optimization: Disable unnecessary features for sitemap
 */
add_action('template_redirect', function () {
    if (get_query_var('sitemap_aksias')) {
        // Disable plugins that might interfere
        remove_action('wp_head', 'wp_generator');
        remove_action('wp_head', 'wlwmanifest_link');
        remove_action('wp_head', 'rsd_link');
        remove_action('wp_head', 'wp_shortlink_wp_head');
        
        // Disable caching plugins for sitemap
        if (function_exists('wp_cache_clear_cache')) {
            wp_cache_clear_cache();
        }
    }
});

/**
 * Security: Prevent direct access to sitemap files
 */
add_action('init', function () {
    if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], 'sitemap_aksias.xml') !== false) {
        // Allow only GET requests
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            wp_die('Method not allowed', 'Method Not Allowed', ['response' => 405]);
        }
    }
});

/**
 * Log sitemap access for analytics (optional)
 */
add_action('template_redirect', function () {
    if (get_query_var('sitemap_aksias')) {
        // Log sitemap access
        error_log('Sitemap accessed: ' . $_SERVER['REMOTE_ADDR'] . ' - ' . date('Y-m-d H:i:s'));
    }
});

/**
 * Add custom sitemap to WordPress admin
 */
add_action('admin_menu', function () {
    add_management_page(
        'Custom Sitemap',
        'Custom Sitemap',
        'manage_options',
        'custom-sitemap',
        function () {
            echo '<div class="wrap">';
            echo '<h1>Custom Sitemap</h1>';
            echo '<p>Your custom sitemap is available at: <a href="' . home_url('/sitemap_aksias.xml') . '" target="_blank">' . home_url('/sitemap_aksias.xml') . '</a></p>';
            echo '<p><strong>Instructions:</strong></p>';
            echo '<ol>';
            echo '<li>Make sure to flush rewrite rules by going to Settings → Permalinks and clicking "Save Changes"</li>';
            echo '<li>Test your sitemap URL: <a href="' . home_url('/sitemap_aksias.xml') . '" target="_blank">' . home_url('/sitemap_aksias.xml') . '</a></li>';
            echo '<li>Submit your sitemap to Google Search Console</li>';
            echo '</ol>';
            echo '</div>';
        }
    );
});

/**
 * Add sitemap link to admin bar
 */
add_action('admin_bar_menu', function ($wp_admin_bar) {
    $wp_admin_bar->add_node([
        'id'    => 'custom-sitemap',
        'title' => 'Custom Sitemap',
        'href'  => home_url('/sitemap_aksias.xml'),
        'meta'  => [
            'target' => '_blank',
            'title'  => 'View Custom Sitemap'
        ]
    ]);
}, 100);

/**
 * Function to manually flush rewrite rules
 * Call this function if you need to flush rules programmatically
 */
function flush_custom_rewrite_rules() {
    flush_rewrite_rules();
}

/**
 * Check if sitemap is working
 * Returns true if sitemap is accessible, false otherwise
 */
function check_sitemap_status() {
    $sitemap_url = home_url('/sitemap_aksias.xml');
    $response = wp_remote_get($sitemap_url);
    
    if (is_wp_error($response)) {
        return false;
    }
    
    $status_code = wp_remote_retrieve_response_code($response);
    return $status_code === 200;
}

/**
 * Get sitemap statistics
 * Returns array with sitemap stats
 */
function get_sitemap_stats() {
    $args = [
        'post_type'      => ['post', 'page'],
        'post_status'    => 'publish',
        'posts_per_page' => -1,
    ];
    
    $posts = get_posts($args);
    
    return [
        'total_posts' => count($posts),
        'last_updated' => get_option('sitemap_last_updated', 'Never'),
        'sitemap_url' => home_url('/sitemap_aksias.xml')
    ];
}

/**
 * Update sitemap timestamp when content changes
 */
add_action('save_post', function ($post_id) {
    if (get_post_status($post_id) === 'publish') {
        update_option('sitemap_last_updated', current_time('mysql'));
    }
});

/**
 * Clean up on theme deactivation
 */
add_action('switch_theme', function () {
    flush_rewrite_rules();
});

// End of custom sitemap functions

?>