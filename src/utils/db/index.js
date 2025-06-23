import wineData from './wine.json';

const DB = {
  getWine: () => {
    // Mimic an async API call
    return Promise.resolve({ data: wineData });
  }
};

export default DB;
// import axios from "axios";

// const api = {
//     getCocktails: function() {
//         return axios.get("https://dvasquez4155.github.io/TFM/db/cocktails.json");
//     },
//     getFish: function() {
//         return axios.get("https://dvasquez4155.github.io/TFM/db/fish.json");
//     },
//     getFood: function() {
//         return axios.get("https://dvasquez4155.github.io/TFM/db/food.json");
//     },
//     getLiquor: function() {
//         return axios.get("https://dvasquez4155.github.io/TFM/db/liquor.json");
//     },
//     getWine: function() {
//         return axios.get("https://dvasquez4155.github.io/TFM/db/wine.json");
//     }
// };
// export default api;