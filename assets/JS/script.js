const keyAPI = "f2d01fefb1e59746895b6189294e6211";
const display = document.querySelector(".display__weather");
let locationID;
let cardStorage = [];
let index = 1;
const position = (geoPos) =>
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${geoPos}&limit=1&appid=` +
      keyAPI
  );

const weatherToday = (json) =>
  fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${json.lat}&lon=${json.lon}&appid=${keyAPI}&units=metric`
  );

document.querySelector("button").addEventListener("click", () => {
  let value = document.querySelector("#text").value;
  console.log(value);
  position(value)
    .then((response) => response.json())
    .then((json) => {
      locationID = { lat: json[0].lat, lon: json[0].lon };
      cardStorage.push(locationID);
      displayhtml(cardStorage);
    });
  //   cardStorage.forEach((e) => {
  //     localStorage.setItem(e);
  //   });
});

function displayhtml(cardStorage) {
  cardStorage.forEach((element) => {
    weatherToday(element)
      .then((response) => response.json())
      .then((json) => {
        json.list.forEach((time) => {
          if (time.dt_txt.includes("12:00:00")) {
            console.log(index++);
          }
        });
      });
  });
}
