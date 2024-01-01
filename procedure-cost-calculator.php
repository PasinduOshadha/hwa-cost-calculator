<?php

/**
 * Plugin Name: Cost Calculator
 * Description: A simple plugin to calculate medical program costs
 * Version: 1.1.2
 * Author: Pasindu Oshadha
 * Author URI: http://pasinduoshadha.com/
 */



/**
 * Check required plugins are active.
 */

function check_required_plugins()
{
	// is ACF PRO active
	if (is_plugin_active('advanced-custom-fields-pro/acf.php')) {
		//echo 'ACF pro plugin is active';

	} else {
		//echo 'ACF Pro plugin is not active';
		add_action('admin_notices', function () {
			$css_class = 'notice notice-error';
			$message = __('Please install and activate ACF PRO plugin to work "Cost Calculator" correctly', 'textdomain');

			printf('<div class="%1$s"><p>%2$s</p></div>', esc_attr($css_class), esc_html($message));
		});
	}

	// is CF7 conditional fileds active
	if (is_plugin_active('cf7-conditional-fields/contact-form-7-conditional-fields.php')) {
		//echo 'ACF pro plugin is active';

	} else {
		//echo 'ACF Pro plugin is not active';
		add_action('admin_notices', function () {
			$css_class = 'notice notice-error';
			$message = __('Please install and activate Conditional Fields for Contact Form 7 plugin to work "Cost Calculator" correctly', 'textdomain');

			printf('<div class="%1$s"><p>%2$s</p></div>', esc_attr($css_class), esc_html($message));
		});
	}
}
add_action('admin_init', 'check_required_plugins');


// Cost Calculator Options Page
if (function_exists('acf_add_options_page')) {

	acf_add_options_page(array(
		'page_title'    => 'Program Packages',
		'menu_title'    => 'Program Packages',
		'menu_slug'     => 'program-pacakages',
		'capability'    => 'edit_posts',
		'redirect'      => false
	));
}

// Remove <p> and <br/> from Contact Form 7
add_filter('wpcf7_autop_or_not', '__return_false');

// ajax js file register
add_action("wp_enqueue_scripts", "register_js_files");
function register_js_files()
{
	// stylesheet
	wp_enqueue_style('cost-calculator-styles', plugin_dir_url(__FILE__) . "css/calculator-styles.css", array('contact-form-7', 'cf7cf-style'), '1.0.0', 'all');
	wp_enqueue_style('butterup-styles', plugin_dir_url(__FILE__) . "css/butterup.min.css", array('contact-form-7', 'cf7cf-style'), '1.0.0', 'all');
	wp_enqueue_script("my_ajax_script", plugin_dir_url(__FILE__) . "js/cost-cal-form.js", array('jquery-core'));
	wp_enqueue_script("butter_up_toast", plugin_dir_url(__FILE__) . "js/butterup.min.js", array());

	wp_localize_script('my_ajax_script', 'ajax_params', array(
		'ajax_url' => admin_url('admin-ajax.php'),
		'nonce' => wp_create_nonce('ajax-nonce'),
	));
	wp_enqueue_script('ajax_scripts');
}

// Cost Calculators
add_action('wp_ajax_medical_form_action', 'medical_form_action'); // for logged in users only
add_action('wp_ajax_nopriv_medical_form_action', 'medical_form_action'); // for ALL users

// function medical_form_action()
// {

//     if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
//         die('Busted!');
//     }

//     if (!empty($_POST['procedure'])) {
//         $procedure = $_POST['procedure'];
//     }

//     if (!empty($_POST['package'])) {
//         $package = $_POST['package'];
//     }

//     if (!empty($_POST['is_insured'])) {
//         $is_insured = ($_POST['is_insured'] == 'Yes') ? 'insured' : 'uninsured';
//     }

//     if (!empty($_POST['your_location'])) {
//         $your_location = $_POST['your_location'];
//     }

//     if (!empty($_POST['state'])) {
//         $states = $_POST['state'];
//     }

//     if (!empty($_POST['hospital'])) {
//         $hospital = $_POST['hospital'];
//     }

//     //echo $is_insured;

//     if (have_rows('programs', 'option')) :

//         while (have_rows('programs', 'option')) : the_row();

//             if (get_sub_field('procedure_name') == $procedure) {

//                 $program_locations = explode(',', get_sub_field('locations'));

//                 if (in_array($your_location, $program_locations)) {

//                     // get procedure  program data from ACF
//                     $program_data = get_row([$format_value = true]);

//                     if (strtolower($package) == 'silver') {

//                         $total_cost = $program_data[$is_insured . '_rates'][$is_insured . '_procedure_packages'][0]['package_price'];
//                         //$features = $program_data[$is_insured . '_rates'][$is_insured . '_procedure_packages'][0]['features'];

//                         $features_list = $program_data[$is_insured . '_rates'][$is_insured . '_procedure_packages'][0]['features_list'];
//                     }

//                     else if (strtolower($package) == 'gold') {

//                         $total_cost = $program_data[$is_insured . '_rates'][$is_insured . '_procedure_packages'][1]['package_price'];
//                         //$features = $program_data[$is_insured . '_rates'][$is_insured . '_procedure_packages'][1]['features'];

//                         $features_list = $program_data[$is_insured . '_rates'][$is_insured . '_procedure_packages'][1]['features_list'];
//                     }

//                     else if (strtolower($package) == 'platinum') {

//                         $total_cost = $program_data[$is_insured . '_rates'][$is_insured . '_procedure_packages'][2]['package_price'];
//                         //$features = $program_data[$is_insured . '_rates'][$is_insured . '_procedure_packages'][2]['features'];

//                         $features_list = $program_data[$is_insured . '_rates'][$is_insured . '_procedure_packages'][2]['features_list'];
//                     }
//                 } else {
//                     $total_cost = 'NOT AVAILABLE';
//                     $features_list = 'NOT AVAILABLE';
//                 }
//             }

//         endwhile;

//     endif;

//     // final price
//     //echo $total_cost;
//     $result = array(
// 			'total'         	=> $total_cost,
// 			//'features'      	=> $features,
// 			'features_list'  	=> $features_list,
// 			'upfront_payment' 	=> '',
// 			'medicare_rebates'	=> ''
// 	);



//     //Alurion Balun WA Costs
//     if('Allurion Balloon' == $procedure && 'WA' == $your_location){

// 		if( 'silver' == strtolower($package) ){

// 			$result['total'] = '7,250';

// 		}

// 		elseif ( 'gold' == strtolower($package) ){

// 			$result['total'] = '7,950';

// 		}

// 		elseif( 'platinum' == strtolower($package) ){

// 			$result['total'] = '14,150';

// 		}


// 	}

// 	//Allurion Balloon
// 	if('Allurion Balloon' == $procedure){

// 		//NSW new prices
// 		if('NSW' == $your_location){
// 			if( 'silver' == strtolower($package) ){
// 				$result['upfront_payment'] = '$6,864.00';
// 				$result['medicare_rebates'] = '$214.00';
// 				$result['total'] = '$6,650.00';
// 			}
// 			else if( 'gold' == strtolower($package) ){
// 				$result['upfront_payment'] = '$7,635.00';
// 				$result['medicare_rebates'] = '$285.00';
// 				$result['total'] = '$7,350.00';
// 			}
// 			else if( 'platinum' == strtolower($package) ){
// 				$result['upfront_payment'] = '$13,549.00';
// 				$result['medicare_rebates'] = '$499.00';
// 				$result['total'] = '$13,050.00';
// 			}
// 		}

// 		//WA new prices
// 		else if('WA' == $your_location){
// 			if( 'silver' == strtolower($package) ){
// 				$result['upfront_payment'] = '$7,464.00';
// 				$result['medicare_rebates'] = '$214.00';
// 				$result['total'] = '$7,250.00';
// 			}
// 			else if( 'gold' == strtolower($package) ){
// 				$result['upfront_payment'] = '$8,235.00';
// 				$result['medicare_rebates'] = '$285.00';
// 				$result['total'] = '$7,950.00';
// 			}
// 			else if( 'platinum' == strtolower($package) ){
// 				$result['upfront_payment'] = '$14,649.00';
// 				$result['medicare_rebates'] = '$499.00';
// 				$result['total'] = '$14,150.00';
// 			}
// 		}

// 		//VIC new prices
// 		else if('VIC' == $your_location){
// 			if( 'silver' == strtolower($package) ){
// 				$result['upfront_payment'] = '$7,464.00';
// 				$result['medicare_rebates'] = '$214.00';
// 				$result['total'] = '$7,250.00';
// 			}
// 			else if( 'gold' == strtolower($package) ){
// 				$result['upfront_payment'] = '$8,235.00';
// 				$result['medicare_rebates'] = '$285.00';
// 				$result['total'] = '$7,950.00';
// 			}
// 			else if( 'platinum' == strtolower($package) ){
// 				$result['upfront_payment'] = '$14,649.00';
// 				$result['medicare_rebates'] = '$499.00';
// 				$result['total'] = '$14,150.00';
// 			}
// 		}

// 		//QLD new prices
// 		else if('QLD' == $your_location){
// 			if( 'silver' == strtolower($package) ){
// 				$result['upfront_payment'] = '$7,250.00 to $7,464.00';
// 				$result['medicare_rebates'] = '$0 - $214.00';
// 				$result['total'] = '$7,250.00';
// 			}
// 			else if( 'gold' == strtolower($package) ){
// 				$result['upfront_payment'] = '$7,950.00 to $8,235.00';
// 				$result['medicare_rebates'] = '$0 - $285.00';
// 				$result['total'] = '$7,950.00';
// 			}
// 			else if( 'platinum' == strtolower($package) ){
// 				$result['upfront_payment'] = '$14,150.00 - $14,649.00';
// 				$result['medicare_rebates'] = '$0 - $499.00';
// 				$result['total'] = '$14,150.00';
// 			}
// 		}

// 	}
// 	else if('Orbera Balloon' == $procedure){
// 		//NSW
// 		if( 'NSW' == $your_location ){
// 			if( 'silver' == strtolower($package) ){
// 				$result['upfront_payment'] = '7,521.00';
// 				$result['medicare_rebates'] = '571.00';
// 				$result['total'] = '6,950.00';
// 			}
// 			else if( 'gold' == strtolower($package) ){
// 				$result['upfront_payment'] = '8,635.00';
// 				$result['medicare_rebates'] = '785.00';
// 				$result['total'] = '7,850.00';
// 			}
// 			else if( 'platinum' == strtolower($package) ){
// 				$result['upfront_payment'] = '14,642.00';
// 				$result['medicare_rebates'] = '1,142.00';
// 				$result['total'] = '13,500.00';
// 			}
// 		}
// 	}

// 	else if('Endoscopic Sleeve' == $procedure){
// 		//NSW
// 		if( 'NSW' == $your_location ){
// 			if( 'silver' == strtolower($package) ){
// 				$result['upfront_payment'] = '16,492.00';
// 				$result['medicare_rebates'] = '642.00';
// 				$result['total'] = '15,850';
// 			}
// 			else if( 'gold' == strtolower($package) ){
// 				$result['upfront_payment'] = '17,706.00';
// 				$result['medicare_rebates'] = '856.00';
// 				$result['total'] = '16,850';
// 			}
// 			else if( 'platinum' == strtolower($package) ){
// 				$result['upfront_payment'] = '19,520';
// 				$result['medicare_rebates'] = '1,070';
// 				$result['total'] = '18,450';
// 			}
// 		}
// 	}
// 	else if('Laparoscopic Sleeve' == $procedure){
// 		//NSW
// 		if( 'NSW' == $your_location ){
// 			if('insured' == $is_insured){
// 				if( 'silver' == strtolower($package) ){
// 					$result['upfront_payment'] = '7,247.00';
// 					$result['medicare_rebates'] = '1,297.00';
// 					$result['total'] = '5,950';
// 				}
// 				else if( 'gold' == strtolower($package) ){
// 					$result['upfront_payment'] = '8,661.00';
// 					$result['medicare_rebates'] = '1,151.00';
// 					$result['total'] = '7,150.00';
// 				}
// 				else if( 'platinum' == strtolower($package) ){
// 					$result['upfront_payment'] = '10,375.00';
// 					$result['medicare_rebates'] = '1,725.00';
// 					$result['total'] = '8,650';
// 				}
// 			}
// 			else if('uninsured' == $is_insured){
// 				if( 'silver' == strtolower($package) ){
// 					$result['upfront_payment'] = '19,889.00';
// 					$result['medicare_rebates'] = '1,339.00';
// 					$result['total'] = '18,550';
// 				}
// 				else if( 'gold' == strtolower($package) ){
// 					$result['upfront_payment'] = '21,203.00';
// 					$result['medicare_rebates'] = '1,553.00';
// 					$result['total'] = '19,650.00';
// 				}
// 				else if( 'platinum' == strtolower($package) ){
// 					$result['upfront_payment'] = '22,967.00';
// 					$result['medicare_rebates'] = '1,7167.00';
// 					$result['total'] = '21,200.00';
// 				}
// 			}

// 		}
// 	}
// 	else if('Gastric Bypass' == $procedure){
// 		//NSW
// 		if( 'NSW' == $your_location ){
// 			if('insured' == $is_insured){
// 				if( 'silver' == strtolower($package) ){
// 					$result['upfront_payment'] = '8,661.00';
// 					$result['medicare_rebates'] = '1,511.00';
// 					$result['total'] = '7,150.00';
// 				}
// 				else if( 'gold' == strtolower($package) ){
// 					$result['upfront_payment'] = '22,689.00';
// 					$result['medicare_rebates'] = '1,939700';
// 					$result['total'] = '20,950.00';
// 				}
// 				else if( 'platinum' == strtolower($package) ){
// 					$result['upfront_payment'] = '11,389.00';
// 					$result['medicare_rebates'] = '1,939.00';
// 					$result['total'] = '9,450.00';
// 				}
// 			}
// 			else if('uninsured' == $is_insured){
// 				if( 'silver' == strtolower($package) ){
// 					$result['upfront_payment'] = '21,475.00';
// 					$result['medicare_rebates'] = '1,525.00';
// 					$result['total'] = '19,950.00';
// 				}
// 				else if( 'gold' == strtolower($package) ){
// 					$result['upfront_payment'] = '21,475.00';
// 					$result['medicare_rebates'] = '1,525.00';
// 					$result['total'] = '19,950.00';
// 				}
// 				else if( 'platinum' == strtolower($package) ){
// 					$result['upfront_payment'] = '24,553.00';
// 					$result['medicare_rebates'] = '1,953.00';
// 					$result['total'] = '22,600.00';
// 				}
// 			}

// 		}
// 	}
// 	else if('CompleteCare Program' == $procedure){
// 		//NSW
// 		if( 'NSW' == $your_location ){

// 			$result['upfront_payment'] = '3,078.00';
// 			$result['medicare_rebates'] = '428.00';
// 			$result['total'] = '2,650.00';

// 		}
// 	}


//     echo json_encode($result);
//     wp_die();
// }

function medical_form_action()
{
	if (!wp_verify_nonce($_POST['nonce'], 'ajax-nonce')) {
		die('Busted!');
	}

	if (!empty($_POST['procedure'])) {
		$procedure = $_POST['procedure'];
	}

	if (!empty($_POST['package'])) {
		$package = $_POST['package'];
	}

	if (!empty($_POST['is_insured'])) {
		$is_insured = $_POST['is_insured'];
	}

	// if (!empty($_POST['your_location'])) {
	// 	$your_location = $_POST['your_location'];
	// }

	if (!empty($_POST['your_location'])) {
		$state = $_POST['your_location'];
	}

	// if (!empty($_POST['hospital'])) {
	// 	$hospital = $_POST['hospital'];
	// }

	$recieved_query = array(
		'procedurename'			=> $procedure,
		'packagename'			=> $package,
		'is_insured'			=> $is_insured,
		'state'					=> $state,
	);

	$response = array(
		'query'					=> $recieved_query
	);



	if (have_rows('procedure_details', 'option')):


		while (have_rows('procedure_details', 'option')) : the_row();

			$procedure_data = get_row([$format_value = true]);

			// looking for a macthing query
			if (
			strtolower( get_sub_field('procedure_name') ) === strtolower( $procedure ) &&
			strtolower( get_sub_field('package_name') ) === strtolower( $package ) &&
			strtolower( get_sub_field('is_insured') ) === strtolower( $is_insured ) &&
			strtolower( get_sub_field('state') ) === strtolower( $state )
			) {
				// $response["mydata_found"] = $procedure_data['pricing']['medicare_rebates'];

				// response status
				$response['res_status'] = 'success';

				// package contents
				$response['data']['contents'] = get_sub_field('package_contents');

				// package pricing
				$response['data']['pricing']['total_upfront'] = $procedure_data['pricing']['total_upfront'];
				$response['data']['pricing']['medicare_rebates'] = $procedure_data['pricing']['medicare_rebates'];
				$response['data']['pricing']['out_of_the_pocket'] = $procedure_data['pricing']['out_of_the_pocket'];

			}

			else {

				$response['res_status'] = 'not_found';
				$response['data'] = '';
			}




		endwhile;
	

	endif;


	echo json_encode($response);
	wp_die();
}
