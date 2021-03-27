<template>
  <div class="appWrapper">
    <div class="title">Игра "Угадай все ячейки"!</div>
    <div class="board">
      <div
        class="cell"
        v-for="cell in state.cells"
        :key="cell.id"
        :class="{
          success:
            (state.appStatus === gameStatusConst.showPrompt &&
              cell.status === cellStatusConst.set) ||
            cell.status === cellStatusConst.success,
          error: cell.status === cellStatusConst.fail,
        }"
        @click="clickHandler(cell)"
      ></div>
    </div>
    <div class="level">Сложность: {{ state.level }}</div>
    <div class="score">Очки: {{ state.score }}</div>
    <div class="score">Максимальные очки: {{ state.maxScore }}</div>
    <div class="level">Максимальная сложность: {{ state.maxLevel }}</div>
    <button
      class="btn"
      @click="newGame"
      :disabled="state.appStatus !== gameStatusConst.stop"
    >
      {{
        state.appStatus === gameStatusConst.stop
          ? "Начать игру"
          : "Игра зупущена"
      }}
    </button>

    <div
      class="messagesWrapper"
      v-if="
        state.appStatus === gameStatusConst.levelComplete ||
        state.appStatus === gameStatusConst.gameOver
      "
    >
      <div class="gameOver" v-if="state.appStatus === gameStatusConst.gameOver">
        Игра окончена!
        <div class="newRecord" v-if="state.score > state.maxScore">
          Вы установили новый рекорд {{ state.score }}!
        </div>
      </div>
      <div
        class="levelComplete"
        v-if="state.appStatus === gameStatusConst.levelComplete"
      >
        Уровень пройден!
        <div class="newRecord" v-if="state.score > state.maxScore">
          Вы установили новый рекорд {{ state.score }}!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "./styles/index.scss";
import { computed, onBeforeMount, reactive, watch } from "vue";
import { baseConst, cellStatusConst, gameStatusConst } from "./consts.js";
import { ls } from "./ls.js";

export default {
  name: "App",
  components: {},
  setup() {
    const { level, score } = Object(ls.getLS());
    const state = reactive({
      appStatus: gameStatusConst.stop,
      level: baseConst.startLevel,
      maxLevel: level,
      score: 0,
      maxScore: score,
      levelCoeficient: baseConst.levelCoeficient,
      cells: [],
    });

    onBeforeMount(() => {
      init();
    });

    const init = () => {
      state.cells = [];
      state.appStatus = gameStatusConst.stop;

      for (let i = 0; i < baseConst.cellsCount; i++) {
        state.cells.push({ id: i, status: cellStatusConst.empty });
      }
    };

    const calcScore = () => {
      state.maxScore =
        state.score > state.maxScore ? state.score : state.maxScore;
      ls.setLS({ score: state.maxScore, level: state.maxLevel });
    };

    const prepareCells = () => {
      for (let i = 0; i < state.level; i++) {
        let idx = randomizer(0, 24);
        if (state.cells[idx].status === cellStatusConst.empty) {
          state.cells[idx].status = cellStatusConst.set;
        } else {
          i--;
        }
      }
    };

    const newGame = () => {
      prepareGame();
      start();
    };

    const start = () => {
      init();
      prepareCells();
      state.appStatus = gameStatusConst.showPrompt;
      setTimeout(() => {
        state.appStatus = gameStatusConst.play;
      }, baseConst.timeToShowPrompt);
    };

    const prepareGame = () => {
      state.level = baseConst.startLevel;
      state.score = 0;
      state.levelCoeficient = baseConst.levelCoeficient;
    };

    const nextLevel = () => {
      state.level = state.level + 1;
      state.maxLevel =
        state.level > state.maxLevel ? state.level : state.maxLevel;

      calcScore();
      start();
    };

    const randomizer = (min, max) => {
      return Math.round(min - 0.5 + Math.random() * (max - min + 1));
    };

    const clickHandler = (cell) => {
      if (state.appStatus !== gameStatusConst.play) {
        return;
      }
      if (
        cell.status === cellStatusConst.set ||
        cell.status === cellStatusConst.success
      ) {
        cell.status = cellStatusConst.success;
        addScore();
      } else {
        cell.status = cellStatusConst.fail;
      }
    };

    const addScore = () => {
      const score = baseConst.levelScore * state.levelCoeficient;
      state.score += score;
    };

    const gameOver = computed(
      () =>
        state.cells.filter((c) => c.status === cellStatusConst.fail).length > 0
    );

    const levelComplete = computed(() => {
      const count = state.cells.filter(
        (c) => c.status === cellStatusConst.success
      ).length;

      return state.level === count;
    });

    //LevelComplete
    watch(levelComplete, (val) => {
      if (val === true) {
        setTimeout(() => {
          calcScore();
          state.appStatus = gameStatusConst.levelComplete;
          state.levelCoeficient += baseConst.levelCoeficientStep;
          state.score += baseConst.levelCompleteScore;
          calcScore();
          setTimeout(() => {
            nextLevel();
          }, baseConst.timeToNewLevel);
        }, 300);
      }
    });

    //GameOver
    watch(gameOver, (val) => {
      if (val === true) {
        setTimeout(() => {
          state.appStatus = gameStatusConst.gameOver;
          calcScore();
          setTimeout(() => {
            prepareGame();
            init();
          }, baseConst.timeToGameOver);
        }, 300);
      }
    });

    return {
      state,
      cellStatusConst,
      gameStatusConst,
      newGame,
      clickHandler,
      gameOver,
      levelComplete,
    };
  },
};
</script>
