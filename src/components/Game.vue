<template>
  <div class="game">
    <h1>Hangman</h1>
    <p>
      To play, simply select letters to try to guess the word. Everytime you
      select an incorrect letter you will get closer to losing the game... and
      your neck!
    </p>

    <div class="columns">
      <div class="maskedWord">
        <span v-if="isFinished">{{ word }}</span>
        <span v-else>{{ maskedWord }}</span>
      </div>
      <div>
        <img :src="hangman" />
      </div>
    </div>

    <div>
      Your Guesses:
      <span v-for="(letter, idx) in guesses" :key="idx" class="guess">
        {{ letter }}
      </span>
    </div>

    <div v-if="isFinished" class="gameOver">
      <span v-if="isWinner">Congratulations, you won!</span>
      <span v-else>Sorry, you lost.</span>
      <button @click="newGame">Play Again</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "Game",
  computed: {
    ...mapState([
      "word",
      "guesses",
      "misses",
      "hits",
      "isFinished",
      "isWinner"
    ]),
    ...mapGetters(["maskedWord", "hangman"])
  },
  created() {
    this.newGame();
  },
  methods: {
    async newGame() {
      await this.$store.dispatch("newGame");
      window.addEventListener("keypress", this.guessLetter);
    },
    guessLetter(e) {
      let letter = String.fromCharCode(e.keyCode).toLowerCase();
      this.$store.dispatch("guessLetter", letter);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.maskedWord {
  font-family: "Courier New", Courier, monospace;
  font-size: 48px;
  text-transform: uppercase;
  vertical-align: middle;
  text-align: center;
  line-height: 200px;
}
.guess {
  font-family: "Courier New", Courier, monospace;
  margin: 4px;
  text-transform: uppercase;
}
.columns {
  display: grid;
  grid-template-columns: 30% 80%;
}
.gameOver {
  margin-top: 10px;
  font-weight: bold;
}
</style>
