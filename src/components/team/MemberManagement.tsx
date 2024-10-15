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
import {Role} from "@/model/database/database.types";
import {createClient} from "@/utils/supabase/client";
import getMembers from "@/actions/get-members";
import {Checkbox} from "@/components/ui/checkbox";
import updateProfileRolesInTeam from "@/actions/update-profile-roles-in-team";
import {toast} from "@/components/ui/use-toast";
import removeProfileFromTeam from "@/actions/remove-profile-from-team";
import {useTranslations} from "next-intl";

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

export function MemberManagement({teamId}: MemberManagementProps) {

    const t = useTranslations("team.members")

    const supabase = createClient()

    const [members, setMembers] = useState<Member[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [roleFilter, setRoleFilter] = useState<string>('all')

    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({isOpen: false, type: null, id: null})
    const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState<boolean>(false)

    const [roles, setRoles] = useState<Role[]>([])

    const [editRolesMemberId, setEditRolesMemberId] = useState<string>("")
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
                table: "role"
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
                table: "profile_team"
            }, () => {
                getMembers(teamId).then((members: Member[]) =>
                    setMembers(members || [])
                )
            })
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "profile_role_team"
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
        if (roleFilter === 'none') {
            return members.filter(member => member.roles.length === 0)
        }
        return members.filter(member =>
            (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (roleFilter === 'all' || member.roles.map(role => role.id.toString()).includes(roleFilter))
        )
    }, [members, searchTerm, roleFilter])

    const removeMember = (id: string) => {
        setConfirmDialog({isOpen: true, type: 'member', id})
    }

    const confirmRemoveMember = () => {
        if (!confirmDialog.id) {
            toast({
                title: t("toasts.memberRemovedErrorTitle"),
                description: t("toasts.memberRemovedErrorDescription"),
                variant: "destructive"
            })
            setConfirmDialog({isOpen: false, type: null, id: null})
            return
        }
        removeProfileFromTeam(teamId, confirmDialog.id).then(() => {
            toast({
                title: t("toasts.memberRemovedTitle"),
                description: t("toasts.memberRemovedDescription"),
                variant: "success"
            })
        }).catch((error) => {
            toast({
                title: t("toasts.memberRemovedErrorTitle"),
                description: t("toasts.memberRemovedErrorDescription"),
                variant: "destructive"
            })
        })
        setConfirmDialog({isOpen: false, type: null, id: null})
    }

    function updateRoles(memberId: string, roles: MemberRole[]) {
        updateProfileRolesInTeam(teamId, memberId, roles.map(role => role.id)).then(() => {
            toast({
                title: t("toasts.rolesUpdatedTitle"),
                description: t("toasts.rolesUpdatedDescription"),
                variant: "success"
            })
        }).catch((error) => {
            toast({
                title: t("toasts.rolesUpdatedErrorTitle"),
                description: t("toasts.rolesUpdatedErrorDescription"),
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
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                    <Search className="w-5 h-5 text-gray-500"/>
                    <Input
                        type="text"
                        placeholder={t("searchPlaceholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow"
                    />
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={t("filterByRole")}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t("allRoles")}</SelectItem>
                            <SelectItem value="none">{t("noRole")}</SelectItem>
                            {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t("table.name")}</TableHead>
                            <TableHead>{t("table.email")}</TableHead>
                            <TableHead>{t("table.role")}</TableHead>
                            <TableHead className="text-right">{t("table.actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMembers.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {member.roles.map(memberRole => (
                                            <Badge
                                                key={memberRole.id}
                                                style={{backgroundColor: getRoleColor(memberRole.id), color: '#ffffff'}}
                                            >
                                                {memberRole.name}
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
                                                setEditRolesMemberId(member.id)
                                                setEditRoles(member.roles)
                                            }}>{t("table.editRoles")}</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>{t("editRoles.title", { name: member.name })}</DialogTitle>
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
                                                updateRoles(editRolesMemberId, editRoles)
                                                setEditRoles([])
                                                setEditRolesMemberId("")
                                                setIsEditRoleDialogOpen(false)
                                            }}>{t("editRoles.updateButton")}</Button>
                                        </DialogContent>
                                    </Dialog>
                                    {!member.roles.map(role => role.name).includes("owner") &&
                                        <Button variant="destructive" onClick={() => removeMember(member.id)}>
                                            {t("removeMember")}
                                        </Button>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            <ConfirmationDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({isOpen: false, type: null, id: null})}
                onConfirm={confirmRemoveMember}
                title={t("confirmRemoveMember.title")}
                description={t("confirmRemoveMember.description")}
                confirmLabel={t("confirmRemoveMember.confirmButton")}
            />
        </Card>
    )
}