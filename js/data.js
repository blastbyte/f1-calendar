/*
 * 2026 FIA Formula One World Championship calendar.
 * Bahrain and Saudi Arabia were called off in March 2026 (Middle East conflict),
 * and the Bahrain Grand Prix was later re-staged at Sepang, Malaysia (2–4 October),
 * giving 23 championship rounds.
 *
 * winner   – key into DRIVERS for completed races.
 *
 * raceUtc  – approximate lights-out time in UTC, used for countdown / status.
 * lapRecord – official race lap record (fastest lap set during a Grand Prix).
 * wiki     – English Wikipedia article used to source a circuit photo at runtime.
 * photoQuery – optional Wikimedia Commons search used if the article has no usable photo.
 * photo    – optional exact Commons filename to force a specific photo.
 */
window.SEASON = 2026;

/* Team colours follow the 2026 liveries. */
window.TEAMS = {
  Mercedes: "#27f4d2", Ferrari: "#e8002d", McLaren: "#ff8000", "Red Bull": "#3671c6",
};
window.DRIVERS = {
  antonelli:  { first: "Kimi", last: "Antonelli", code: "ANT", no: 12, team: "Mercedes", wiki: "Andrea_Kimi_Antonelli" },
  russell:    { first: "George", last: "Russell", code: "RUS", no: 63, team: "Mercedes", wiki: "George_Russell_(racing_driver)" },
  hamilton:   { first: "Lewis", last: "Hamilton", code: "HAM", no: 44, team: "Ferrari", wiki: "Lewis_Hamilton" },
  leclerc:    { first: "Charles", last: "Leclerc", code: "LEC", no: 16, team: "Ferrari", wiki: "Charles_Leclerc" },
  norris:     { first: "Lando", last: "Norris", code: "NOR", no: 1, team: "McLaren", wiki: "Lando_Norris" },
  verstappen: { first: "Max", last: "Verstappen", code: "VER", no: 3, team: "Red Bull", wiki: "Max_Verstappen" },
};

window.RACES = [
  { id: "au-1953", winner: "russell", gp: "Australian Grand Prix", country: "Australia", cc: "au", city: "Melbourne",
    circuit: "Albert Park Circuit", wiki: "Albert_Park_Circuit",
    start: "2026-03-06", end: "2026-03-08", raceUtc: "2026-03-08T04:00:00Z",
    length: 5.278, laps: 58, firstGp: 1996, turns: 14, type: "Street / park",
    lapRecord: { time: "1:19.813", driver: "Charles Leclerc", team: "Ferrari", year: 2024 } },

  { id: "cn-2004", winner: "antonelli", gp: "Chinese Grand Prix", country: "China", cc: "cn", city: "Shanghai",
    circuit: "Shanghai International Circuit", wiki: "Shanghai_International_Circuit",
    start: "2026-03-13", end: "2026-03-15", raceUtc: "2026-03-15T07:00:00Z", sprint: true,
    length: 5.451, laps: 56, firstGp: 2004, turns: 16, type: "Permanent",
    lapRecord: { time: "1:32.238", driver: "Michael Schumacher", team: "Ferrari", year: 2004 } },

  { id: "jp-1962", winner: "antonelli", gp: "Japanese Grand Prix", country: "Japan", cc: "jp", city: "Suzuka",
    circuit: "Suzuka International Racing Course", wiki: "Suzuka_International_Racing_Course",
    start: "2026-03-27", end: "2026-03-29", raceUtc: "2026-03-29T05:00:00Z",
    length: 5.807, laps: 53, firstGp: 1987, turns: 18, type: "Permanent",
    lapRecord: { time: "1:30.965", driver: "Kimi Antonelli", team: "Mercedes", year: 2025 } },

  { id: "bh-2002", gp: "Bahrain Grand Prix", country: "Bahrain", cc: "bh", city: "Sakhir",
    circuit: "Bahrain International Circuit", wiki: "Bahrain_International_Circuit",
    start: "2026-04-10", end: "2026-04-12", raceUtc: "2026-04-12T15:00:00Z", cancelled: true,
    length: 5.412, laps: 57, firstGp: 2004, turns: 15, type: "Permanent",
    lapRecord: { time: "1:31.447", driver: "Pedro de la Rosa", team: "McLaren", year: 2005 } },

  { id: "sa-2021", gp: "Saudi Arabian Grand Prix", country: "Saudi Arabia", cc: "sa", city: "Jeddah",
    circuit: "Jeddah Corniche Circuit", wiki: "Jeddah_Corniche_Circuit", photoQuery: "Jeddah Corniche Circuit",
    start: "2026-04-17", end: "2026-04-19", raceUtc: "2026-04-19T17:00:00Z", cancelled: true,
    length: 6.174, laps: 50, firstGp: 2021, turns: 27, type: "Street",
    lapRecord: { time: "1:30.734", driver: "Lewis Hamilton", team: "Mercedes", year: 2021 } },

  { id: "us-2022", winner: "antonelli", gp: "Miami Grand Prix", country: "United States", cc: "us", city: "Miami",
    circuit: "Miami International Autodrome", wiki: "Miami_International_Autodrome",
    start: "2026-05-01", end: "2026-05-03", raceUtc: "2026-05-03T20:00:00Z", sprint: true,
    length: 5.412, laps: 57, firstGp: 2022, turns: 19, type: "Street",
    lapRecord: { time: "1:29.708", driver: "Max Verstappen", team: "Red Bull", year: 2023 } },

  { id: "ca-1978", winner: "antonelli", gp: "Canadian Grand Prix", country: "Canada", cc: "ca", city: "Montréal",
    circuit: "Circuit Gilles Villeneuve", wiki: "Circuit_Gilles_Villeneuve",
    start: "2026-05-22", end: "2026-05-24", raceUtc: "2026-05-24T20:00:00Z", sprint: true,
    length: 4.361, laps: 70, firstGp: 1978, turns: 14, type: "Semi-street",
    lapRecord: { time: "1:13.078", driver: "Valtteri Bottas", team: "Mercedes", year: 2019 } },

  { id: "mc-1929", winner: "antonelli", gp: "Monaco Grand Prix", country: "Monaco", cc: "mc", city: "Monte Carlo",
    circuit: "Circuit de Monaco", wiki: "Circuit_de_Monaco",
    start: "2026-06-05", end: "2026-06-07", raceUtc: "2026-06-07T13:00:00Z",
    length: 3.337, laps: 78, firstGp: 1950, turns: 19, type: "Street",
    lapRecord: { time: "1:12.909", driver: "Lewis Hamilton", team: "Mercedes", year: 2021 } },

  { id: "es-1991", winner: "hamilton", gp: "Barcelona-Catalunya Grand Prix", country: "Spain", cc: "es", city: "Barcelona",
    circuit: "Circuit de Barcelona-Catalunya", wiki: "Circuit_de_Barcelona-Catalunya",
    start: "2026-06-12", end: "2026-06-14", raceUtc: "2026-06-14T13:00:00Z",
    length: 4.657, laps: 66, firstGp: 1991, turns: 14, type: "Permanent",
    lapRecord: { time: "1:16.330", driver: "Max Verstappen", team: "Red Bull", year: 2023 } },

  { id: "at-1969", winner: "russell", gp: "Austrian Grand Prix", country: "Austria", cc: "at", city: "Spielberg",
    circuit: "Red Bull Ring", wiki: "Red_Bull_Ring",
    start: "2026-06-26", end: "2026-06-28", raceUtc: "2026-06-28T13:00:00Z",
    length: 4.318, laps: 71, firstGp: 1970, turns: 10, type: "Permanent",
    lapRecord: { time: "1:05.619", driver: "Carlos Sainz", team: "McLaren", year: 2020 } },

  { id: "gb-1948", winner: "leclerc", gp: "British Grand Prix", country: "Great Britain", cc: "gb", city: "Silverstone",
    circuit: "Silverstone Circuit", wiki: "Silverstone_Circuit",
    start: "2026-07-03", end: "2026-07-05", raceUtc: "2026-07-05T14:00:00Z", sprint: true,
    length: 5.891, laps: 52, firstGp: 1950, turns: 18, type: "Permanent",
    lapRecord: { time: "1:27.097", driver: "Max Verstappen", team: "Red Bull", year: 2020 } },

  { id: "be-1925", winner: "antonelli", gp: "Belgian Grand Prix", country: "Belgium", cc: "be", city: "Spa-Francorchamps",
    circuit: "Circuit de Spa-Francorchamps", wiki: "Circuit_de_Spa-Francorchamps",
    start: "2026-07-17", end: "2026-07-19", raceUtc: "2026-07-19T13:00:00Z",
    length: 7.004, laps: 44, firstGp: 1950, turns: 19, type: "Permanent",
    lapRecord: { time: "1:44.701", driver: "Sergio Pérez", team: "Red Bull", year: 2024 } },

  { id: "hu-1986", winner: "norris", gp: "Hungarian Grand Prix", country: "Hungary", cc: "hu", city: "Budapest",
    circuit: "Hungaroring", wiki: "Hungaroring",
    start: "2026-07-24", end: "2026-07-26", raceUtc: "2026-07-26T13:00:00Z",
    length: 4.381, laps: 70, firstGp: 1986, turns: 14, type: "Permanent",
    lapRecord: { time: "1:16.627", driver: "Lewis Hamilton", team: "Mercedes", year: 2020 } },

  { id: "nl-1948", winner: "norris", gp: "Dutch Grand Prix", country: "Netherlands", cc: "nl", city: "Zandvoort",
    circuit: "Circuit Zandvoort", wiki: "Circuit_Zandvoort",
    start: "2026-08-21", end: "2026-08-23", raceUtc: "2026-08-23T13:00:00Z", sprint: true,
    length: 4.259, laps: 72, firstGp: 1952, turns: 14, type: "Permanent",
    lapRecord: { time: "1:11.097", driver: "Lewis Hamilton", team: "Mercedes", year: 2021 } },

  { id: "it-1922", winner: "antonelli", gp: "Italian Grand Prix", country: "Italy", cc: "it", city: "Monza",
    circuit: "Autodromo Nazionale Monza", wiki: "Monza_Circuit",
    start: "2026-09-04", end: "2026-09-06", raceUtc: "2026-09-06T13:00:00Z",
    length: 5.793, laps: 53, firstGp: 1950, turns: 11, type: "Permanent",
    lapRecord: { time: "1:20.901", driver: "Lando Norris", team: "McLaren", year: 2025 } },

  { id: "es-2026", winner: "antonelli", gp: "Spanish Grand Prix", country: "Spain", cc: "es", city: "Madrid",
    circuit: "Madring", wiki: "Madring", photoQuery: "Madring circuit Madrid",
    start: "2026-09-11", end: "2026-09-13", raceUtc: "2026-09-13T13:00:00Z", newVenue: true,
    length: 5.474, laps: 57, firstGp: 2026, turns: 22, type: "Hybrid street",
    lapRecord: { time: "1:35.587", driver: "George Russell", team: "Mercedes", year: 2026 } },

  { id: "az-2016", winner: "russell", gp: "Azerbaijan Grand Prix", country: "Azerbaijan", cc: "az", city: "Baku",
    circuit: "Baku City Circuit", wiki: "Baku_City_Circuit",
    start: "2026-09-24", end: "2026-09-26", raceUtc: "2026-09-26T11:00:00Z", saturday: true,
    length: 6.003, laps: 51, firstGp: 2016, turns: 20, type: "Street",
    lapRecord: { time: "1:43.009", driver: "Charles Leclerc", team: "Ferrari", year: 2019 } },

  { id: "my-1999", winner: "verstappen", gp: "Bahrain Grand Prix in Malaysia", country: "Malaysia", cc: "my", city: "Sepang",
    circuit: "Sepang International Circuit", wiki: "Sepang_International_Circuit",
    start: "2026-10-02", end: "2026-10-04", raceUtc: "2026-10-04T07:00:00Z", replacement: true,
    length: 5.543, laps: 56, firstGp: 1999, turns: 15, type: "Permanent",
    lapRecord: { time: "1:34.080", driver: "Sebastian Vettel", team: "Ferrari", year: 2017 } },

  { id: "sg-2008", winner: "verstappen", gp: "Singapore Grand Prix", country: "Singapore", cc: "sg", city: "Marina Bay",
    circuit: "Marina Bay Street Circuit", wiki: "Marina_Bay_Street_Circuit",
    start: "2026-10-09", end: "2026-10-11", raceUtc: "2026-10-11T12:00:00Z", sprint: true, night: true,
    length: 4.940, laps: 62, firstGp: 2008, turns: 19, type: "Street",
    lapRecord: { time: "1:33.808", driver: "Lewis Hamilton", team: "Ferrari", year: 2025 } },

  { id: "us-2012", winner: "antonelli", gp: "United States Grand Prix", country: "United States", cc: "us", city: "Austin",
    circuit: "Circuit of the Americas", wiki: "Circuit_of_the_Americas",
    start: "2026-10-23", end: "2026-10-25", raceUtc: "2026-10-25T20:00:00Z",
    length: 5.513, laps: 56, firstGp: 2012, turns: 20, type: "Permanent",
    lapRecord: { time: "1:36.169", driver: "Charles Leclerc", team: "Ferrari", year: 2019 } },

  { id: "mx-1962", winner: "verstappen", gp: "Mexico City Grand Prix", country: "Mexico", cc: "mx", city: "Mexico City",
    circuit: "Autódromo Hermanos Rodríguez", wiki: "Autódromo_Hermanos_Rodríguez",
    start: "2026-10-30", end: "2026-11-01", raceUtc: "2026-11-01T20:00:00Z",
    length: 4.304, laps: 71, firstGp: 1963, turns: 17, type: "Permanent",
    lapRecord: { time: "1:17.774", driver: "Valtteri Bottas", team: "Mercedes", year: 2021 } },

  { id: "br-1940", gp: "São Paulo Grand Prix", country: "Brazil", cc: "br", city: "São Paulo",
    circuit: "Autódromo José Carlos Pace", wiki: "Interlagos_Circuit",
    start: "2026-11-06", end: "2026-11-08", raceUtc: "2026-11-08T17:00:00Z",
    length: 4.309, laps: 71, firstGp: 1973, turns: 15, type: "Permanent",
    lapRecord: { time: "1:10.540", driver: "Valtteri Bottas", team: "Mercedes", year: 2018 } },

  { id: "us-2023", gp: "Las Vegas Grand Prix", country: "United States", cc: "us", city: "Las Vegas",
    circuit: "Las Vegas Strip Circuit", wiki: "Las_Vegas_Strip_Circuit", photoQuery: "Las Vegas Grand Prix",
    start: "2026-11-19", end: "2026-11-21", raceUtc: "2026-11-22T04:00:00Z", saturday: true, night: true,
    length: 6.201, laps: 50, firstGp: 2023, turns: 17, type: "Street",
    lapRecord: { time: "1:33.365", driver: "Max Verstappen", team: "Red Bull", year: 2025 } },

  { id: "qa-2004", gp: "Qatar Grand Prix", country: "Qatar", cc: "qa", city: "Lusail",
    circuit: "Lusail International Circuit", wiki: "Lusail_International_Circuit",
    start: "2026-11-27", end: "2026-11-29", raceUtc: "2026-11-29T16:00:00Z", night: true,
    length: 5.419, laps: 57, firstGp: 2021, turns: 16, type: "Permanent",
    lapRecord: { time: "1:22.384", driver: "Lando Norris", team: "McLaren", year: 2024 } },

  { id: "ae-2009", gp: "Abu Dhabi Grand Prix", country: "Abu Dhabi", cc: "ae", city: "Yas Island",
    circuit: "Yas Marina Circuit", wiki: "Yas_Marina_Circuit",
    start: "2026-12-04", end: "2026-12-06", raceUtc: "2026-12-06T13:00:00Z", night: true,
    length: 5.281, laps: 58, firstGp: 2009, turns: 16, type: "Permanent",
    lapRecord: { time: "1:26.103", driver: "Max Verstappen", team: "Red Bull", year: 2021 } },
];
