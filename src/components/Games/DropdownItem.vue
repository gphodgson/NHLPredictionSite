<template>
    <div class="dropdown">
        <p v-for="(goal, index,) in goalData" :key="index">
            {{ goal.team.triCode }}
            {{ getPeriodNamingScheme(goal.about.periodType, 
                                    goal.about.period, 
                                    goal.about.periodTime) 
            }}
            <span :class="{scorer: player.playerType === 'Scorer'}" v-for="(player, j) in goal.players" :key="j">{{ player.player.fullName }} | </span>
        </p>
    </div>
</template>

<script>
const PeroidType = {
    REGULAR: 'REGULAR',
    OVERTIME: 'OVERTIME',
    SHOOTOUT: 'SHOOTOUT'
}

export default {
    props: ['goalData'],
    methods: {
        getScorerAndAssists(goalIndex){
            console.log(this.goalData[goalIndex])
            return this.goalData[goalIndex].players[0].fullname
        },
        getPeriodNamingScheme(periodType, periodNum, periodTime){
            if(periodType === PeroidType.REGULAR){
                return `Period ${periodNum}(${periodTime}):`
            }else if (periodType === PeroidType.OVERTIME){
                return `OT(${periodTime}):`
            }else if (periodType === PeroidType.SHOOTOUT){
                return "SO:"
            }else{
                return "??:"
            }
        }
    }
}
</script>

<style>
    .dropdown{
        text-align: center;
        margin: auto;
    }

    .scorer{
        font-weight: bold;
    }

</style>