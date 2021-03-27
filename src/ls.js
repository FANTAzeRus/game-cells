import {baseConst} from "./consts";

const key = "GameCellData";

export const ls = {
  setLS(data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  getLS() {
    var data = localStorage.getItem(key);
    data = JSON.parse(data) ?? {
      level: baseConst.startLevel,
      score: 0,
    };

    return data;
  },
};
