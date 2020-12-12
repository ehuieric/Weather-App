let searchhistory = localStorage.getItem(`searchhistory`);
if(!searchhistory) {
    localStorage.setItem(`searchhistory` , `[]`);
    searchhistory = "[]";
}

function formatDate (date) {
  return moment.unix(date).format("MM/DD/YYYY");

}

function apisearch (cityname) {

    var APIkey = `56396c503c5dc56ffc899f8c7489582d`;
    var key = '7YBjjSaewx5BgAnD4Sxe61fQ83dHuABQ';
    var url1= `http://www.mapquestapi.com/geocoding/v1/address?key=${key}&location=${cityname}`;
   
    $.ajax({
        url: url1,
        method: "GET",
        headers: {
            "x-requested-with": "xhr"
        }
    }).then(function(response){

        const lat = response.results[0].locations[0].displayLatLng.lat;
        const lon = response.results[0].locations[0].displayLatLng.lng;
        var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=alert,minutely&appid=${APIkey}&units=imperial`;
        var queryurl = `https://cors-anywhere.herokuapp.com/` + url;

        

        $.ajax({
            url: queryurl,
            method: "GET",
            headers: {
                "x-requested-with": "xhr"
            }
        }).then(function (data) {
            console.log('weather', data);
            $("#results").empty();
            $("#results").append(`<div class="info"> 
                                    <h1 class="city">
                                    ${response.results[0].providedLocation.location}
                                      <span>
                                       ${formatDate(data.current.dt)}
                                      </span>
                                    </h1>
                                    <p>Temperature: ${data.current.temp} F</p>
                                    <p>Humidity: ${data.current.humidity}%</p>
                                    <p>wind speed: ${data.current.wind_speed} MPH</p>
                                    <p>UV Index: ${data.current.uvi} </p>
                                </div>`);
               
            
            $("#futureTemp").empty();
            $("#forecastTitle").empty();
            $("#forecastTitle").append('<h2>5-Day Forecast</h2>'); 

            for(let i = 1; i < 6; i++) {
                const forecast = data.daily[i];
                const date = formatDate(data.daily[i].dt);
                const iconurl = `http://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`;

                $("#futureTemp").append (`<div class="col-sm">
                                            <div class="box">
                                            <p>${date}</p>
                                            <div id="icon">
                                              <img src=${iconurl} alt="weather icon">
                                            </div>
                                            <div>temp: ${data.daily[i].temp.day}</div>
                                            <p>humidity: ${data.daily[i].humidity}</p>
                                            </div> 
                                       </div>`)

                                    
            }
                                
        })
    })
}

const cityarray = JSON.parse(searchhistory);

for(let i = 0; i < cityarray.length; i++) {

    const onecity = cityarray[i];

    $('#searchhistory').prepend(`<div class="cityname"> 
                                 <button class="onecity" id="onecity-${i}">${onecity}</button>
                             </div>`);
    
    $(`#onecity-${i}`).on("click", function () {
        apisearch(onecity);
    })

} 

$('#search').on("click", function () {
    const  cityname = $('input[id=cityname]').val(); 

    cityarray.push(cityname);
    localStorage.setItem(`searchhistory` , JSON.stringify(cityarray));
    
   apisearch(cityname);
    
})
