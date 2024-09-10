'use client'

import {useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {CheckIcon, PlusCircleIcon, XIcon} from 'lucide-react'
import {TeamInfo} from "@/model/TeamInfo";
import Link from 'next/link'
import createTeamAndAddCreatorAsAdmin from "@/actions/create-team-and-add-creator-as-admin";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {teamColorSchemes} from "@/model/colors";

export interface TeamsOverviewProps {
  userId: string
  teams: TeamInfo[]
  invitations: string[] // TODO: Define type for invitations
}

export function TeamsOverview({ userId, teams, invitations }: TeamsOverviewProps) {
  const [newTeamName, setNewTeamName] = useState<string>("")
  const [selectedColorScheme, setSelectedColorScheme] = useState(teamColorSchemes[0])

  const router = useRouter()

  const renderCard = (item: any, isTeam: boolean = true) => (
    <Card 
      key={item.teamId}
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-102 bg-gradient-to-br ${item.team.colorSchemeFrom} ${item.team.colorSchemeTo}`}
    >
      <CardContent className="flex flex-col items-center justify-center h-32 p-4">
        <h3 className="text-lg font-semibold text-white mb-2">{isTeam ? item.team.name : item}</h3>
        {!isTeam && (
          <div className="flex space-x-2">
            <Button size="sm" variant="secondary" onClick={() => console.log("Accept invite", item)}>
              <CheckIcon className="w-4 h-4 mr-1" /> Annehmen
            </Button>
            <Button size="sm" variant="secondary" onClick={() => console.log("Decline invite", item)}>
              <XIcon className="w-4 h-4 mr-1" /> Ablehnen
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return <div className="space-y-6">
    <Card>
          <CardHeader>
            <CardTitle>Ihre Teams</CardTitle>
            <CardDescription>Klicken Sie auf ein Team, um es auszuwählen und zur Hauptanwendung zu gelangen.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team: TeamInfo) => {
                  return <Link key={team.teamId + "-link"} href={`/${team.teamId}/tasks`}>
                    { renderCard(team) }
                  </Link>
                } )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ausstehende Einladungen</CardTitle>
            <CardDescription>Nehmen Sie Einladungen an oder lehnen Sie sie ab.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {invitations.map((invitation) => renderCard(invitation, false))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Neues Team erstellen</CardTitle>
            <CardDescription>Geben Sie einen Namen für Ihr neues Team ein und wählen Sie ein Farbschema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Input
                type="text"
                placeholder="Team Name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={`w-[200px] justify-start`}>
                      <div className={`w-4 h-4 bg-gradient-to-r rounded mr-2 ${selectedColorScheme.from} ${selectedColorScheme.to}`} />
                      {selectedColorScheme.name}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Card>
                      <CardContent className="grid gap-2 p-2">
                        {teamColorSchemes.map((scheme) => (
                          <Button
                            key={scheme.name}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => setSelectedColorScheme(scheme)}
                          >
                            <div className={`w-4 h-4 rounded mr-2 bg-gradient-to-r ${scheme.from} ${scheme.to}`} />
                            {scheme.name}
                          </Button>
                        ))}
                      </CardContent>
                    </Card>
                  </PopoverContent>
                </Popover>
                <Button onClick={() => {
                  const colorScheme = { "from": selectedColorScheme.from, "to": selectedColorScheme.to }
                  createTeamAndAddCreatorAsAdmin(userId, newTeamName, colorScheme).then((createdTeamId) => {
                    toast({
                      variant: "success",
                      title: "Team erstellt!",
                      description: `Das Team "${newTeamName}" wurde erfolgreich erstellt.`,
                    })
                    setNewTeamName("")
                    router.push(`/${createdTeamId}/tasks`)
                  }).catch((error) => {
                    toast({
                      variant: "destructive",
                      title: "Something went wrong!",
                      description: error.message,
                    })
                  })
                }}>
                  <PlusCircleIcon className="w-4 h-4 mr-2" /> Erstellen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
}