
// *************************************
// CONSTANTS
// *************************************
const degrees = `<span class="text-secondary">` + String.fromCharCode(176) + `</span>`;
const windspeedUnit = `<sup class="text-secondary">m/s</sup>`;

// *************************************
// MAIN FUNCTIONS
// *************************************
$('document').ready(function () {
    getWeatherData();
});

setTimeout(function () {
    getWeatherData();
}, 30000);

// *************************************
// REALTIME DATA FUNCTIONS
// *************************************
function getWeatherData() {
    $.ajax({
        url: "/api/data",
        type: "GET",
        async: true,
        data: {
            format: 'json'
        },
        dataType: 'json',
        success: function (data) {

            document.getElementById("valTemperature").innerHTML = data.temperature + degrees;
            document.getElementById("valWindgust").innerHTML = data.windgust + windspeedUnit;
        },
        error: function (error) {
            console.log(error);
        }
    });
}