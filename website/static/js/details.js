
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
    let description = `Temperaturen føles lige nu som ${liveData.feels_like_temperature}&deg; og den faktiske temperatur er ${liveData.temperature}&deg;`;
    description += `. ${feelsLikeToText(liveData.feels_like_temperature)} Temperaturen i dag vil blive mellem ${liveData.tempmin}&deg; og ${liveData.tempmax}&deg;.`;
    const explainHdr = 'Om Føles som-temperaturen';
    const explainText = `Føles som-temperaturen angiver hvor varmt eller koldt det føles, og kan afvige fra den faktiske temperatur. Luftfugtighed og vindforhold kan påvirke Føles som-temperaturen.`;
    document.getElementById("topValue1").innerHTML = `${liveData.temperature}&deg;`;
    document.getElementById("topValue2").innerHTML = `Føles som ${liveData.feels_like_temperature}&deg;`;
    document.getElementById("descriptionHdr").innerHTML = 'Daglig oversigt';
    document.getElementById("description").innerHTML = description;
    document.getElementById("explainHdr").innerHTML = explainHdr;
    document.getElementById("explainText").innerHTML = explainText;

    // Switch to 24 Hour Chart
    $("#chartTab li:eq(0) a").tab("show");

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
    let description = `Vinden er ${liveData.windspeedavg.toFixed(1)} m/s og kommer fra ${windDegreeToCardinal(liveData.windbearing)}. `;
    description += `Vindhastigheden i dag vil være op til ${forecastDailyData[0].wind_speed.toFixed(1)} m/s, med vindstød op til ${forecastDailyData[0].wind_gust.toFixed(1)} m/s.`;
    const explainHdr = 'Om Vindhastighed og Vindstød';
    const explainText = `Vindhastigheden beregnes vha. gennemsnittet over en kort periode. Et vindstød er et kort øjeblik med kastevind, der ligger over dette gennemsnit. Vindstød varer normalt under 20 sekunder`;
    document.getElementById("topValue1").innerHTML = `${liveData.windspeedavg}<sup class="fw-light text-secondary">m/s</sup> <span class="fs-7 fw-light text-secondary">${windDegreeToCardinal(liveData.windbearing)}</span>`;
    document.getElementById("topValue2").innerHTML = `Vindstød ${liveData.windgust} m/s`;
    document.getElementById("descriptionHdr").innerHTML = 'Daglig oversigt';
    document.getElementById("description").innerHTML = description;
    document.getElementById("explainHdr").innerHTML = explainHdr;
    document.getElementById("explainText").innerHTML = explainText;

    // Switch to 24 Hour Chart
    $("#chartTab li:eq(0) a").tab("show");
}


// *************************************
// RAIN MODAL
// *************************************
function setupRainModal(modalTitle, modalBody) {
    // Set modal title
    const modalHeaderIcon = document.querySelector('.modal-icon');
    modalHeaderIcon.innerHTML = `<span class="material-icons circle-font bg-blue">water_drop</span>`;
    modalTitle.innerHTML = "Dagsoversigt - Nedbør";

    // Set modal body
    let description = `Der er faldet ${liveData.raintoday.toFixed(1)} mm nedbør.<br>`;
    description += `I dag vil den samlede mængde nedbør være ${forecastDailyData[0].precipitation} mm.`;
    const explainHdr = '';
    const explainText = ``;
    document.getElementById("topValue1").innerHTML = `${liveData.raintoday.toFixed(1)}<sup class="fw-light text-secondary">mm</sup>`;
    document.getElementById("topValue2").innerHTML = `I alt i dag`;
    document.getElementById("descriptionHdr").innerHTML = 'Daglig oversigt';
    document.getElementById("description").innerHTML = description;
    document.getElementById("explainHdr").innerHTML = explainHdr;
    document.getElementById("explainText").innerHTML = explainText;

    // Switch to 24 Hour Chart
    $("#chartTab li:eq(0) a").tab("show");
}

// *************************************
// UV MODAL
// *************************************
function setupUVModal(modalTitle, modalBody) {
    // Set modal title
    const modalHeaderIcon = document.querySelector('.modal-icon');
    modalHeaderIcon.innerHTML = `<span class="material-icons circle-font bg-orange">wb_sunny</span>`;
    modalTitle.innerHTML = "Dagsoversigt - UV Indeks";

    // Set modal body
    const descriptionHdr = ``;
    let description = ``;
    const explainHdr = 'Om UV-indekset';
    const explainText = `Verdenssundhedsorganisationens UV-indeks (UVI) måler ultraviolet stråling. Jo højere UVI-niveauet, desto større er risikoen for at få solskader og jo hurtigere kan skader opstå. UVI-niveauet kan hjælpe dig med at beslutte, hvornår du skal beskytte dig mod solen, og hvornår du skal undgå at være udenfor. Verdenssundhedsorganisationen anbefaler at gå i skygge samt brug af solcreme, hat og beskyttende tøj, hvis niveauet er 3 (moderat) eller højere.`;
    document.getElementById("topValue1").innerHTML = `${liveData.uv.toFixed(1)} <span class="fw-light text-secondary">${uvindexToText(liveData.uv)}</span>`;
    document.getElementById("topValue2").innerHTML = `UV-Indeks fra Verdenssundhedsorganisationen`;
    document.getElementById("descriptionHdr").innerHTML = 'Daglig oversigt';
    document.getElementById("description").innerHTML = description;
    document.getElementById("explainHdr").innerHTML = explainHdr;
    document.getElementById("explainText").innerHTML = explainText;

    // Switch to 24 Hour Chart
    $("#chartTab li:eq(0) a").tab("show");

}


// *************************************
// SUNRISE/SUNSET MODAL
// *************************************
function setupSunModal(modalTitle, modalBody) {
    // Set modal title
    const modalHeaderIcon = document.querySelector('.modal-icon');
    modalHeaderIcon.innerHTML = `<span class="material-icons circle-font bg-orange">wb_twilight</span>`;
    modalTitle.innerHTML = `${sunHeader}`;

    // Set modal body
    let dayLightText, dayLightValue, remDayLight
    if (isDayLengthIncreasing()) {
        dayLightText = `Dagen er tiltaget med`;
        dayLightValue = calculateDayLengthIncrease();
    } else {
        dayLightText = `Dagen er aftaget med`;
        dayLightValue = calculateDayLengthDecrease();
    }
    const sunrise = moment(moment.unix(forecastDailyData[0].sunriseepoch));
    const sunriseNext = moment(moment.unix(forecastDailyData[1].sunriseepoch));
    const sunset = moment(moment.unix(forecastDailyData[0].sunsetepoch));
    const daylength = dayLength(sunrise, sunset);

    let description = `<div class="row p-2 bg-grey-light text-secondary-emphasis">`;
    description += `<div class="col-7">`;
    description += `<div class="fs-7 fw-semibold">Solopgang i dag</div>`;
    description += `</div>`;
    description += `<div class="col-5">`;
    description += `<div class="fs-7 text-end text-secondary">${sunrise.format('HH:mm')}</div>`;
    description += `</div>`;
    description += `</div>`;
    description += `<div class="row p-2 text-secondary-emphasis">`;
    description += `<div class="col-7">`;
    description += `<div class="fs-7 fw-semibold">Solnedgang i dag</div>`;
    description += `</div>`;
    description += `<div class="col-5">`;
    description += `<div class="fs-7 text-end text-secondary">${sunset.format('HH:mm')}</div>`;
    description += `</div>`;
    description += `</div>`;
    description += `<div class="row p-2 bg-grey-light text-secondary-emphasis">`;
    description += `<div class="col-7">`;
    description += `<div class="fs-7 fw-semibold">Dagslys i alt</div>`;
    description += `</div>`;
    description += `<div class="col-5">`;
    description += `<div class="fs-7 text-end text-secondary">${daylength}</div>`;
    description += `</div>`;
    description += `</div>`;
    description += `<div class="row p-2 text-secondary-emphasis">`;
    description += `<div class="col-7">`;
    description += `<div class="fs-7 fw-semibold">${dayLightText}</div>`;
    description += `</div>`;
    description += `<div class="col-5">`;
    description += `<div class="fs-7 text-end text-secondary">${dayLightValue}</div>`;
    description += `</div>`;
    description += `</div>`;

    if (sunHeader === 'Solnedgang') {
        remDayLight = `Resterende dagslys ${calculateTimeDifference(sunTime)}}`;
    } else {
        remDayLight = `Tid til solen står op er ${calculateTimeDifference(sunTime)}`;
    }

    const descriptionHdr = ``;
    const explainHdr = '';
    const explainText = ``;
    document.getElementById("topValue1").innerHTML = `${sunTime.format('HH:mm')}`;
    document.getElementById("topValue2").innerHTML = `${remDayLight}`;
    document.getElementById("descriptionHdr").innerHTML = descriptionHdr;
    document.getElementById("description").innerHTML = description;
    document.getElementById("explainHdr").innerHTML = explainHdr;
    document.getElementById("explainText").innerHTML = explainText;

    // Switch to 24 Hour Chart
    $("#chartTab li:eq(0) a").tab("show");

}


// *************************************
// HUMIDITY MODAL
// *************************************
function setupHumidityModal(modalTitle, modalBody) {
    // Set modal title
    const modalHeaderIcon = document.querySelector('.modal-icon');
    modalHeaderIcon.innerHTML = `<span class="material-icons circle-font bg-blue">dew_point</span>`;
    modalTitle.innerHTML = "Dagsoversigt - Luftfugtighed";

    // Create Array for Calculation
    let chartData1 = [];
    minuteData.forEach((data) => {
        chartData1.push({
            x: moment.utc(data['logdate']).format("X") * 1000,
            y: data['humidity']
        });
    });
    const avgHumidity = chartData1.reduce((a, b) => a + b.y, 0) / chartData1.length;

    // Set modal body
    const descriptionHdr = `Daglig oversigt`;
    const description = `Den gennemsnitlige luftfugtighed de sidste 24 timer er ${avgHumidity.toFixed(0)}%`;
    const explainHdr = 'Om luftfugtighed';
    const explainText = `Relativ luftfugtighed, som almindeligvis blot kaldes luftfugtighed, er mængden af fugt i luften i forhold til, hvad luften kan indeholde. Luften kan indeholde mere fugt ved høje temperaturer. En relativ luftfugtighed tæt på 100% betyder, at der kan opstå dug eller tåge.`;
    document.getElementById("topValue1").innerHTML = `${liveData.humidity.toFixed(0)}%`;
    document.getElementById("topValue2").innerHTML = `Dugpunktet er ${liveData.dewpoint.toFixed(1)}&deg;`;
    document.getElementById("descriptionHdr").innerHTML = descriptionHdr;
    document.getElementById("description").innerHTML = description;
    document.getElementById("explainHdr").innerHTML = explainHdr;
    document.getElementById("explainText").innerHTML = explainText;

    // Switch to 24 Hour Chart
    $("#chartTab li:eq(0) a").tab("show");

}


// *************************************
// PRESSURE MODAL
// *************************************
function setupPressureModal(modalTitle, modalBody) {
    // Set modal title
    const modalHeaderIcon = document.querySelector('.modal-icon');
    modalHeaderIcon.innerHTML = `<span class="material-icons circle-font bg-red">speed</span>`;
    modalTitle.innerHTML = "Dagsoversigt - Lufttryk";

    // Create Array for Calculation
    let chartData1 = [];
    minuteData.forEach((data) => {
        chartData1.push({
            x: moment.utc(data['logdate']).format("X") * 1000,
            y: data['pressure']
        });
    });
    const avgPressure = chartData1.reduce((a, b) => a + b.y, 0) / chartData1.length;

    // Set modal body
    const descriptionHdr = `Daglig oversigt`;
    const description = `Det gennemsnitlige lufttryk de sidste 24 timer er ${avgPressure.toFixed(0)} hPa (Hektopascal)`;
    const explainHdr = 'Om lufttryk';
    const explainText = `Hurtige og betydelige ændringer i lufttrykket bruges til at forudsige vejrændringer. Faldende lufttryk kan for eksempel betyde, at der er regn eller sne på vej, mens stigende lufttryk kan betyde, at vejret er ved at blive bedre. Lufttryk kaldes også barometrisk tryk eller atmosfærisk tryk.`;
    document.getElementById("topValue1").innerHTML = `${liveData.sealevelpressure.toFixed(0)} hPa`;
    document.getElementById("topValue2").innerHTML = `${pressureTrend(liveData.pressuretrend)[0]}`;
    document.getElementById("descriptionHdr").innerHTML = descriptionHdr;
    document.getElementById("description").innerHTML = description;
    document.getElementById("explainHdr").innerHTML = explainHdr;
    document.getElementById("explainText").innerHTML = explainText;
    // Switch to 24 Hour Chart
    $("#chartTab li:eq(0) a").tab("show");
}

// *************************************
// AIR QUALITY MODAL
// *************************************
function setupAqiModal(modalTitle, modalBody) {
    // Set modal title
    const modalHeaderIcon = document.querySelector('.modal-icon');
    modalHeaderIcon.innerHTML = `<span class="material-icons circle-font bg-green">grain</span>`;
    modalTitle.innerHTML = "Dagsoversigt - Luftkvalitet";

    // Set modal body
    const descriptionHdr = `Sundhedsoplysninger`;
    const description = `${aqiValueToRecommend(liveData.aqi)}`;
    const explainHdr = 'Om PM2.5 Partikler';
    const explainText = `PM2.5 er en skala til måling af luftkvalitet i realtid. Dens værdier varierer fra 0 til større end 250.`;
    document.getElementById("topValue1").innerHTML = `${liveData.pm25.toFixed(0)} PM<sup>2.5</sup>`;
    document.getElementById("topValue2").innerHTML = `${aqiValueToText(liveData.aqi)}`;
    document.getElementById("descriptionHdr").innerHTML = descriptionHdr;
    document.getElementById("description").innerHTML = description;
    document.getElementById("explainHdr").innerHTML = explainHdr;
    document.getElementById("explainText").innerHTML = explainText;

    // Switch to 24 Hour Chart
    $("#chartTab li:eq(0) a").tab("show");
}

// *************************************
// VISIBILITY MODAL
// *************************************
function setupVisibilityModal(modalTitle, modalBody) {
    // Set modal title
    const modalHeaderIcon = document.querySelector('.modal-icon');
    modalHeaderIcon.innerHTML = `<span class="material-icons circle-font bg-green">visibility</span>`;
    modalTitle.innerHTML = "Dagsoversigt - Sigtbarhed";


    // Set modal body
    const descriptionHdr = `Daglig oversigt`;
    const description = `Sigtbarheden i dag vil være (Indsæt værdi)`;
    const explainHdr = 'Om Sigtbarhed';
    const explainText = `Sigtbarhed siger noget om, hvor langt væk du tydeligt kan se objekter som f.eks bygninger og bakker. Det er et mål for luftens gennemsigtighed og tager ikke højde for mængden af sollys eller tilstedeværelsen af ting der spærrer for udsynet. En sigtbarhed på mindst 10 km anses som klar sigtbarhed.`;
    document.getElementById("topValue1").innerHTML = `${liveData.visibility.toFixed(0)} Km`;
    document.getElementById("topValue2").innerHTML = `${visibilityText(liveData.visibility)}`;
    document.getElementById("descriptionHdr").innerHTML = descriptionHdr;
    document.getElementById("description").innerHTML = description;
    document.getElementById("explainHdr").innerHTML = explainHdr;
    document.getElementById("explainText").innerHTML = explainText;

    // Switch to 24 Hour Chart
    $("#chartTab li:eq(0) a").tab("show");

}

// *************************************
// CHART MODAL BUILD CHARTS
// *************************************
function drawCharts(chartType, tabSegment) {

    switch (chartType) {
        case 'temperature':
            switch (tabSegment) {
                case '24hourChartTab':
                    if (chart != null) { chart.destroy(); }
                    let chartData = [];
                    let chartData1 = [];
                    let chartData2 = [];
                    minuteData.forEach((data) => {
                        chartData1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['temperature']
                        });
                        chartData2.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['dewpoint']
                        });
                    });
                    chartData.push({ name: "Temperatur", type: 'area', data: chartData1 });
                    chartData.push({ name: "Dugpunkt", type: 'line', data: chartData2 });

                    let options = chartWithTwoDataSets(chartData, '°', 'HH:mm', 'ddd HH:mm', cssVar("color-blue"), cssVar("color-red"));
                    chart = new ApexCharts(document.getElementById("chartModal"), options);
                    chart.render();
                    break;
                case 'dailyChartTab':
                    if (chartDaily != null) { chartDaily.destroy(); }
                    let chartDataDaily = [];
                    let chartDataDaily1 = [];
                    let chartDataDaily2 = [];
                    dailyData.forEach((data) => {
                        chartDataDaily1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['temperature_high']
                        });
                        chartDataDaily2.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['temperature_low']
                        });
                    });
                    chartDataDaily.push({ name: "Temp Høj", type: 'line', data: chartDataDaily1 });
                    chartDataDaily.push({ name: "Temp Lav", type: 'line', data: chartDataDaily2 });

                    let optionsDaily = chartWithTwoDataSets(chartDataDaily, '°', 'dd', 'dd. MMM', cssVar("color-red"), cssVar("color-blue"), 'solid');
                    chartDaily = new ApexCharts(document.getElementById("chartModalDaily"), optionsDaily);
                    chartDaily.render();
                    break;
            }
            break;
        case 'wind':
            switch (tabSegment) {
                case '24hourChartTab':
                    if (chart != null) { chart.destroy(); }
                    let chartData = [];
                    let chartData1 = [];
                    let chartData2 = [];
                    minuteData.forEach((data) => {
                        chartData1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['wind_speed']
                        });
                        chartData2.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['wind_gust']
                        });
                    });
                    chartData.push({ name: "Hastighed", type: 'area', data: chartData1 });
                    chartData.push({ name: "Vindstød", type: 'line', data: chartData2 });

                    let options = chartWithTwoDataSets(chartData, ' m/s', 'HH:mm', 'ddd HH:mm', cssVar("color-green"), cssVar("color-orange"), 'gradient', 1);
                    chart = new ApexCharts(document.getElementById("chartModal"), options);
                    chart.render();
                    break;
                case 'dailyChartTab':
                    if (chartDaily != null) { chartDaily.destroy(); }
                    let chartDataDaily = [];
                    let chartDataDaily1 = [];
                    let chartDataDaily2 = [];
                    dailyData.forEach((data) => {
                        chartDataDaily1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['wind_speed_max']
                        });
                        chartDataDaily2.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['wind_speed_avg']
                        });
                    });
                    chartDataDaily.push({ name: "Vindstød", type: 'bar', data: chartDataDaily1 });
                    chartDataDaily.push({ name: "Gns. vind", type: 'line', data: chartDataDaily2 });

                    let optionsDaily = chartWithTwoDataSets(chartDataDaily, 'm/s', 'dd', 'dd. MMM', cssVar("color-green"), cssVar("color-orange"), 'gradient', 1);
                    chartDaily = new ApexCharts(document.getElementById("chartModalDaily"), optionsDaily);
                    chartDaily.render();
                    break;
            }
            break;
        case 'rain':
            switch (tabSegment) {
                case '24hourChartTab':
                    if (chart != null) { chart.destroy(); }
                    let chartData = [];
                    let chartData1 = [];
                    let chartData2 = [];
                    minuteData.forEach((data) => {
                        chartData1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['rain_hour']
                        });
                        chartData2.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['rain_day']
                        });
                    });
                    chartData.push({ name: "Nedbør", type: 'area', data: chartData1 });
                    chartData.push({ name: "Nedbør i dag", type: 'line', data: chartData2 });

                    let options = chartWithTwoDataSetsScales(chartData, ' mm', ' mm', 'HH:mm', 'ddd HH:mm', cssVar("color-blue"), cssVar("color-green"), 'gradient', 1, 1);
                    chart = new ApexCharts(document.getElementById("chartModal"), options);
                    chart.render();
                    break;
                case 'dailyChartTab':
                    if (chartDaily != null) { chartDaily.destroy(); }
                    let chartDataDaily = [];
                    let chartDataDaily1 = [];
                    dailyData.forEach((data) => {
                        chartDataDaily1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['rain_total']
                        });
                    });
                    chartDataDaily.push({ name: "Regn", type: 'bar', data: chartDataDaily1 });

                    let optionsDaily = chartWithOneDataSet(chartDataDaily, ' mm', 'dd', 'dd. MMM', cssVar("color-blue"));
                    chartDaily = new ApexCharts(document.getElementById("chartModalDaily"), optionsDaily);
                    chartDaily.render();
                    break;
            }
            break;
        case 'uv':
            switch (tabSegment) {
                case '24hourChartTab':
                    if (chart != null) { chart.destroy(); }
                    let chartData = [];
                    let chartData1 = [];
                    let chartData2 = [];
                    minuteData.forEach((data) => {
                        chartData1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['uv']
                        });
                        chartData2.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['solar_radiation']
                        });
                    });
                    chartData.push({ name: "UV Indeks", type: 'area', data: chartData1 });
                    chartData.push({ name: "Solindstråling", type: 'line', data: chartData2 });

                    let options = chartWithTwoDataSetsScales(chartData, ' UVI', ' W/m²', 'HH:mm', 'ddd HH:mm', cssVar("color-amber"), cssVar("color-green"), 'gradient', 1, 0);
                    chart = new ApexCharts(document.getElementById("chartModal"), options);
                    chart.render();
                    break;
                case 'dailyChartTab':
                    if (chartDaily != null) { chartDaily.destroy(); }
                    let chartDataDaily = [];
                    let chartDataDaily1 = [];
                    let chartDataDaily2 = [];
                    dailyData.forEach((data) => {
                        chartDataDaily1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['uvindex_max']
                        });
                        chartDataDaily2.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['solar_radiation_max']
                        });
                    });
                    chartDataDaily.push({ name: "UV Indeks", type: 'bar', data: chartDataDaily1 });
                    chartDataDaily.push({ name: "Solindstråling", type: 'line', data: chartDataDaily2 });

                    let optionsDaily = chartWithTwoDataSetsScales(chartDataDaily, ' UVI', ' W/m²', 'dd', 'dd. MMM', cssVar("color-amber"), cssVar("color-green"), 'gradient', 1, 0);
                    chartDaily = new ApexCharts(document.getElementById("chartModalDaily"), optionsDaily);
                    chartDaily.render();
                    break;
            }
            break;
        case 'sunriseset':
            switch (tabSegment) {
                case '24hourChartTab':
                    document.getElementById("chartModal").innerHTML = '<div class="sun-container"><canvas class="canvas-sun" id="sunCanvas" width=250 height=250></canvas></div>'
                    const sunrise = moment(moment.unix(forecastDailyData[0].sunriseepoch));
                    const sunriseNext = moment(moment.unix(forecastDailyData[1].sunriseepoch));
                    const sunset = moment(moment.unix(forecastDailyData[0].sunsetepoch));
                    const daylength = dayLength(sunrise, sunset);

                    const now = moment();
                    const minutesSinceSunrise = now.diff(sunrise, 'minutes');
                    const minutesSinceSunset = now.diff(sunset, 'minutes');
                    const daylightMinutes = sunset.diff(sunrise, 'minutes');
                    const nightMinutes = 1440 - daylightMinutes;
                    let isDay = true;
                    if (now > sunset && now < sunriseNext) { isDay = false; }
                    let anglePosition = 0;
                    if (isDay) {
                        anglePosition = 2 - (daylightMinutes - minutesSinceSunrise) / daylightMinutes;
                    } else {
                        anglePosition = minutesSinceSunset / nightMinutes;
                    }
                    drawSunHorizon('sunCanvas', sunrise.format('HH:mm'), sunriseNext.format('HH:mm'), sunset.format('HH:mm'), anglePosition, isDay);

                    break;
                case 'dailyChartTab':
                    if (chartDaily != null) { chartDaily.destroy(); }
                    let chartDataDaily = [];
                    let chartDataDaily1 = [];
                    dailyData.forEach((data) => {
                        chartDataDaily1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['uvindex_max']
                        });
                    });
                    chartDataDaily.push({ name: "UV Indeks", type: 'bar', data: chartDataDaily1 });

                    let optionsDaily = chartWithOneDataSet(chartDataDaily, 'UVI', 'dd', 'dd. MMM', cssVar("color-orange"));
                    chartDaily = new ApexCharts(document.getElementById("chartModalDaily"), optionsDaily);
                    chartDaily.render();
                    break;
            }
            break;
        case 'humidity':
            switch (tabSegment) {
                case '24hourChartTab':
                    if (chart != null) { chart.destroy(); }
                    let chartData = [];
                    let chartData1 = [];
                    minuteData.forEach((data) => {
                        chartData1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['humidity']
                        });
                    });
                    chartData.push({ name: "Luftfugtighed", type: 'area', data: chartData1 });

                    let options = chartWithOneDataSet(chartData, '%', 'HH:mm', 'ddd HH:mm', cssVar("color-blue"));
                    chart = new ApexCharts(document.getElementById("chartModal"), options);
                    chart.render();
                    break;
                case 'dailyChartTab':
                    if (chartDaily != null) { chartDaily.destroy(); }
                    let chartDataDaily = [];
                    let chartDataDaily1 = [];
                    let chartDataDaily2 = [];
                    dailyData.forEach((data) => {
                        chartDataDaily1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['humidity_high']
                        });
                        chartDataDaily2.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['humidity_low']
                        });
                    });
                    chartDataDaily.push({ name: "Luftfugtighed Høj", type: 'line', data: chartDataDaily1 });
                    chartDataDaily.push({ name: "Luftfugtighed Lav", type: 'line', data: chartDataDaily2 });

                    let optionsDaily = chartWithTwoDataSets(chartDataDaily, '%', 'dd', 'dd. MMM', cssVar("color-blue"), cssVar("color-green"), 'solid');
                    chartDaily = new ApexCharts(document.getElementById("chartModalDaily"), optionsDaily);
                    chartDaily.render();
                    break;
            }
            break;
        case 'pressure':
            switch (tabSegment) {
                case '24hourChartTab':
                    if (chart != null) { chart.destroy(); }
                    let chartData = [];
                    let chartData1 = [];
                    minuteData.forEach((data) => {
                        chartData1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['pressure']
                        });
                    });
                    chartData.push({ name: "Lufttryk", type: 'area', data: chartData1 });

                    let options = chartWithOneDataSet(chartData, ' hPa', 'HH:mm', 'ddd HH:mm', cssVar("color-blue"));
                    chart = new ApexCharts(document.getElementById("chartModal"), options);
                    chart.render();
                    break;
                case 'dailyChartTab':
                    if (chartDaily != null) { chartDaily.destroy(); }
                    let chartDataDaily = [];
                    let chartDataDaily1 = [];
                    let chartDataDaily2 = [];
                    dailyData.forEach((data) => {
                        chartDataDaily1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['pressure_high']
                        });
                        chartDataDaily2.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['pressure_low']
                        });
                    });
                    chartDataDaily.push({ name: "Lufttryk Høj", type: 'line', data: chartDataDaily1 });
                    chartDataDaily.push({ name: "Lufttryk Lav", type: 'line', data: chartDataDaily2 });

                    let optionsDaily = chartWithTwoDataSets(chartDataDaily, ' hPa', 'dd', 'dd. MMM', cssVar("color-blue"), cssVar("color-green"), 'solid');
                    chartDaily = new ApexCharts(document.getElementById("chartModalDaily"), optionsDaily);
                    chartDaily.render();
                    break;
            }
            break;
        case 'aqi':
            switch (tabSegment) {
                case '24hourChartTab':
                    if (chart != null) { chart.destroy(); }
                    let chartData = [];
                    let chartData1 = [];
                    minuteData.forEach((data) => {
                        chartData1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['air_Quality_pm25']
                        });
                    });
                    chartData.push({ name: "Luftkvalitet", type: 'area', data: chartData1 });

                    let options = chartWithOneDataSet(chartData, ' PM2.5', 'HH:mm', 'ddd HH:mm', cssVar("color-grey"));
                    chart = new ApexCharts(document.getElementById("chartModal"), options);
                    chart.render();
                    break;
                case 'dailyChartTab':
                    if (chartDaily != null) { chartDaily.destroy(); }
                    let chartDataDaily = [];
                    let chartDataDaily1 = [];
                    let chartDataDaily2 = [];
                    dailyData.forEach((data) => {
                        chartDataDaily1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['air_quality_high']
                        });
                        chartDataDaily2.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['air_quality_low']
                        });
                    });
                    chartDataDaily.push({ name: "Luftkvalitet Høj", type: 'line', data: chartDataDaily1 });
                    chartDataDaily.push({ name: "Luftkvalitet Lav", type: 'line', data: chartDataDaily2 });

                    let optionsDaily = chartWithTwoDataSets(chartDataDaily, ' PM2.5', 'dd', 'dd. MMM', cssVar("color-grey"), cssVar("color-orange"), 'solid');
                    chartDaily = new ApexCharts(document.getElementById("chartModalDaily"), optionsDaily);
                    chartDaily.render();
                    break;
            }
            break;
        case 'visibility':
            switch (tabSegment) {
                case '24hourChartTab':
                    if (chart != null) { chart.destroy(); }
                    let chartData = [];
                    let chartData1 = [];
                    minuteData.forEach((data) => {
                        chartData1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['visibility']
                        });
                    });
                    chartData.push({ name: "Sigtbarhed", type: 'area', data: chartData1 });

                    let options = chartWithOneDataSet(chartData, ' Km', 'HH:mm', 'ddd HH:mm', cssVar("color-green"));
                    chart = new ApexCharts(document.getElementById("chartModal"), options);
                    chart.render();
                    break;
                case 'dailyChartTab':
                    if (chartDaily != null) { chartDaily.destroy(); }
                    let chartDataDaily = [];
                    let chartDataDaily1 = [];
                    let chartDataDaily2 = [];
                    dailyData.forEach((data) => {
                        chartDataDaily1.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['visibility_high']
                        });
                        chartDataDaily2.push({
                            x: moment.utc(data['logdate']).format("X") * 1000,
                            y: data['visibility_low']
                        });
                    });
                    chartDataDaily.push({ name: "Sigtbarhed Høj", type: 'line', data: chartDataDaily1 });
                    chartDataDaily.push({ name: "Sigtbarhed Lav", type: 'line', data: chartDataDaily2 });

                    let optionsDaily = chartWithTwoDataSets(chartDataDaily, ' Km', 'dd', 'dd. MMM', cssVar("color-green"), cssVar("color-orange"), 'solid');
                    chartDaily = new ApexCharts(document.getElementById("chartModalDaily"), optionsDaily);
                    chartDaily.render();
                    break;
            }
            break;
    }
};

// *************************************
// CHART MODAL HTML TEMPLATE
// *************************************
function getChartModalLayout() {
    return `
    <div class="container p-2">
        <div class="row">
            <div class="col">
                <div class="py-1 fs-5 fw-bold" id="topValue1"></div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="mt-n1 mb-2 fs-7 text-secondary" id="topValue2"></div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="fs-6 fw-semibold" id="descriptionHdr"></div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="fs-7 text-secondary" id="description"></div>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col">
                <div class="fs-6 fw-semibold" id="explainHdr"></div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="fs-7 text-secondary" id="explainText"></div>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col">
                <ul class="nav nav-tabs" id="chartTab">
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#24hourChart"
                            id="24hourChartTab">24 timer</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#dailyChart"
                            id="dailyChartTab">Daglig</a>
                    </li>
                </ul>

            </div>
        </div>
        <div class="tab-content">
            <div class="tab-pane fade container p-0 m-0 pb-3" id="24hourChart">
                <div class="p-0 m-0 pb-3" id="chartModal" width="400" height="250"></div>
            </div>
            <div class="tab-pane fade container p-0 m-0 pb-3" id="dailyChart">
                <div class="p-0 m-0 pb-3" id="chartModalDaily" width="400" height="250"></div>
            </div>
        </div>
    </div>
    `;
}
