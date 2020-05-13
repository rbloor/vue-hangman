import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        words: [],
        guesses: [],
        word: '',
        misses: 0,
        hits: 0,
        isFinished: false,
        isWinner: false,
    },
    mutations: {
        reset(state, word) {
            state.guesses = []
            state.word = word
            state.misses = 0
            state.hits = 0
            state.isFinished = false
            state.isWinner = false
        },
        setWords(state, words) {
            state.words = words
        },
        addLetter(state, letter) {
            state.guesses.push(letter)
            state.guesses.sort()
        },
        guessWrong(state) {
            state.misses++
        },
        guessRight(state) {
            state.hits++
        },
        finish(state, isWinner) {
            state.isFinished = true
            state.isWinner = isWinner
        },
    },
    getters: {
        hangman(state) {
            if (state.misses === 0) return 'img/h0.png'
            if (state.misses === 1) return 'img/h1.png'
            if (state.misses === 2 || state.misses === 3) return 'img/h2.png'
            if (state.misses === 4) return 'img/h3.png'
            if (state.misses === 5) return 'img/h4.png'
            if (state.misses === 6 || state.misses === 7) return 'img/h5.png'
            return 'img/h6.png'
        },
        maskedWord(state) {
            let maskedWord = ''
            for (let i = 0; i < state.word.length; i++) {
                let char = state.word.charAt(i)
                if (state.guesses.indexOf(char) === -1) {
                    maskedWord += '-'
                } else {
                    maskedWord += char
                }
            }
            return maskedWord
        },
    },
    actions: {
        guessLetter(context, letter) {
            // Duplicate Guess or game is finished
            if (context.state.guesses.indexOf(letter) >= 0 || context.state.isFinished == true) {
                return
            }

            context.commit('addLetter', letter)

            // Bad Guess
            if (context.state.word.indexOf(letter) === -1) {
                context.commit('guessWrong')
            }

            // Good Guess
            if (context.state.word.indexOf(letter) >= 0) {
                context.commit('guessRight')
            }

            // Game Over - LOSS
            if (context.state.misses === 8) {
                context.commit('finish', false)
            }

            // Game Over - WIN
            if (context.state.hits === context.state.word.length) {
                context.commit('finish', true)
            }
        },
        async newGame(context) {
            // Populate Words
            if (context.state.words.length === 0) {
                let response = await fetch('./files/words.txt')
                let text = await response.text()
                context.commit('setWords', text.split('\n'))
            }
            // Select Random Word
            let wordCount = context.state.words.length - 1
            let randomNumber = Math.floor(Math.random() * Math.floor(wordCount))
            let randomWord = context.state.words[randomNumber]
            context.commit('reset', randomWord)
        },
    },
    modules: {},
})
