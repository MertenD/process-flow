import React from "react";
import {getTranslations} from "next-intl/server";

export default async function TasksPage({ params }: Readonly<{ params: { teamId: string } }>) {

    const t = await getTranslations("tasks")

    return <div className="w-full h-full flex flex-col justify-center items-center bg-accent">
        {t("selectTask")}
    </div>
}