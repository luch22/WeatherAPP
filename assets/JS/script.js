const keyAPI = "f2d01fefb1e59746895b6189294e6211";
const accesKey = "TleES8qZBFSVuxuYaa47P6y12yBzOyHeBShNGvipU8c";
const display = document.querySelector(".display__weather");
let locationID;
let cardStorage = [];
let index = 0;
const dayOfWeek = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];
let mapCity_Img = new Map();

if (localStorage.getItem("index") != null) {
  index = localStorage.getItem("index");
} else localStorage.setItem("index", index);

Object.keys(localStorage).forEach(function (key) {
  if (key != "index" || key != "mapCity") {
    console.log(index);
    cardStorage.push(JSON.parse(localStorage.getItem(key)));
  }
});
const imgAPI = (city) =>
  fetch(
    `https://api.unsplash.com/search/photos?query=${city}&client_id=${accesKey}`
  );
const position = (geoPos) =>
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${geoPos}&limit=1&appid=${keyAPI}`
  );

const weatherToday = (json) =>
  fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${json.lat}&lon=${json.lon}&appid=${keyAPI}&units=metric`
  );
document.querySelector("button").addEventListener("click", () => {
  display.innerHTML = "";
  index = localStorage.getItem("index");
  let value = document.querySelector("#text").value;
  position(value)
    .then((response) => response.json())
    .then((json) => {
      locationID = { lat: json[0].lat, lon: json[0].lon };
      if (!cardStorage.includes(locationID)) {
        cardStorage.push(locationID);
        localStorage.setItem("index", index);
      }
      updateLocalStorage(cardStorage);
      displayhtml();
    });
});

function displayhtml() {
  Object.keys(localStorage).forEach(function (key) {
    if (key != "index" || key != "mapCity") {
      weatherToday(JSON.parse(localStorage.getItem(key)))
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          createhtml(json);
        });
    }
  });
}
function createhtml(json) {
  let div = document.createElement("div");
  let pict = document.createElement("img");
  if (!mapCity_Img.has(json.city.name)) {
    imgAPI(json.city.name)
      .then((response) => response.json())
      .then((img) => {
      });
    // localStorage.setItem("mapCity", JSON.stringify(mapCity_Img));
  }
  mapCity_Img = JSON.parse(localStorage.getItem("mapCity"));
  // pict.src = `${mapCity_Img.get(json.city.name)}`;
  div.innerHTML = `<h3>${json.city.name}</h3>`;
  div.append(pict);
  let ul = document.createElement("ul");
  ul.classList = "Cards";
  json.list.forEach((time) => {
    if (time.dt_txt.includes("12:00:00")) {
      let li = document.createElement("li");
      li.innerHTML = `<div class ="Card"> <time datetime="${time.dt_txt}">${
        dayOfWeek[new Date(time.dt_txt).getDay()]
      }</time> <span>Température de ${time.main.temp}° C</span></div>`;
      ul.append(li);
    }
    div.append(ul);
    display.append(div);
  });
}
function updateLocalStorage(cardStorage) {
  if (cardStorage.length != 0) {
    cardStorage.forEach((e) => {
      localStorage.setItem(`${++index}`, JSON.stringify(e));
    });
  }
}
