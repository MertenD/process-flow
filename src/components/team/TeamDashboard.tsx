'use client'

import React, { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { ConfirmationDialog } from '../ConfirmationDialog'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export type Role = {
  id: number
  name: string
  color: string
}

export type Member = {
  id: number
  name: string
  email: string
  roles: string[]
}

type ConfirmDialogState = {
  isOpen: boolean
  type: string | null
  id: number | null
}

const initialRoles: Role[] = [
  { id: 1, name: 'Admin', color: '#FF5733' },
  { id: 2, name: 'User', color: '#33FF57' },
  { id: 3, name: 'Manager', color: '#3357FF' },
]

const initialMembers: Member[] = [
  { id: 1, name: 'Max Mustermann', email: 'max@example.com', roles: ['Admin', 'User'] },
  { id: 2, name: 'Erika Musterfrau', email: 'erika@example.com', roles: ['User'] },
]

export function TeamDashboard() {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [newMemberEmail, setNewMemberEmail] = useState<string>('')
  const [newRoleName, setNewRoleName] = useState<string>('')
  const [newRoleColor, setNewRoleColor] = useState<string>('#000000')
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ isOpen: false, type: null, id: null })

  const filteredMembers = useMemo(() => {
    return members.filter(member =>
        (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (roleFilter === 'all' || member.roles.includes(roleFilter))
    )
  }, [members, searchTerm, roleFilter])

  const inviteMember = () => {
    const newMember = { id: members.length + 1, name: 'Neues Mitglied', email: newMemberEmail, roles: [] }
    setMembers([...members, newMember])
    setNewMemberEmail('')
  }

  const removeMember = (id: number) => {
    setConfirmDialog({ isOpen: true, type: 'member', id })
  }

  const confirmRemoveMember = () => {
    setMembers(members.filter(member => member.id !== confirmDialog.id))
    setConfirmDialog({ isOpen: false, type: null, id: null })
  }

  const addRole = () => {
    const newRole = { id: roles.length + 1, name: newRoleName, color: newRoleColor }
    setRoles([...roles, newRole])
    setNewRoleName('')
    setNewRoleColor('#000000')
  }

  const updateRole = () => {
    setRoles(roles.map(role => editingRole && role.id === editingRole.id ? editingRole : role))
    setEditingRole(null)
  }

  const deleteRole = (id: number) => {
    setConfirmDialog({ isOpen: true, type: 'role', id })
  }

  const confirmDeleteRole = () => {
    setRoles(roles.filter(role => role.id !== confirmDialog.id))
    setMembers(members.map(member => ({
      ...member,
      roles: member.roles.filter(role => role !== roles.find(role => role.id === confirmDialog.id)?.name)
    })))
    setConfirmDialog({ isOpen: false, type: null, id: null })
  }

  const toggleRole = (memberId: number, roleName: string) => {
    setMembers(members.map(member => 
      member.id === memberId
        ? member.roles.includes(roleName)
          ? { ...member, roles: member.roles.filter(r => r !== roleName) }
          : { ...member, roles: [...member.roles, roleName] }
        : member
    ))
  }

  const getRoleColor = (roleName: string) => {
    const role = roles.find(r => r.name === roleName)
    return role ? role.color : '#000000'
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Mitglieder einladen */}
      <Card>
        <CardHeader>
          <CardTitle>Mitglied einladen</CardTitle>
          <CardDescription>Laden sie Mitglieder über die Email Adresse zu diesem Team hinzu.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
                type="email"
                placeholder="E-Mail Adresse"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
            />
            <Button onClick={inviteMember}>Einladen</Button>
          </div>
        </CardContent>
      </Card>

      {/* Mitgliedertabelle mit Suchfunktion */}
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
                    <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
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
                                key={role}
                                style={{backgroundColor: getRoleColor(role), color: '#ffffff'}}
                            >
                              {role}
                            </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="mr-2">Rollen bearbeiten</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Rollen für {member.name}</DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col gap-2">
                            {roles.map((role) => (
                                <div key={role.id} className="flex items-center space-x-2">
                                  <Checkbox
                                      id={`role-${member.id}-${role.id}`}
                                      checked={member.roles.includes(role.name)}
                                      onCheckedChange={() => toggleRole(member.id, role.name)}
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
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" onClick={() => removeMember(member.id)}>Entfernen</Button>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Rollenverwaltung */}
      <Card>
        <CardHeader>
          <CardTitle>Rollen</CardTitle>
          <CardDescription>Verwalten Sie welche Rollen es in diesem Team gibt.</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-2">Neue Rolle hinzufügen</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neue Rolle hinzufügen</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-role-name">Rollenname</Label>
                  <Input
                      id="new-role-name"
                      placeholder="Rollenname"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-role-color">Rollenfarbe</Label>
                  <div className="flex items-center gap-2">
                    <Input
                        id="new-role-color"
                        type="color"
                        value={newRoleColor}
                        onChange={(e) => setNewRoleColor(e.target.value)}
                        className="w-12 h-12 p-1"
                    />
                    <span>{newRoleColor}</span>
                  </div>
                </div>
                <Button onClick={addRole}>Hinzufügen</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Farbe</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                            className="w-6 h-6 rounded-full"
                            style={{backgroundColor: role.color}}
                        ></div>
                        <span>{role.color}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="mr-2">Bearbeiten</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Rolle bearbeiten</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-role-name">Rollenname</Label>
                              <Input
                                  id="edit-role-name"
                                  placeholder="Rollenname"
                                  value={editingRole?.name || role.name}
                                  onChange={(e) => {
                                    editingRole && setEditingRole({ ...editingRole, name: e.target.value })}
                                  }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-role-color">Rollenfarbe</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                    id="edit-role-color"
                                    type="color"
                                    value={editingRole?.color || role.color}
                                    onChange={(e) => {
                                      editingRole && setEditingRole({ ...editingRole, color: e.target.value })}
                                    }
                                    className="w-12 h-12 p-1"
                                />
                                <span>{editingRole?.color || role.color}</span>
                              </div>
                            </div>
                            <Button onClick={updateRole}>Aktualisieren</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" onClick={() => deleteRole(role.id)}>Löschen</Button>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, type: null, id: null })}
        onConfirm={confirmDialog.type === 'member' ? confirmRemoveMember : confirmDeleteRole}
        title={confirmDialog.type === 'member' ? 'Mitglied entfernen' : 'Rolle löschen'}
        description={confirmDialog.type === 'member' 
          ? 'Sind Sie sicher, dass Sie dieses Mitglied entfernen möchten? Diese Aktion kann nicht rückgängig gemacht werden.'
          : 'Sind Sie sicher, dass Sie diese Rolle löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden und wird die Rolle von allen Mitgliedern entfernen.'}
        confirmLabel={confirmDialog.type === 'member' ? 'Mitglied entfernen' : 'Rolle löschen'}
      />
    </div>
  )
}