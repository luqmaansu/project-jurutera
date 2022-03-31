$(document).ready(function () {

    // When reset button is pressed
    $("#reset").on('click', function(){
        $('.input-field').val('')
        clear_output()
    })

    // When any input change or key up, clear output
    $('.input-field').on('change, keyup', function(){
        clear_output()
    })

    // Provide sample values from experiment
    // Expected result, mass = 0.0426 lb
    $("#sample").on('click', function(){
        $('#modulus').val(8091655) // psi
        $('#density').val(0.0960986) // lb/in^3
        $('#length').val(8) // in
        $('#frequency').val(546) // cpm
        $('#position').val(6) // in
        $('#width').val(1.57) // in
        $('#height').val(0.03937) // in
        clear_output()
    })

    // Function to clear output value
    function clear_output(){
        $('#mass').val('')
    }

});