import type React from "react"
import * as LucideIcons from "lucide-react"

export type IconName = keyof typeof LucideIcons

// @ts-ignore
interface DynamicIconProps extends React.ComponentProps<IconName> {
    name: IconName | undefined
    className?: string
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className }) => {
    if (!name) {
        return null
    }

    const Icon = LucideIcons[name]

    if (!Icon) {
        console.warn(`Icon "${name}" not found in Lucide icons`)
        return null
    }

    // @ts-ignore
    return <Icon className={className} />
}

export default DynamicIcon

