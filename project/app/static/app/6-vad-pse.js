$(document).ready(function () {

    // When reset button is pressed
    $("#reset").on('click', function(){
        $('.input-field').val('')
    })

    // When any input change or key up, clear output
    $('.input-field').on('change, keyup', function(){
        clear_output()
    })

    // Sample value set from experiment
    $("#sample").on('click', function(){

        // This function starts with providing sample values to all fields,
        // and the later clearing the out with clear_output() and
        // switching the disabled/enabled state with switch_parameter()

        $('#mass').val(0.0426) // lb
        $('#modulus').val(8091655) // psi
        $('#density').val(0.0960986) // lb/in^3
        $('#length').val(8) // in
        $('#frequency').val(546) // cpm
        $('#position').val(6) // in
        $('#width').val(1.57) // in
        $('#height').val(0.03937) // in
        clear_output()
        switch_parameter()

    })

    // Helper function to get the element id of the checked parameter
    function get_checked_id(){
        var checked = String($('#check-parameter:checked').val())
        var checked_id = '#' + checked
        return checked_id
    }

    // Helper function to clear output value
    function clear_output(){
        checked_id = get_checked_id()
        $(checked_id).val('')
    }

    // Helper function to switch disabled and enabled states
    function switch_state(){
        checked_id = get_checked_id()
        $(".input-field").prop('disabled', false)
        $(checked_id).prop('disabled', true)
    }

    // Functions to call when parameter selection is switched
    switch_parameter()
    function switch_parameter(){
        switch_state() // switch disabled and enabled states
        clear_output() // clear output value
    }

    // When a different parameter output is clicked
    $("input[name='check-parameter']").on('click', function(){
        switch_parameter()
    })

    // When the form is submitted
    $("#form").submit(function (e) {
        e.preventDefault() // prevent the form from actually being submitted
        calculate() // then, run this function
    })

    // AJAX function
    function calculate() {
        $.ajax({
            //url: '',
            type: 'GET',
            data: {
                check: $('#check-parameter:checked').val(),
                mass: $("#mass").val(),
                position: $("#position").val(),
                modulus: $("#modulus").val(),
                density: $("#density").val(),
                width: $("#width").val(),
                height: $("#height").val(),
                length: $("#length").val(),
                frequency: $("#frequency").val(),
            },
            beforeSend: function () {

                // replace Calculate with Calculating
                $("#calculate_txt").html('Calculating')

                // show loader
                $("#loader").show()
            },
            success: function (response) {

                checked_id = get_checked_id()
                $(checked_id).val(response.output)

                // replace Calculating with Calculate
                $("#calculate_txt").html('Calculate')

                // hide loader
                $("#loader").hide()
            },
            error: function () {

                // replace Calculating with Calculate
                $("#calculate_txt").html('Calculate')

                // hide loader
                $("#loader").hide()
            }
        })
    }

});