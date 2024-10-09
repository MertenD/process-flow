import React from "react";
import {getTranslations} from "next-intl/server";

export default async function EditorPage({ params }: Readonly<{ params: { teamId: string } }>) {

    // TODO Wenn ein neuer Prozess erstellt wurde, auf die monitoring seite gewechselt wird und dann wieder auf die editor seite, dann wird der Prozess in der Prozessliste nicht angezeigt

    const t = await getTranslations("editor")

    return <div className="w-full h-full flex flex-col justify-center items-center bg-accent">
        {t("selectProcessModel")}
    </div>
}