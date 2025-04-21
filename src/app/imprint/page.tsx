import Link from "next/link"
import Footer from "@/components/landing/Footer";
import HomepageNavigation from "@/components/landing/HomepageNavigation";

export default function ImpressumPage() {
    return (
        <main className="min-h-screen bg-background py-12 md:py-16">
            <HomepageNavigation isFixed/>
            <div className="container mx-auto px-4 my-16">
                <div className="mx-auto max-w-3xl rounded-lg bg-muted p-6 shadow-lg backdrop-blur-sm md:p-8">
                    <h1 className="mb-6 text-3xl font-bold md:text-4xl text-primary">Impressum</h1>

                    <div className="space-y-6">
                        <h1>Impressum</h1>

                        <p>Merten Dieckmann<br/>
                            Memmingerstrasse 35<br/>
                            2110<br/>
                            89231 Neu-Ulm</p>

                        <h1>Kontakt</h1>
                        <p>Telefon: +49 177 1969628<br/>
                            E-Mail: merten.dieckmann@web.de</p>

                        <h1>Redaktionell verantwortlich</h1>
                        <p>Merten Dieckmann<br/>
                            Memmingerstrasse 35<br/>
                            Apt. 2.110<br/>
                            89231, Neu-Ulm</p>

                        <h1>EU-Streitschlichtung</h1>
                        <p>Die Europ&auml;ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
                            bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank"
                                       rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>.<br/> Unsere
                            E-Mail-Adresse finden Sie oben im Impressum.</p>

                        <h1>Verbraucher&shy;streit&shy;beilegung/Universal&shy;schlichtungs&shy;stelle</h1>
                        <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                            Verbraucherschlichtungsstelle teilzunehmen.</p>

                        <p>Quelle: <a href="https://www.e-recht24.de" target="_blank">https://www.e-recht24.de</a></p>
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            href="/"
                            className="inline-block rounded-md bg-primary px-6 py-2 text-white transition-all hover:bg-primary/80 hover:shadow-[0_0_10px_rgba(230,117,51,0.5)]"
                        >
                            Zurück zur Startseite
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}

