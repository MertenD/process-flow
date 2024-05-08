import React from 'react';
import Navigation from "@/components/headerbar/Navigation";
import TeamSwitcher from "@/components/TeamSwitcher";
import {UserNav} from "@/components/UserNav";
import {ThemeModeToggle} from "@/components/ui/ThemeModeToggle";

export default function HeaderBar() {
    return (
        <section className="navigationBar">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <TeamSwitcher/>
                    <Navigation className="mx-6"/>
                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav/>
                        <ThemeModeToggle />
                    </div>
                </div>
            </div>
        </section>
        )
}