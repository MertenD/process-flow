import React from "react";
import {getTranslations} from "next-intl/server";

export default async function TasksPage() {

    const t = await getTranslations("tasks")

    return <div className="w-full h-full flex flex-col justify-center items-center bg-background">
        {t("selectTask")}
    </div>
}
