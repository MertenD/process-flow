import {UserStats} from "@/model/UserStats";

export default async function(userId: string, teamId: number): Promise<UserStats> {

    return {
        experience: 130,
        experiencePerLevel: 100,
        coins: 1234,
        badges: ["Fleißige Biene", "Teamplayer", "Früher Vogel"]
    }
}