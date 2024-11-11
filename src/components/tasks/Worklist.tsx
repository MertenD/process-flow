'use client'

import React, {useEffect, useState} from 'react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Calendar} from "@/components/ui/calendar"
import {CalendarIcon, UserIcon, SearchIcon, FilterIcon, Award, Search, ArrowUpDown} from 'lucide-react'
import {format} from 'date-fns'
import {useParams, usePathname, useRouter} from "next/navigation";
import {createClient} from "@/utils/supabase/client";
import {FlowElementInstanceState, ManualTaskWithOutputs, Role} from "@/model/database/database.types";
import getRoles from "@/actions/get-roles";
import getTasks from "@/actions/get-tasks";
import {toast} from "@/components/ui/use-toast";
import {useTranslations} from "next-intl";
import {GamificationType} from "@/model/GamificationType";
import {GamificationOptions} from "@/model/GamificationOptions";
import {PointsType} from "@/model/PointsType";

interface TaskData {
    gamificationType?: GamificationType;
    gamificationOptions?: GamificationOptions
}

const statuses = ["Todo", "In Progress", "Completed"]

export interface WorklistProps {
    teamId: number
    userId: string
}

export default function Worklist({ teamId, userId }: WorklistProps) {

    const t = useTranslations("tasks")

    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<ManualTaskWithOutputs['status'] | null>(null)
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: undefined,
        to: undefined,
    })
    const [sortConfig, setSortConfig] = useState<{ key: keyof ManualTaskWithOutputs | "none", direction: 'asc' | 'desc' } | null>(null)

    const router = useRouter()
    const params = useParams<{ taskId: string }>()
    const pathName = usePathname()
    const supabase = createClient()
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(params.taskId)
    const [tasks, setTasks] = useState<ManualTaskWithOutputs[]>([])
    const [roles, setRoles] = useState<Role[]>([])

    useEffect(() => {
        getRoles(teamId).then(setRoles)

        const subscription = supabase
            .channel("flow_element_instance_update_role")
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "role"
            }, () => {
                getRoles(teamId).then(setRoles)
            })
            .subscribe()

        return () => {
            subscription.unsubscribe().then()
        }
    }, [supabase, teamId]);

    useEffect(() => {
        getTasks(teamId, userId).then(setTasks).catch((error) => {
            console.error("Error fetching tasks", error)
        })
    }, [teamId, userId]);

    useEffect(() => {
        setSelectedTaskId(params.taskId)
    }, [params]);

    useEffect(() => {
        const updateSubscription = supabase
            .channel("flow_element_instance_update_task")
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "flow_element_instance" // TODO hier eine bessere Tabelle wählen und ggf. die Bedingung anpassen
            }, (payload) => {

                getTasks(teamId, userId).then(setTasks).catch((error) => {
                    console.error("Error fetching tasks", error)
                })

                if (payload.eventType === "UPDATE" && pathName === `/${teamId}/tasks/${payload.new.id}` && payload.new.status === "Completed") {
                    setSelectedTaskId(null)
                    toast({
                        variant: "success",
                        title: t("toasts.taskCompletedTitle"),
                        description: t("toasts.taskCompletedDescription")
                    })
                }
            })
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "profile_role_team"
            }, () => {
                getTasks(teamId, userId).then(setTasks).catch((error) => {
                    console.error("Error fetching tasks", error)
                })
            })
            .subscribe()

        return () => {
            updateSubscription.unsubscribe().then()
        }
    }, [pathName, supabase, t, teamId, userId]);

    const getStatusColor = (status: ManualTaskWithOutputs['status']) => {
        switch (status) {
            case 'Todo':
                return 'bg-blue-500'
            case 'In Progress':
                return 'bg-yellow-500'
            case 'Completed':
                return 'bg-green-500'
            default:
                return 'bg-gray-500'
        }
    }

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = !roleFilter || task.assigned_role === roleFilter
        const matchesStatus = !statusFilter || task.status === statusFilter
        const matchesDate = dateRange?.from && dateRange?.to && task.created_at
            ? new Date(task.created_at) >= dateRange.from && new Date(task.created_at) <= dateRange.to
            : true
        return matchesSearch && matchesRole && matchesStatus && matchesDate
    })

    const sortedTasks = React.useMemo(() => {
        let sortableTasks = [...filteredTasks]
        if (sortConfig !== null) {
            sortableTasks.sort((a, b) => {
                if (sortConfig.key === 'none') return 0
                const aValue = a[sortConfig.key]
                const bValue = b[sortConfig.key]
                if (aValue && bValue && aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1
                }
                if (aValue && bValue && aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1
                }
                return 0
            })
        }
        return sortableTasks
    }, [filteredTasks, sortConfig])

    const requestSort = (key: keyof ManualTaskWithOutputs) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const handleTaskSelect = (task: ManualTaskWithOutputs) => {
        router.push(`/${teamId}/tasks/${task.id}`)
    }

    const renderGamificationBadge = (task: ManualTaskWithOutputs) => {
        const {gamificationType, gamificationOptions} = task.data as TaskData
        if (gamificationType === GamificationType.NONE) return null
        if (gamificationType === GamificationType.POINTS) {
            if (gamificationOptions?.pointType === PointsType.EXPERIENCE) {
                return <Badge className="bg-green-600">{gamificationOptions.pointsForSuccess} XP</Badge>
            } else {
                return <Badge className="bg-yellow-500">{gamificationOptions?.pointsForSuccess} Coins</Badge>
            }
        }
        return (
            <Badge variant="secondary" className="flex items-center">
                <Award className="mr-1 h-4 w-4"/>
                {gamificationOptions?.badgeType}
            </Badge>
        )
    }

    return (
        <div className="flex flex-col h-full p-4">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 flex flex-row items-center space-x-2">
                    <Search className="w-5 h-5 text-gray-500"/>
                    <Input
                        type="text"
                        placeholder="Suche nach Aufgaben..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto">
                            <FilterIcon className="mr-2 h-4 w-4"/>
                            Filter
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Rolle</h4>
                                <Select value={roleFilter || 'all'}
                                        onValueChange={(value) => setRoleFilter(value === 'all' ? null : value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Wähle eine Rolle"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Alle Rollen</SelectItem>
                                        {roles.map((role: Role) => (
                                            <SelectItem key={`select-role-${role.id}`} value={role.id.toString()}>{role.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Status</h4>
                                <Select value={statusFilter || 'all'}
                                        onValueChange={(value) => setStatusFilter(value === 'all' ? null : value as ManualTaskWithOutputs['status'])}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Wähle einen Status"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Alle Status</SelectItem>
                                        {statuses.map((status) => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Datumsbereich</h4>
                                <div className="flex flex-col space-y-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline"
                                                    className="w-full justify-start text-left font-normal">
                                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                                {dateRange?.from ? (
                                                    dateRange.to ? (
                                                        <>
                                                            {format(dateRange.from, "dd.MM.yyyy")} - {format(dateRange.to, "dd.MM.yyyy")}
                                                        </>
                                                    ) : (
                                                        format(dateRange.from, "dd.MM.yyyy")
                                                    )
                                                ) : (
                                                    <span>Wähle einen Datumsbereich</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                initialFocus
                                                mode="range"
                                                defaultMonth={dateRange?.from}
                                                selected={dateRange}
                                                // @ts-ignore
                                                onSelect={setDateRange}
                                                numberOfMonths={2}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto">
                            <ArrowUpDown className="mr-2 h-4 w-4"/>
                            Sortieren
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Sortieren nach</h4>
                                <Select
                                    value={sortConfig?.key || 'none'}
                                    // @ts-ignore
                                    onValueChange={(value) => setSortConfig(prev => {
                                        return { ...prev, key: value as keyof ManualTaskWithOutputs | null }
                                    })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Wähle ein Attribut"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Keine Sortierung</SelectItem>
                                        <SelectItem value="name">Name</SelectItem>
                                        <SelectItem value="status">Status</SelectItem>
                                        <SelectItem value="created_at">Erstellt am</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Sortierrichtung</h4>
                                <Select
                                    value={sortConfig?.direction}
                                    // @ts-ignore
                                    onValueChange={(value) => setSortConfig(prev => {
                                        return { ...prev, direction: value as 'asc' | 'desc' }
                                    })}
                                    disabled={!sortConfig?.key || sortConfig?.key === 'none'}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Wähle eine Richtung"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="asc">Aufsteigend</SelectItem>
                                        <SelectItem value="desc">Absteigend</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-1 overflow-x-auto overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Rolle</TableHead>
                            <TableHead>Erstellt am</TableHead>
                            <TableHead>Gamification</TableHead>
                            <TableHead>Aktion</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedTasks.map((task) => {
                            const role = roles.find(role => role.id.toString() === task.assigned_role)
                            const isSelected = selectedTaskId?.toString() === task.id.toString()
                            return <TableRow key={task.id} className={isSelected ? "bg-accent" : ""}>
                                <TableCell className="font-medium">{task.name}</TableCell>
                                <TableCell>
                                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" style={{backgroundColor: role?.color, color: '#ffffff'}}>
                                        {role?.name}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                        {task.created_at && format(new Date(task.created_at), "dd.MM.yyyy HH:mm")}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {renderGamificationBadge(task)}
                                </TableCell>
                                <TableCell>
                                    { task.status === "Todo" &&
                                        <Button onClick={() => handleTaskSelect(task)} disabled={isSelected} variant="outline">Bearbeiten</Button>
                                    }
                                </TableCell>
                            </TableRow>
                        }) }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}