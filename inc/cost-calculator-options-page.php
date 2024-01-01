<?php

// Remove <p> and <br/> from Contact Form 7
add_filter('wpcf7_autop_or_not', '__return_false');

if( function_exists('acf_add_options_page') ) {
    
    acf_add_options_page(array(
        'page_title'    => 'Program Packages',
        'menu_title'    => 'Program Packages',
        'menu_slug'     => 'program-pacakages',
        'capability'    => 'edit_posts',
        'redirect'      => false
    ));
    

    
}
