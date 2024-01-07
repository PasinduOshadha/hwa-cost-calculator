jQuery(document).ready(function ($) {

    // get field values from the form
    // valideate them

    // send them via JS and get response


    // let data vairables
    let procedureName, procedurePackage, isInsured, state, medicalCentre = '';

    // this varibale is to set if all the form fields are filled and ready to be calculated
    let isFormValid = false;

    // helpers
    function isEmpty(value) {
        return value == null || value === "";
    }

    function isEmpty(value) {
        return value == null || value === "";
    }





    // set appointment button link
    function setBookingUrl(procedure_Name) {

        if (procedure_Name !== '') {

            console.log('procedure_Name: ', procedure_Name)

            var bookingLinks = {
                'Allurion Balloon': 'https://healthyweightaustralia.com.au/allurion-gastric-balloon-landing-page/',
                'Orbera Balloon': 'https://healthyweightaustralia.com.au/obera-gastric-balloon/',
                'Endoscopic Sleeve': 'https://healthyweightaustralia.com.au/endoscopic-sleeve-gastroplasty-landing-page/',
                'Laparoscopic Sleeve': 'https://healthyweightaustralia.com.au/laparoscopic-landing-page/',
                'Gastric Bypass': 'https://healthyweightaustralia.com.au/gastric-bypass-landing-page-2/',
                'CompleteCare Program': 'https://healthyweightaustralia.com.au/complete-care-landing-page-new/'
            };
        }

        else {

            bookingLinks.procedure_Name = '/locations/';
        }

        // $('.action-button-group').css('display', 'block');
        $('.appointment-btn').css('display', 'block');
        $('.appointment-btn').attr('href', bookingLinks[procedure_Name]);

    }




    $('.wpcf7-form').on('change', function (e) {


        // form data
        procedureName = $('input[name=procedureName]:checked').val()
        procedurePackage = $('input[name=procedurePackage]:checked').val()
        isInsured = $('input[name=isInsured]:checked').val()
        state = $('input[name=state]:checked').val()

        // remove WA if the procedure name is one of below
        if (procedureName == 'Orbera Balloon' || procedureName == 'Endoscopic Sleeve' || procedureName == 'CompleteCare Program') {
            $('input[name=states][value=WA]+span').parent().css('display', 'none')
        }


        // getting a value for hospital based on the state : medicalCentre is not important for price calculations
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

        const allFields = [procedureName, procedurePackage, isInsured, state, hospital]

        let anyEmpty = allFields.some(isEmpty);

        if (anyEmpty) {
            console.log("At least one variable is empty");
        } else {
            console.log("All variables have values");

            $('.send').trigger('click');
        }

    })




    // Data sending 
    $('.send').on('click', function (e) {

        e.preventDefault();

        console.log('-------')
        console.log(procedureName)
        console.log(procedurePackage)
        console.log(isInsured)
        console.log(state)
        console.log(hospital)



        // send data
        $.ajax({
            type: "POST",
            url: ajax_params.ajax_url,
            data: {
                action: 'medical_form_action',
                nonce: ajax_params.nonce,
                procedure: procedureName,
                package: procedurePackage,
                is_insured: isInsured,
                your_location: state,
                // hospital: hospital
            },
            // dataType: "dataType",
            success: function (response) {
                response = JSON.parse(response);
                console.log(response);

                if (response.res_status === 'success') {

                    // reseting the exsiting fields
                    $('.contents-table').html('');
                    $('.pricing-breakdown').html('');
                    $('.appointment-btn').css('display', 'none');

                    // features list HTML element generation
                    var featuresList = response.data.contents;

                    var featuresEl = '<ul class="features-list">';

                    featuresList.forEach(item => {

                        featuresEl += `<li class="features-list-item">
                        <span><img src="https://healthyweightaustralia.com.au/wp-content/plugins/procedure-cost-calculator/img/checkmark.png"  class="check-icon"/></span>
                        <span>${item.package_content_item}</span>
                        </li>`;
                    })

                    featuresEl += '</ul>';


                    // pricing HTML element generation
                    var upfrontEl = `<div class="upfront">`;
                    upfrontEl += `<span class="main-pricing-term">Total upfront payment (which includes the initial deposit): ${response.data.pricing.total_upfront}</span>`;
                    upfrontEl += `<span class="small">(Depending on the Dr you see for your initial consultation)</span>`;
                    upfrontEl += `</div>`;

                    var medicareRebates = `<div class="medicare-rebates">`;
                    medicareRebates += `<span class="main-pricing-term">Applicable medicare rebates: ${response.data.pricing.medicare_rebates}</span>`;
                    medicareRebates += `<span class="small">(Depending on the Dr you see for your consultation)</span>`;
                    medicareRebates += `</div>`;

                    var totalOutOfPockets = `<div class="medicare-rebates">`;
                    totalOutOfPockets += `<span class="main-pricing-term total-out-of-pocket">Total out of pocket cost (after Medicare rebate): ${response.data.pricing.total_upfront}</span>`;
                    totalOutOfPockets += `</div>`;


                    // features list
                    $('.contents-table').html(featuresEl);

                    // pricing breakdown
                    $('.pricing-breakdown').html(upfrontEl + medicareRebates + totalOutOfPockets);

                    // set oppintment link
                    setBookingUrl('Allurion Balloon');

                }

                else {
                    // reseting the exsiting fields
                    $('.contents-table').html('');
                    $('.pricing-breakdown').html('');

                }


            },
            // error: function(error){
            //     console.log("Error:", error)
            // }
        });




        // Error Handling - empty checking
        // if (isEmpty(procedureName)) {
        //     console.log('Procedure Name is empty')
        //     butterup.toast({
        //         title: 'Error',
        //         message: 'Procedure Name Required',
        //         location: 'bottom-right',
        //         type:'error',
        //     });
        // }

        // if (isEmpty(procedurePackage)) {
        //     console.log('Procedure Package is empty')
        //     butterup.toast({
        //         title: 'Error',
        //         message: 'Procedure Package Required',
        //         location: 'bottom-right',
        //         type:'error',
        //     });
        // }

        // if (isEmpty(isInsured)) {
        //     console.log('isInsured is empty')
        //     butterup.toast({
        //         title: 'Error',
        //         message: 'Insure status Required',
        //         location: 'bottom-right',
        //         type:'error',
        //     });
        // }

        // if (isEmpty(state)) {
        //     console.log('State is empty')
        //     butterup.toast({
        //         title: 'Error',
        //         message: 'State Name Required',
        //         location: 'bottom-right',
        //         type:'error',
        //     });
        // }


    })


});