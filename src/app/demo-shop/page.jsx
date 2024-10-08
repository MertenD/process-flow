"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

const products = [
    { id: 1, name: "Kopfhörer", price: 99.99, image: "https://media.cdn.kaufland.de/product-images/1024x1024/43220500f9a5b3852a3e198655e2efb8.jpg" },
    { id: 2, name: "Maus", price: 29.99, image: "https://cdn.bueromarkt-ag.de/product/24511c8e41b0c3359429bf2cd8aafe1c3599a795/maus_trust_ozaa_plus_kabellos_24820.jpg?1716350595" },
    { id: 3, name: "Bildschirm", price: 199.99, image: "https://cdn.eizo.de/fileadmin/_processed_/1/b/csm_EV2360-BK_stage_7cb94d8d85.jpg" }
]

export default function Storefront() {
    const [quantities, setQuantities] = useState({ 1: 0, 2: 0, 3: 0 })
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleQuantityChange = (productId, quantity) => {
        setQuantities({ ...quantities, [productId]: parseInt(quantity) })
    }

    const calculateTotal = () => {
        return products.reduce((total, product) => total + product.price * quantities[product.id], 0).toFixed(2)
    }

    const formatProductList = () => {
        const textList = []
        const arrayList = []

        products.forEach(product => {
            const quantity = quantities[product.id]
            if (quantity > 0) {
                const item = `${quantity}x ${product.name}`
                textList.push(item)
                arrayList.push(item)
            }
        })

        return {
            produkteText: textList.join(", "),
            produkteListe: arrayList
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const { produkteText, produkteListe } = formatProductList()

        const payload = {
            processModelId: "3",
            inputs: {
                produkteText,
                produkteListe,
                kaeufername: name,
                adresse: address
            }
        }

        try {
            const response = await fetch(`${window.location.protocol}//${window.location.host}/api/instance/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok')
            }
            
            toast({
                variant: "success",
                title: "Bestellung erfolgreich",
                description: `Ihre Bestellung wurde aufgegeben. Sie erhalten in Kürze eine Versandbestätigung.`,
            })
        } catch (error) {
            console.error('Fehler:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Unsere Produkte</h1>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                    <Card key={product.id}>
                        <CardHeader>
                            <CardTitle>{product.name}</CardTitle>
                            <CardDescription>{product.price.toFixed(2)} €</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <img src={product.image} alt={product.name} className="h-32 object-cover mb-4" />
                            <div className="flex items-center space-x-2">
                                <Label htmlFor={`quantity-${product.id}`}>Menge:</Label>
                                <Select
                                    value={quantities[product.id].toString()}
                                    onValueChange={(value) => handleQuantityChange(product.id, value)}
                                >
                                    <SelectTrigger id={`quantity-${product.id}`}>
                                        <SelectValue placeholder="Wählen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[0, 1, 2, 3, 4, 5].map((num) => (
                                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Ihre Daten</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Adresse</Label>
                            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Bestellübersicht</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            {products.map((product) => (
                                quantities[product.id] > 0 && (
                                    <li key={product.id} className="flex justify-between">
                                        <span>{product.name} x{quantities[product.id]}</span>
                                        <span>{(product.price * quantities[product.id]).toFixed(2)} €</span>
                                    </li>
                                )
                            ))}
                        </ul>
                        <div className="mt-4 text-xl font-bold">Gesamtsumme: {calculateTotal()} €</div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Wird bearbeitet...' : 'Jetzt kaufen'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
            <Toaster />
        </div>
    )
}