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
            return value === null || value === "";
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
    $('.send').on('click', function (e) {
        //prevent Default actions
        e.preventDefault();

        // make the cost fields empty
        $('.pricing-breakdown').html('');
        $('.total-price').html('');
		$('.upfront-payment').html('');
		$('.medicare-rebates').html('');

        $.ajax({
            type: "POST",
            url: ajax_params.ajax_url,
            data: {
                action: 'medical_form_action',
                // action: 'medical_form_func',
                nonce: ajax_params.nonce,
                // form data starts here
                procedure: what_procedure,
                package: procedure_package,
                is_insured: is_insured,
                your_location: your_location,
                hospital: hospital
            },
            beforeSend: function(){
                var loadingState = `<img class="loading-animation" src="${window.location.origin}/wp-content/plugins/procedure-cost-calculator/img/loading.gif">`
                $('.pricing-breakdown').html(loadingState);
                console.log('sending...')
            },
            error: function (err) {
                console.log(err)
            },
            success: function(response){
                console.log("success res: ", JSON.parse(response));
                const res = JSON.parse(response);
                
                if(res.res_status === 'success'){
                    
                    //Allurion balloon prices display
					if(res.data.procedure_name === 'Allurion Balloon'){
					    //$('.upfront-payment').html('hey');
						$('.upfront-payment').html('Total upfront payment <span class="small">(which includes the initial deposit)</span>: ' + res.data.pricing.total_upfront + "<br><span class='small'>(Depending on the Dr you see for your initial consultation)</span>");
						$('.medicare-rebates').html('Applicable medicare rebates: ' + res.data.pricing.medicare_rebates + "<br><span class='small'>(Depending on the Dr you see for your consultation)</span>");
						$('.total-price').html(`Total out of pocket cost (after Medicare rebate) : ${res.data.pricing.out_of_the_pocket}`);	
					}
					else{
						$('.upfront-payment').html('Total upfront payment <span class="small">(which includes the initial deposit)</span>: ' + res.data.pricing.total_upfront);
						$('.medicare-rebates').html('Applicable medicare rebates: ' + res.data.pricing.medicare_rebates);
						$('.total-price').html(`Total out of pocket cost (after Medicare rebate) : ${res.data.pricing.out_of_the_pocket}`);	
						//$('.total-price').html(`Total out of pocket cost : $${res.total} <span class="light-font">($${res.upfront_payment} - $${res.medicare_rebates})</span>`);
					}
					
					const featuresList = res.data.package_contents;
					var htmlTable = "<table class='price-breakdown-table fade-in'>";
					
                    featuresList.forEach( item => {
                        htmlTable += `<tr>
                        <td>
                            <img class='checkmark' src='${window.location.origin}/wp-content/plugins/procedure-cost-calculator/img/checkmark.png' />
                        </td>
                        <td style="color: #000;">
                            ${item.package_content_item}
                        </td>
                        </tr>`;
                    })
                    
                    htmlTable += "</table>";
                    
                    $('.pricing-breakdown').html(htmlTable);
					
					
                }
            },
            complete: function(msg){
                //console.log('res', JSON.parse(msg.responseText))
                // console.log('res',msg.responseText)
            }
        });
		
		
    });

});



