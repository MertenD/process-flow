'use client'

import React, {useEffect, useMemo, useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Badge} from "@/components/ui/badge"
import {Search} from "lucide-react"
import {ConfirmationDialog} from '../ConfirmationDialog'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import getRoles from "@/actions/get-roles";
import {Role} from "@/types/database.types";
import {createClient} from "@/utils/supabase/client";
import getMembers from "@/actions/get-members";
import {Checkbox} from "@/components/ui/checkbox";
import updateProfileRolesInTeam from "@/actions/update-profile-roles-in-team";
import {toast} from "@/components/ui/use-toast";

type MemberRole = {
  id: number
  name: string
}

export type Member = {
  id: string
  name: string
  email: string
  roles: MemberRole[]
}

type ConfirmDialogState = {
  isOpen: boolean
  type: string | null
  id: string | null
}

export interface MemberManagementProps {
    teamId: number
}

export function MemberManagement({ teamId }: MemberManagementProps) {

  const supabase = createClient()

  const [members, setMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ isOpen: false, type: null, id: null })
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState<boolean>(false)

  const [roles, setRoles] = useState<Role[]>([])
  const [editRoles, setEditRoles] = useState<MemberRole[]>([])

  useEffect(() => {
    getRoles(teamId).then((roles: Role[]) => {
      setRoles(roles || [])
      console.log("Roles", roles)
    }).catch((error) => {
      console.error("Error fetching roles", error)
    })
  }, [teamId]);

  useEffect(() => {
    const subscription = supabase
        .channel("add_or_update_role_for_member_management")
        .on("postgres_changes", {
          event: "*",
          schema: "public",
          table: "role",
          filter: `belongs_to=eq.${teamId}`
        }, () => {
          getRoles(teamId).then((roles: Role[]) => {
            setRoles(roles || [])
          })
        })
        .subscribe()

    return () => {
      subscription.unsubscribe().then()
    }
  }, [supabase, teamId])

  useEffect(() => {

    const subscription = supabase
        .channel("add_or_update_profile_role_team_for_member_management")
        .on("postgres_changes", {
          event: "*",
          schema: "public",
          table: "profile_team",
          filter: `team_id=eq.${teamId}`
        }, () => {
            getMembers(teamId).then((members: Member[]) =>
                setMembers(members || [])
            )
        })
        .subscribe()

    return () => {
      subscription.unsubscribe().then()
    }
  }, [supabase, teamId])

  useEffect(() => {
    getMembers(teamId).then((members: Member[]) =>
      setMembers(members || [])
    )
  }, [teamId]);

  const filteredMembers = useMemo(() => {
    return members.filter(member =>
        (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (roleFilter === 'all' || member.roles.map(role => role.id.toString()).includes(roleFilter))
    )
  }, [members, searchTerm, roleFilter])

  const removeMember = (id: string) => {
    setConfirmDialog({ isOpen: true, type: 'member', id })
  }

  const confirmRemoveMember = () => {
    setMembers(members.filter(member => member.id !== confirmDialog.id))
    setConfirmDialog({ isOpen: false, type: null, id: null })
  }

  function updateRoles(memberId: string, roles: MemberRole[]) {
    updateProfileRolesInTeam(teamId, memberId, roles.map(role => role.id)).then(() => {
        toast({
            title: "Rollen aktualisiert",
            description: "Die Rollen wurden erfolgreich aktualisiert.",
            variant: "success"
        })
    }).catch((error) => {
        toast({
            title: "Fehler beim Aktualisieren der Rollen",
            description: `Die Rollen konnten nicht aktualisiert werden: ${error.message}`,
            variant: "destructive"
        })
    })
  }

  const getRoleColor = (roleId: number) => {
    const role = roles.find(role => role.id === roleId)
    return role?.color || '#000000'
  }

  return (
      <Card>
        <CardHeader>
          <CardTitle>Mitglieder</CardTitle>
          <CardDescription>Verwalten Sie die Mitglieder und deren Rollen in diesem Team.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-5 h-5 text-gray-500"/>
            <Input
                type="text"
                placeholder="Suche nach Namen oder E-Mail"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
            />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Rollen</SelectItem>
                {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Rollen</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {member.roles.map(role => (
                            <Badge
                                key={role.id}
                                style={{backgroundColor: getRoleColor(role.id), color: '#ffffff'}}
                            >
                              {role.name}
                            </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
                        <DialogHeader>
                        </DialogHeader>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="mr-2" onClick={() => {
                            setEditRoles(member.roles)
                          }}>Rollen bearbeiten</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Rollen für {member.name}</DialogTitle>
                          <div className="flex flex-col gap-2">
                            {roles.map((role) => (
                                <div key={role.id} className="flex items-center space-x-2">
                                  <Checkbox
                                      id={`role-${member.id}-${role.id}`}
                                      checked={editRoles.map(role => role.id).includes(role.id)}
                                      onCheckedChange={(checked) => {//toggleRole(member.id, role)}
                                        if (checked) {
                                          setEditRoles([...editRoles, role])
                                        } else {
                                          setEditRoles(editRoles.filter(r => r.id !== role.id))
                                        }
                                      }}
                                  />
                                  <label
                                      htmlFor={`role-${member.id}-${role.id}`}
                                      className="flex items-center gap-2"
                                  >
                                    {role.name}
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{backgroundColor: role.color}}
                                    ></div>
                                  </label>
                                </div>
                            ))}
                          </div>
                          <Button onClick={() => {
                            updateRoles(member.id, editRoles)
                            setEditRoles([])
                            setIsEditRoleDialogOpen(false)
                          }}>Bestätigen</Button>
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" onClick={() => removeMember(member.id)}>Entfernen</Button>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <ConfirmationDialog
            isOpen={confirmDialog.isOpen}
            onClose={() => setConfirmDialog({ isOpen: false, type: null, id: null })}
            onConfirm={confirmRemoveMember}
            title={confirmDialog.type === 'member' ? 'Mitglied entfernen' : 'Rolle löschen'}
            description={confirmDialog.type === 'member'
                ? 'Sind Sie sicher, dass Sie dieses Mitglied entfernen möchten? Diese Aktion kann nicht rückgängig gemacht werden.'
                : 'Sind Sie sicher, dass Sie diese Rolle löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden und wird die Rolle von allen Mitgliedern entfernen.'}
            confirmLabel={confirmDialog.type === 'member' ? 'Mitglied entfernen' : 'Rolle löschen'}
        />
      </Card>
  )
}