"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React, {useEffect, useState} from "react";
import {ConfirmationDialog} from "@/components/ConfirmationDialog";
import {Page, RoleWithAllowedPages} from "@/types/database.types";
import addRole from "@/actions/add-role";
import removeRole from "@/actions/remove-role";
import {toast} from "@/components/ui/use-toast";
import {createClient} from "@/utils/supabase/client";
import getRoles from "@/actions/get-roles";
import {Checkbox} from "@/components/ui/checkbox";
import {useTranslations} from "next-intl";

export interface RoleManagementProps {
    teamId: number
}

const availablePages: Page[] = ["Editor", "Tasks", "Monitoring", "Team"]

export default function RoleManagement({teamId}: Readonly<RoleManagementProps>) {

    const t = useTranslations("team.roles")

    const supabase = createClient()

    const [newRoleName, setNewRoleName] = useState<string>('')
    const [editingRole, setEditingRole] = useState<RoleWithAllowedPages | null>(null)
    const [newRoleColor, setNewRoleColor] = useState<string>('#000000')
    const [newRolePages, setNewRolePages] = useState<Page[]>([])

    const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState(false)
    const [isUpdateRoleDialogOpen, setIsUpdateRoleDialogOpen] = useState(false)
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean, id: number | null }>({
        isOpen: false,
        id: null
    })

    const [roles, setRoles] = useState<RoleWithAllowedPages[]>([])

    useEffect(() => {
        getRoles(teamId).then((roles: RoleWithAllowedPages[]) => {
            setRoles(roles || [])
            console.log(roles)
        }).catch((error) => {
            console.error("Error fetching roles", error)
        })
    }, [teamId]);

    useEffect(() => {
        const subscription = supabase
            .channel("add_or_update_role_for_role_management")
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "role"
            }, () => {
                console.log("Role updated")
                getRoles(teamId).then((roles: RoleWithAllowedPages[]) => {
                    setRoles(roles || [])
                })
            })
            .subscribe()

        return () => {
            subscription.unsubscribe().then()
        }
    }, [supabase, teamId])

    const updateRole = () => {
        if (!editingRole) return
        supabase
            .from('role')
            .update({
                name: editingRole.name,
                color: editingRole.color,
                pages: {
                    allowed_pages: editingRole.allowed_pages
                }
            })
            .eq('id', editingRole.id)
            .then(() => {
                toast({
                    title: t("toasts.roleUpdatedTitle"),
                    description: t("toasts.roleUpdatedDescription"),
                    variant: 'success'
                })
            })
        setEditingRole(null)
    }

    const deleteRole = (id: number) => {
        setConfirmDialog({isOpen: true, id})
    }

    const confirmDeleteRole = () => {
        if (confirmDialog.id === null) return
        removeRole(confirmDialog.id).then(() => {
            toast({
                title: t("toasts.roleDeletedTitle"),
                description: t("toasts.roleDeletedDescription"),
                variant: 'success'
            })
        }).catch(() => {
            toast({
                title: t("toasts.roleDeletedErrorTitle"),
                description: t("toasts.roleDeletedErrorDescription"),
                variant: 'destructive'
            })
        })
        setConfirmDialog({isOpen: false, id: null})
    }

    useEffect(() => {
        if (!isUpdateRoleDialogOpen) {
            setEditingRole(null)
        }
    }, [isUpdateRoleDialogOpen]);

    const PageCheckboxes = ({ value, onChange }: { value: Page[], onChange: (value: Page[]) => void }) => {
        return (
            <div className="grid grid-cols-2 gap-2">
                {availablePages.map((page) => (
                    <div key={page} className="flex items-center space-x-2">
                        <Checkbox
                            id={`page-${page}`}
                            checked={value.includes(page)}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    onChange([...value, page])
                                } else {
                                    onChange(value.filter((p) => p !== page))
                                }
                            }}
                        />
                        <label
                            htmlFor={`page-${page}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {page}
                        </label>
                    </div>
                ))}
            </div>
        )
    }

    return <Card>
        <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
            <Dialog open={isCreateRoleDialogOpen} onOpenChange={setIsCreateRoleDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="mb-2">{t("addRole")}</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("addRole")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-role-name">{t("roleName")}</Label>
                            <Input
                                id="new-role-name"
                                placeholder={t("roleName")}
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-role-color">{t("roleColor")}</Label>
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
                        <div className="space-y-2">
                            <Label>{t("allowedPages")}</Label>
                            <PageCheckboxes
                                value={newRolePages}
                                onChange={setNewRolePages}
                            />
                        </div>
                        <Button onClick={() => {
                            if (!newRoleName) {
                                toast({
                                    title: t("toasts.roleAddedErrorTitle"),
                                    description: t("toasts.roleAddedErrorNullDescription"),
                                    variant: 'destructive'
                                })
                                return
                            }
                            addRole(newRoleName, teamId, newRoleColor, newRolePages).then(newRoleId => {
                                toast({
                                    title: t("toasts.roleAddedTitle"),
                                    description: t("toasts.roleAddedDescription", {name: newRoleName}),
                                    variant: 'success'
                                })
                            }).catch(() => {
                                toast({
                                    title: t("toasts.roleAddedErrorTitle"),
                                    description: t("toasts.roleAddedErrorDescription", {name: newRoleName}),
                                    variant: 'destructive'
                                })
                            })
                            setNewRoleName('')
                            setNewRolePages([])
                            setIsCreateRoleDialogOpen(false)
                        }}>{t("addButton")}</Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("table.name")}</TableHead>
                        <TableHead>{t("table.color")}</TableHead>
                        <TableHead>{t("table.pages")}</TableHead>
                        <TableHead className="text-right">{t("table.actions")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map((role: RoleWithAllowedPages) => (
                        <TableRow key={role.id}>
                            <TableCell>{role.name}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{backgroundColor: role.color || '#000000'}}
                                    ></div>
                                    <span>{role.color}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                { role.allowed_pages.join(", ") || t("table.none") }
                            </TableCell>
                            <TableCell className="text-right">
                                <Dialog open={isUpdateRoleDialogOpen} onOpenChange={setIsUpdateRoleDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="mr-2" onClick={() => {
                                            setEditingRole(role)
                                        }}>{t("table.edit")}</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{t("edit.title")}</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-role-name">{t("edit.roleName")}</Label>
                                                <Input
                                                    id="edit-role-name"
                                                    placeholder={t("edit.roleName")}
                                                    value={editingRole !== null ? editingRole.name : role.name}
                                                    onChange={(e) => {
                                                        if (!editingRole) {
                                                            setEditingRole({...role, name: e.target.value})
                                                        } else {
                                                            setEditingRole({...editingRole, name: e.target.value})
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-role-color">{t("edit.roleColor")}</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        id="edit-role-color"
                                                        type="color"
                                                        value={(editingRole?.color || role.color) || '#000000'}
                                                        onChange={(e) => {
                                                            if (!editingRole) {
                                                                setEditingRole({...role, color: e.target.value})
                                                            } else {
                                                                setEditingRole({...editingRole, color: e.target.value})
                                                            }
                                                        }}
                                                        className="w-12 h-12 p-1"
                                                    />
                                                    <span>{editingRole?.color || role.color}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2 space-x-2">
                                                <Label>{t("edit.allowedPages")}</Label>
                                                <PageCheckboxes
                                                    value={editingRole?.allowed_pages || role.allowed_pages || []}
                                                    onChange={(newPages) => {
                                                        if (!editingRole) {
                                                            setEditingRole({...role, allowed_pages: newPages})
                                                        } else {
                                                            setEditingRole({...editingRole, allowed_pages: newPages})
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <Button onClick={() => {
                                                if (editingRole && editingRole.name === "") {
                                                    toast({
                                                        title: 'Fehler beim Hinzufügen der Rolle',
                                                        description: 'Der Name der Rolle darf nicht leer sein.',
                                                        variant: 'destructive'
                                                    })
                                                    return
                                                }
                                                setIsUpdateRoleDialogOpen(false)
                                                updateRole()
                                            }}>{t("edit.updateButton")}</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="destructive" onClick={() => deleteRole(role.id)}>{t("deleteButton")}</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>

        <ConfirmationDialog
            isOpen={confirmDialog.isOpen}
            onClose={() => setConfirmDialog({isOpen: false, id: null})}
            onConfirm={confirmDeleteRole}
            title={t("confirmDelete.title")}
            description={t("confirmDelete.description")}
            confirmLabel={t("confirmDelete.confirmButton")}
        />
    </Card>
}