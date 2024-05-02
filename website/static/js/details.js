
// *************************************
// FORECAST MODAL
// *************************************
function setupForecastModal(modalTitle, modalBody) {
    // Set modal title
    const modalHeaderIcon = document.querySelector('.modal-icon');
    modalHeaderIcon.innerHTML = `<span class="material-icons circle-font bg-purple">online_prediction</span>`;
    modalTitle.innerHTML = "Detaljeret vejrudsigt";

    // Set modal body
    html = `<div class="container"></div>`;
    html += `<div class="row mt-4">`;
    html += `<div class="col mb-0">`;
    html += `<div class="p-2 fs-6 fw-bold">I dag</div>`;
    html += `</div>`;
    html += `</div>`;
    html += `<div class="row row-cols-3">`;
    html += `<div class="col-12 col-md-6 mb-2">`;
    html += `<div class="p-2 fs-6 text-start">${liveData.description}</div>`;
    html += `</div>`;
    html += `<div class="col-6 col-md-3 mb-2">`;
    html += `<div class="p-2 fs-6 text-end"><span class="wi wi-sunrise fs-6 fg-amber fw-bold""></span> ${moment.unix(forecastDailyData[0].sunriseepoch).format('HH:mm')}</div>`;
    html += `</div>`;
    html += `<div class="col-6 col-md-3 mb-2">`;
    html += `<div class="p-2 fs-6 text-end"><span class="wi wi-sunset fs-6 fg-orange fw-bold""></span> ${moment.unix(forecastDailyData[0].sunsetepoch).format('HH:mm')}</div>`;
    html += `</div>`;
    html += `</div>`;
    html += `</div>`;

    html += `<div class="row">`;
    html += `<div class="col mb-2">`;
    html += `<div class="owl-carousel owl-theme pt-0 pb-1" id="elemHourlyForecast"></div>`;
    html += `</div>`;
    html += `</div>`;

    html += `<div class="p-2 fs-6 fw-bold">Daglig Vejrudsigt</div>`;
    html += `<div id="elemDailyForecast">`;
    html += `</div>`;

    modalBody.innerHTML = html;

    // Setup hourly forecast
    count = 0;
    html_d = ``;
    forecastHourlyData.every((data) => {
        if (count > 11) {
            return false;
        }
        html_d += `<div class="card slider p-0">`;
        html_d += `<div class="card-body p-1 fs-7 text-center">`;
        html_d += `<div class="card-text fw-bold">${moment.utc(data.datetime).format("HH")}</div>`;
        html_d += `<div class="img-wrapper">`;
        html_d += `<img src="/static/images/weather/${data.icon}.svg" class="d-block w-100" alt="...">`;
        html_d += `</div>`;
        html_d += `<div class="card-text">${data.temperature}°</div>`;
        html_d += `<div class="card-text"><span class="material-icons fg-blue fs-7">water_drop</span> <span>${data.precipitation}<sup>mm</sup></span></div>`;
        html_d += `<div><span class="wi wi-direction-${windDegreeToWindSymbol(data.wind_bearing)} fs-6 fw-bold""></span> ${data.wind_speed.toFixed(1)}<sup>m/s</sup></div>`;
        html_d += `</div>`;
        html_d += `</div>`;

        count++;
        return true;
    });

    document.getElementById("elemHourlyForecast").innerHTML = html_d;
    owl = $("#modalDefinition .owl-carousel");
    owl.owlCarousel({
        loop: false,
        margin: 10,
        nav: false,
        dots: false,
        responsiveClass: true,
        responsive: {
            0: {
                items: 3,
            },
            600: {
                items: 5,
            },
            1000: {
                items: 7,
                nav: true,
            }
        }
    });

    // Setup daily forecast
    html_d = ``;
    cnt = 1;
    forecastDailyData.every((data) => {
        html_d += `<div class="row ${isEvenRow(cnt)} align-items-center">`;
        html_d += `<div class="col-4 fs-7 fw-semibold">${moment.utc(data.datetime).format("D. MMM")}`;
        html_d += `<div class="row fw-normal">`;
        html_d += `<div class="col-4 fs-tiny text-nowrap">${data.conditions}</div>`;
        html_d += `</div>`;

        html_d += `</div>`;
        html_d += `<div class="col-2 img-wrapper forecast-img">`;
        html_d += `<img src="/static/images/weather/${data.icon}.svg" class="d-block w-100" alt="...">`;
        html_d += `</div>`;
        html_d += `<div class="col-2 p-0 pe-2 fs-tiny text-end"><span class="material-icons fg-blue fs-8">water_drop</span> ${data.precipitation.toFixed(0)}</div>`;
        html_d += `<div class="col-2 p-0 pe-2 fs-tiny text-end"><span class="material-icons fs-8">arrow_upward</span> ${data.temperature.toFixed(0)}&deg;</div>`;
        html_d += `<div class="col-2 p-0 pe-2 fs-tiny text-end"><span class="material-icons fs-8">arrow_downward</span> ${data.temp_low.toFixed(0)}&deg;</div>`;

        html_d += `</div>`;
        cnt++;

        return true;
    });
    document.getElementById("elemDailyForecast").innerHTML = html_d;

}


// *************************************
// TEMPERATURE MODAL
// *************************************
function setupTemperatureModal(modalTitle, modalBody) {
    // Set modal title
    const modalHeaderIcon = document.querySelector('.modal-icon');
    modalHeaderIcon.innerHTML = `<span class="material-icons circle-font bg-blue">device_thermostat</span>`;
    modalTitle.innerHTML = "Dagsoversigt - Temperatur";

    // Set modal body
    html = `<div class="p-2 fs-6 fw-bold">Temperatur Grafer</div>`;

    modalBody.innerHTML = html;
}

// *************************************
// WIND MODAL
// *************************************
function setupWindModal(modalTitle, modalBody) {
    // Set modal title
    const modalHeaderIcon = document.querySelector('.modal-icon');
    modalHeaderIcon.innerHTML = `<span class="material-icons circle-font bg-green">air</span>`;
    modalTitle.innerHTML = "Dagsoversigt - Vind";

    // Set modal body
    modalBody.innerHTML = "<p>Her vil der komme flere detaljer om vindhastighed og retning inklusiv grafer ol..</p>";
}