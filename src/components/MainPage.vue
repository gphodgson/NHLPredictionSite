<template>
    <!-- <div>make your predictions!</div> -->
    <div v-if="user">
        <p >Welcome, {{ user.displayName }}</p>
        <GamesList v-bind:games="games"/>
        <button v-on:click="logout" class="authButton">Log Out</button>
    </div>
    <div v-else>
        <p>Please log in to make predictions!</p>
        <p><input type="email" placeholder="Email" v-model="email"/></p>
        <p><input type="password" placeholder="Password" v-model="password"/></p>
        <p><button v-on:click="loginEmail" class="authButton">Log In</button> <button v-on:click="register" class="authButton">Register</button></p>
    </div>
</template>

<script>
    import Axios from 'axios'
    import GamesList from "./Games/GamesList.vue"
    import {StaticTeamData} from "../staticTeamData.js"
    import {getAuth, 
            signInWithEmailAndPassword, 
            createUserWithEmailAndPassword,
            onAuthStateChanged,
            } 
            from 'firebase/auth'

    const NHL_URI = "https://statsapi.web.nhl.com"

    export default {
    name: "MainPage",
    data() {
        return {
            games: [],
            email: '',
            password: '',
            user: getAuth().currentUser
        };
    },
    methods: {
        processGamesResponse(gamesData) {
            gamesData.forEach(e => {
                this.processGame(e.link);
            });
        },
        register(){
            console.log(this.email)
            createUserWithEmailAndPassword(getAuth(), this.email, this.password)
            .then((response) => {
                    console.log(response)
                    this.user = response.user;
                })
            .catch((error) => {
                console.log(error)
            })
        },
        loginEmail(){
            signInWithEmailAndPassword(getAuth(), this.email, this.password)
                .then((response) => {
                    console.log(response)
                    this.user = response.user;
                    console.log(getAuth().currentUser)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        logout(){
            getAuth().signOut()
            this.user = null;
        },
        onUserChange(user){
            if (user) {
                this.user = user
            } else {
                // No user is signed in.
            }
        },
        processGame(gameLink) {
            Axios.get(NHL_URI + gameLink)
                .then((response) => {
                const game = this.parseGame(response.data);
                this.games.push(game);
                this.games.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            })
                .catch((error) => {
                console.error(error);
            });
        },
        parseGame(response) {
            // console.log(response)
            let game = {
                id: response.gamePk,
                status: response.gameData.status.abstractGameState,
                startTime: response.gameData.datetime.dateTime,
                currentPeriod: response.liveData.linescore.currentPeriod,
                currentPeriodTimeLeft: response.liveData.linescore.currentPeriodTimeRemaining,
                goalData: this.initGoalData(response.liveData.plays),
                teams: {
                    away: this.initTeam(response.liveData.boxscore.teams.away),
                    home: this.initTeam(response.liveData.boxscore.teams.home),
                }
            };

            if (game.teams.away.goals > game.teams.home.goals){
                game.teams.away.win = true;
            }else if (game.teams.away.goals < game.teams.home.goals){
                game.teams.home.win = true;
            }

            return game;
        },
        initGoalData(plays){
            let goalData = [];

            plays.scoringPlays.forEach(e => {
                console.log(plays.allPlays[e])
                goalData.push(plays.allPlays[e])
            });

            return goalData;
        },
        initTeam(teamData) {
            return {
                name: teamData.team.name,
                id: teamData.team.id,
                win: false,
                selected: false,
                goals: teamData.teamStats.teamSkaterStats.goals,
                staticData: teamData.team.id in StaticTeamData ? 
                    StaticTeamData[teamData.team.id] :
                    StaticTeamData[0]
            };
        }
    },
    created() {
        Axios.get(NHL_URI + "/api/v1/schedule")
            .then((response) => {
            this.processGamesResponse(response.data.dates[0].games);
        })
            .catch((error) => {
            console.error(error);
        });

        onAuthStateChanged(getAuth(), this.onUserChange);

        this.user = getAuth().currentUser;
    },
    components: { GamesList }
}
</script>

<style scoped>
    .authButton{
        border: 1px solid black;
        padding: 3px;
    }
</style>
