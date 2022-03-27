$(document).ready(function () {

    // When the form is submitted
    $("#form").submit(function (e) {
        e.preventDefault() // prevent the form from actually being submitted
        calculate_force() // then, run this function
    })

    // When mass or accel inputs are modified, clear the force value
    $("#mass, #accel").on('change keyup', function() {
        $("#force").val('')
    })

    // AJAX function
    function calculate_force() {
        $.ajax({
            //url: '',
            type: 'GET',
            data: {
                mass: $("#mass").val(),
                accel: $("#accel").val(),
            },
            beforeSend: function () {
                // disable button, disable inputs
                $("#mass, #accel, #calculate").attr('disabled', true)

                // replace Calculate with Calculating
                $("#calculate_txt").html('Calculating')

                // show loader
                $("#loader").show()
            },
            success: function (response) {
                // enable mass and accel inputs, and the calculate button
                $("#mass, #accel, #calculate").attr('disabled', false)

                // display answer
                $("#force").val(response.force)

                // replace Calculating with Calculate
                $("#calculate_txt").html('Calculate')

                // hide loader
                $("#loader").hide()
            },
            error: function () {
                // re-enable mass and accel inputs, and the calculate button
                $("#mass, #accel, #calculate").attr('disabled', false)

                // replace Calculating with Calculate
                $("#calculate_txt").html('Calculate')

                // hide loader
                $("#loader").hide()
            }
        })
    }
});