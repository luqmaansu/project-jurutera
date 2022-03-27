$(document).ready(function() {

    // When mass and accel input changes and on a keystroke, do the followings
    $('#mass, #accel').on('change, keyup', function() {

        // Get the values of mass and accel inputs
        mass = $('#mass').val()
        accel = $('#accel').val()

        // Multiply them and round off to 2 decimal places
        force = (mass * accel).toFixed(2)

        // Update the display value of force to the answer
        $('#force').val(force)
    })

});