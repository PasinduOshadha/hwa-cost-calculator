jQuery(document).ready(function ($) {

    // get field values from the form
    // valideate them

    // send them via JS and get response


    // let data vairables
    let procedureName, procedurePackage, isInsured, stateLiveIn, medicalCentre = '';

    // this varibale is to set if all the form fields are filled and ready to be calculated
    let isFormValid = false;

    // helpers
    function isEmpty(value) {
        return value == null || value === "";
    }

    // function isValid(inputField) { 
    //     let validationMsg = '';
    //     if(inputField === ''){
    //         validationMsg = 'The field is empty';
    //     }
    //  }




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
        // $('input[name=oberaBallonNSW]').on('click', function (e) {
        //     medicalCentre = $('input[name=oberaBallonNSW]:checked').val();
        // })

        // $('input[name=abNSW]').on('click', function (e) {
        //     medicalCentre = $('input[name=abNSW]:checked').val();
        // })

        // $('input[name=abWA]').on('click', function (e) {
        //     medicalCentre = $('input[name=abWA]:checked').val();
        // })

        // $('input[name=abVIC]').on('click', function (e) {
        //     medicalCentre = $('input[name=abVIC]:checked').val();
        // })

        // $('input[name=abQLD]').on('click', function (e) {
        //     medicalCentre = $('input[name=abQLD]:checked').val();
        // })

        // $('input[name=esgAndBypassNSW]').on('click', function (e) {
        //     medicalCentre = $('input[name=esgAndBypassNSW]:checked').val();
        // })

        // $('input[name=esgNSW]').on('click', function (e) {
        //     medicalCentre = $('input[name=esgNSW]:checked').val();
        // })

        // $('input[name=lapAndBypassNSW]').on('click', function (e) {
        //     medicalCentre = $('input[name=lapAndBypassNSW]:checked').val();
        // })

    })



    // Data sending 
    $('.send').on('click', function (e) {

        e.preventDefault();

        console.log('-------')
        console.log(procedureName)
        console.log(procedurePackage)
        console.log(isInsured)
        console.log(state)
        // console.log(medicalCentre)



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
                response = JSON.parse(response)
                console.log(response)
            }
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