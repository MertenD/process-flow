"use client"

import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import React from "react";

export interface SingleChoiceTaskProps {
    task: string
    description: string
    choices: string[]
    variableName: string
    responsePath: string
    flowElementInstanceId: string
}

const FormSchema = z.object({
    choice: z.string().min(1, "Please select a choice")
});

export default function SingleChoiceTask({ task, description, choices, variableName, responsePath, flowElementInstanceId }: Readonly<SingleChoiceTaskProps>) {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        fetch(responsePath, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                flowElementInstanceId,
                data: {
                    [variableName]: data.choice
                }
            })
        }).then(() => {
            console.log("Submitted")
        }).catch((error) => {
            // TODO Nicht sicher den error einfach so auszugeben
            console.error("Error submitting", error)
        })
    }

    return <div className="h-full w-full flex flex-col justify-center items-center">
        <Card>
            <CardHeader>
                <CardTitle>{ task }</CardTitle>
                <CardDescription>{ description }</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                    <FormField
                        control={form.control}
                        name="choice"
                        render={({ field, fieldState }) => (
                            <FormItem className="space-y-3">
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        { choices.map((choice: string, index: number) => {
                                            const id = `${choice}-${index}`

                                            return <FormItem key={`${id}-key`} className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value={choice} id={id} />
                                                </FormControl>
                                                <FormLabel htmlFor={id}>{ choice }</FormLabel>
                                            </FormItem>
                                        })}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage>{fieldState.error?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
}