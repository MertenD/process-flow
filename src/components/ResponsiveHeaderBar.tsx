"use client"

import React, { useState } from 'react'
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Menu, X } from 'lucide-react'
import Navigation from "@/components/headerbar/Navigation"
import TeamSwitcher from "@/components/headerbar/TeamSwitcher"
import { UserNav } from "@/components/headerbar/UserNav"
import HomeButton from "@/components/headerbar/HomeButton"
import MiniatureLevelCard from "@/components/stats/MiniatureLevelCard"
import { Page } from "@/model/database/database.types"
import { Button } from "@/components/ui/button"
import ResponsiveTeamSwitcher from "@/components/ResponsiveTeamSwitcher";
import ResponsiveNavigation from "@/components/ResponsiveNavigation";
import ResponsiveMiniaturLevelCard from "@/components/ResponsiveMiniaturLevelCard";

export interface HeaderBarProps {
  selectedTeamId: number
  userData: {
    user: {
      id: string
    }
  }
  teams: {
    profileId: string
    teamId: string
    team: {
      name: string
      createdBy: string
      colorSchemeFrom: string
      colorSchemeTo: string
    }
  }[]
  allowedPages: Page[]
}

export function ResponsiveHeaderBar({ selectedTeamId, userData, teams, allowedPages }: Readonly<HeaderBarProps>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = useTranslations("Header")

  const ownTeams = teams?.filter(team => team.team.createdBy === userData.user.id).map(team => ({
    label: team.team.name,
    value: team.teamId,
    colorSchema: { from: team.team.colorSchemeFrom, to: team.team.colorSchemeTo }
  })) ?? []

  const otherTeams = teams?.filter(team => team.team.createdBy !== userData.user.id).map(team => ({
    label: team.team.name,
    value: team.teamId,
    colorSchema: { from: team.team.colorSchemeFrom, to: team.team.colorSchemeTo }
  })) ?? []

  return (
    <header className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <HomeButton />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <ResponsiveTeamSwitcher
                ownTeams={ownTeams}
                otherTeams={otherTeams}
                selectedTeamId={selectedTeamId}
              />
              <ResponsiveNavigation
                allowedPages={allowedPages}
                selectedTeamId={selectedTeamId}
                className="hidden md:flex"
              />
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <ResponsiveMiniaturLevelCard userId={userData.user.id} teamId={selectedTeamId} />
            {/*<UserNav />*/}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">{t("openMainMenu")}</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <ResponsiveTeamSwitcher
              ownTeams={ownTeams}
              otherTeams={otherTeams}
              selectedTeamId={selectedTeamId}
              className="w-full"
            />
            <ResponsiveNavigation
              allowedPages={allowedPages}
              selectedTeamId={selectedTeamId}
              className="flex flex-col space-y-2"
            />
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4 space-x-4">
              <ResponsiveMiniaturLevelCard userId={userData.user.id} teamId={selectedTeamId} />
              <div className="flex-shrink-0">
                {/*<UserNav />*/}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}