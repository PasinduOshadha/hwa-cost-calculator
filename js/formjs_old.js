jQuery(document).ready(function ($) {
    var what_procedure, procedure_package, is_insured, your_location, hospital;
    $('.wpcf7-form').on('change', function (e) {

		//what_procedure, procedure_package, is_insured, your_location, hospital = '';
		
        what_procedure = $('input[name=what_procedure]:checked').val()
        is_insured = $('input[name=isInsured]:checked').val()
        your_location = $('input[name=states]:checked').val()
		procedure_package = $('input[name=threePackages]:checked').val()

        if (what_procedure == 'Orbera Balloon' || what_procedure == 'Endoscopic Sleeve' || what_procedure == 'CompleteCare Program') {
            $('input[name=states][value=WA]+span').parent().css('display', 'none')
        }
		
		
        

        if (your_location === 'NSW') {
            //hospital = $('input[name=stateNSW]:checked').val()
        }
        else if (your_location === 'WA') {
            //hospital = $('input[name=stateWA]:checked').val()
        }
		
		
		// hospitals
		$('input[name=oberaBallonNSW]').on('click', function(e){
			hospital = $('input[name=oberaBallonNSW]:checked').val();
		})
		
		$('input[name=abNSW]').on('click', function(e){
			hospital = $('input[name=abNSW]:checked').val();
		})
		
		$('input[name=abWA]').on('click', function(e){
			hospital = $('input[name=abWA]:checked').val();
		})
		
		$('input[name=abVIC]').on('click', function(e){
			hospital = $('input[name=abVIC]:checked').val();
		})
		
		$('input[name=abQLD]').on('click', function(e){
			hospital = $('input[name=abQLD]:checked').val();
		})
		
		$('input[name=esgAndBypassNSW]').on('click', function(e){
			hospital = $('input[name=esgAndBypassNSW]:checked').val();
		})
		
		$('input[name=esgNSW]').on('click', function(e){
			hospital = $('input[name=esgNSW]:checked').val();
		})
		
		$('input[name=lapAndBypassNSW]').on('click', function(e){
			hospital = $('input[name=lapAndBypassNSW]:checked').val();
		})
			
		
        var hospitals = [
			$('input[name=oberaBallonNSW]:checked').val(),
			$('input[name=stateNSW]:checked').val(),
			$('input[name=stateWA]:checked').val(),
			$('input[name=esgAndBypassNSW]:checked').val(),
		];
				
		console.log(procedure_package)

		
		// if it is complete care program
		if( what_procedure == 'CompleteCare Program'){
			is_insured = 'Yes';
			procedure_package = 'silver';
			hospital = 'NSW';
		}


        // click send data button on from filds changes
        var allFields = [what_procedure, is_insured, your_location, procedure_package, hospital];
        function isEmpty(value) {
            return value == null || value === "";
          }
          
          let anyEmpty = allFields.some(isEmpty);
          
          if (anyEmpty) {
            console.log("At least one variable is empty");
          } else {
            console.log("All variables have values");

            $('.send').trigger('click');
          }
		
		// setting up appointment button link
		var bookingLinks = {
			AB: 'https://healthyweightaustralia.com.au/allurion-gastric-balloon-landing-page/',
			OB: 'https://healthyweightaustralia.com.au/obera-gastric-balloon/',
			ES: 'https://healthyweightaustralia.com.au/endoscopic-sleeve-gastroplasty-landing-page/',
			LS: 'https://healthyweightaustralia.com.au/laparoscopic-landing-page/',
			GB: 'https://healthyweightaustralia.com.au/gastric-bypass-landing-page-2/',
			CC: 'https://healthyweightaustralia.com.au/complete-care-landing-page-new/'
		};
		
		//booking button link
		var aptBtn = document.querySelector('.cost-calculator .appointment-btn')
		if(what_procedure == 'Allurion Balloon'){
			aptBtn.setAttribute('href', bookingLinks.AB);
		}
		else if(what_procedure == 'Orbera Balloon'){
			aptBtn.setAttribute('href', bookingLinks.OB);
		}
		else if(what_procedure == 'Endoscopic Sleeve'){
			aptBtn.setAttribute('href', bookingLinks.ES);
		}
		else if(what_procedure == 'Laparoscopic Sleeve'){
			aptBtn.setAttribute('href', bookingLinks.LS);
		}
		else if(what_procedure == 'Gastric Bypass'){
			aptBtn.setAttribute('href', bookingLinks.GB);
		}
		else if(what_procedure == 'CompleteCare Program'){
			aptBtn.setAttribute('href', bookingLinks.CC);
		}
          
    });

    $('input[name=what_procedure], input[name=states]').on('click', function () {
		hospital = '';
        $('.total-price').html('');
        $('.pricing-breakdown').html('');
		$('.upfront-payment').html('');
		$('.medicare-rebates').html('');
		
    });

    //ajax call
    // $('.send').on('click', function (e) {
    //     //prevent Default actions
    //     e.preventDefault();

    //     // make the cost fields empty
    //     $('.pricing-breakdown').html('');
    //     $('.total-price').html('');
	// 	$('.upfront-payment').html('');
	// 	$('.medicare-rebates').html('');

    //     $.ajax({
    //         type: "POST",
    //         url: ajax_params.ajax_url,
    //         data: {
    //             action: 'medical_form_action',
    //             // action: 'medical_form_func',
    //             nonce: ajax_params.nonce,
    //             // form data starts here
    //             procedure: what_procedure,
    //             package: procedure_package,
    //             is_insured: is_insured,
    //             your_location: your_location,
    //             hospital: hospital
    //         },
    //         success: function (res) {
    //             res = JSON.parse(res)
    //             console.log(res.features_list)
    //             if(res.total == 'NOT AVAILABLE' || res.features_list == 'NOT AVAILABLE'){
    //                 $('.total-price').html(res.total);
    //                 $('.pricing-breakdown').html(res.features_list);
    //                 return false;
    //             }
    //             // return false;
    //             if(res.upfront_payment != '' && res.medicare_rebates != ''){
	// 				//else caluse was here
					
	// 				//allurion balloon QLD prices display
	// 				if(what_procedure === 'Allurion Balloon'){
	// 					$('.upfront-payment').html('Total upfront payment <span class="small">(which includes the initial deposit)</span>: ' + res.upfront_payment + "<br><span class='small'>(Depending on the Dr you see for your initial consultation)</span>");
	// 					$('.medicare-rebates').html('Applicable medicare rebates: ' + res.medicare_rebates + "<br><span class='small'>(Depending on the Dr you see for your consultation)</span>");
	// 					$('.total-price').html(`Total out of pocket cost (after Medicare rebate) : ${res.total}`);	
	// 				}
	// 				else{
	// 					$('.upfront-payment').html('Total upfront payment <span class="small">(which includes the initial deposit)</span>: $' + res.upfront_payment);
	// 					$('.medicare-rebates').html('Applicable medicare rebates: $' + res.medicare_rebates);
	// 					$('.total-price').html(`Total out of pocket cost (after Medicare rebate) : $${res.total}`);	
	// 					//$('.total-price').html(`Total out of pocket cost : $${res.total} <span class="light-font">($${res.upfront_payment} - $${res.medicare_rebates})</span>`);
	// 				}
					
	// 			}
	// 			else{
    //             	$('.total-price').html('Out of pocket cost after the rebate: ' + res.total);
	// 			}

    //             var featuresList = res.features_list
    //             var htmlTable = "<table class='price-breakdown-table'>";

    //             featuresList.forEach( item => {
    //                 htmlTable += `<tr>
    //                 <td>
    //                     <img class='checkmark' src='${window.location.origin}/wp-content/plugins/procedure-cost-calculator/img/checkmark.png' />
    //                 </td>
    //                 <td>
    //                     ${item.feature_name}
    //                 </td>
    //                 <td>
    //                     ${item.feature_price}
    //                 </td>
    //                 </tr>`;
    //             })

    //             htmlTable += "</table>";


    //             // let items = res.features.split(",");
    //             // let htmlUl = "<ul class='price-breakdown-list'>";
    //             // for (let i = 0; i < items.length; i++) {
    //             //     // htmlUl += "<li><img src='${}' />" + items[i] + "</li>";
    //             //     htmlUl += `<li><img class='checkmark' src='${window.location.origin}/wp-content/plugins/procedure-cost-calculator/img/checkmark.png' />${items[i]}</li>`;
    //             // }
    //             // htmlUl += "</ul>";
    //             $('.pricing-breakdown').html(htmlTable);
                
    //         },
    //         beforeSend: function(){
    //             var loadingState = `<img class="loading-animation" src="${window.location.origin}/wp-content/plugins/procedure-cost-calculator/img/loading.gif">`
    //             $('.pricing-breakdown').html(loadingState);
    //         },
    //         error: function (err) {
    //             //console.log(err)
    //         },
    //         complete: function(msg){
    //             console.log('res', JSON.parse(msg.responseText))
    //             // console.log('res',msg.responseText)
    //         }
    //     });
		
		
    // });

});



