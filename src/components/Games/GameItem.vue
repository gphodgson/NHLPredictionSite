<template>
    <div  :class="GameStatus">
        
        <div class="status">
            <br/>
            <div v-if="inGame">
                <span>Period {{ game.currentPeriod }}({{ game.currentPeriodTimeLeft }})</span>
            </div>
            <div v-else>
                <span>{{ game.status }}<span v-if="preview">({{ startTime.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12:true}) }})</span></span>
            </div>
        </div>

        <div class="game">
            <TeamItem v-on:attempt-selection="attemptSelection"
                 v-bind:key="game.teams.home.id" 
                 v-bind:team="game.teams.home" 
                 v-bind:finished="finished" 
                 v-bind:inGame="inGame" 
                 v-bind:selected="homeSelected"
                 v-bind:predicted="homePredicted"
                 v-bind:scoreSide="true"
                 />
            <div>
                <span>vs</span>
            </div>
            <TeamItem v-on:attempt-selection="attemptSelection" 
                v-bind:key="game.teams.away.id" 
                v-bind:team="game.teams.away" 
                v-bind:finished="finished" 
                v-bind:inGame="inGame"
                v-bind:selected="awaySelected"
                v-bind:predicted="awayPredicted"
                v-bind:scoreSide="false"
                />
        </div>

        <div class="button-container">
            <button v-if="!predictionLocked"  
                        class="predict-button"
                        v-on:click="makePrediction">
                Make Prediction
            </button>

            
        </div>

        <div class="dropdown-container">
            <DropdownItem v-if="showDropDown" v-bind:goalData="game.goalData"/>
            
            <p  v-on:click="toggleDropdown" v-if="game.status != 'Preview' && !showDropDown" class="expand_button" >▼</p>
            <p  v-on:click="toggleDropdown" v-if="game.status != 'Preview' && showDropDown" class="expand_button" >▲</p>
        </div>
        
    </div> 
     
</template>

<script>
const Status = {
    PREVIEW: 'Preview',
    FINAL: 'Final',
    LIVE: 'Live'
};

import TeamItem from "./TeamItem.vue";
import DropdownItem from "./DropdownItem.vue"

export default {
    name: "GameItem",
    components:{
        TeamItem,
        DropdownItem
    },
    data(){
        return{
            finished: this.game.status === Status.FINAL,
            inGame: this.game.status === Status.LIVE,
            preview: this.game.status === Status.PREVIEW,
            startTime: new Date(this.game.startTime),
            awaySelected: false,
            homeSelected: false,
            awayPredicted: false,
            homePredicted: false,
            predictionLocked: this.game.status !== Status.PREVIEW,
            expandString: '▼',
            showDropDown: false,
        }
    },
    methods: {
        toggleDropdown(){
            this.showDropDown = !this.showDropDown;
        },
        attemptSelection(key){
            // console.log(key)
            if (this.game.status === Status.PREVIEW && !this.predictionLocked){
                if(this.game.teams.away.id === key){
                    this.awaySelected = !this.awaySelected;
                    this.homeSelected = false;
                }else if (this.game.teams.home.id === key){
                    this.awaySelected = false;
                    this.homeSelected = !this.homeSelected;
                }
            }
        },
        makePrediction(){
            if(this.awaySelected !== false){
                this.awaySelected = false;
                this.awayPredicted = true;
                this.predictionLocked = true;
                this.$toastr.s(`You predicted the ${this.game.teams.away.name} to win!`)
            }else if (this.homeSelected !== false){
                this.homeSelected = false;
                this.homePredicted = true;
                this.predictionLocked = true;
                this.$toastr.s(`You predicted the ${this.game.teams.home.name} to win!`)
            }else{
                this.$toastr.w("Please select a team!")
            }
        }
    },
    computed:{
        GameStatus(){
            return {
                inProgress: this.inGame,
                preview: this.preview,
                final: this.finished
            }
        }

    },
    props: ["game"]
}
</script>

<style scoped>
    .winner{
        color: green
    }
    .loser{
        color:red
    }
    .game{
        text-align: center;
        padding-top:40px;
        padding-bottom:40px;
        display:flex;
        justify-content: space-around;
        align-items: center;
    }
    .score{
        margin:10px;
        font-size: 3em;
    }
    .inProgress{
        background: rgb(210, 243, 253);
        border-bottom: 2px lightgrey solid;
    }
    .preview{
        background: rgb(247, 195, 195);
        border-bottom: 2px lightgrey solid;
    }
    .final{
        background: rgb(213, 252, 223);
        border-bottom: 2px lightgrey solid;
    }

    .status{
        text-align: center;
    }

    .predict-button{
        text-align: center;
        border: 2px solid rgb(131, 131, 131);
        background: rgb(183, 183, 183);
        width:fit-content;
        margin:auto;
        margin-bottom: 10px;
        padding: 5px;
    }
    .button-container{
        display: flex;
    }
    .expand_button{
        text-align: center;
        margin:auto;
        margin-bottom: 10px;
        border-top:3px lightgrey solid;
        /* padding-left: 10px;
        padding-right: 10px; */
        cursor: pointer;
        width:40px;
    }
    .expand_button:hover{
        background: rgb(227, 227, 227);
    }
</style>