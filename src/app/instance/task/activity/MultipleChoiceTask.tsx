"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import React from "react";
import {Checkbox} from "@/components/ui/checkbox";

export interface SingleChoiceTaskProps {
    task: string
    description: string
    choices: string[]
    responsePath: string
    flowElementInstanceId: string
    userInputVariableName: string
    userId: string
}

const FormSchema = z.object({
    choices: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
})

export default function MultipleChoiceTask({ task, description, choices, responsePath, flowElementInstanceId, userInputVariableName, userId }: Readonly<SingleChoiceTaskProps>) {

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
                    [userInputVariableName]: data.choices
                },
                completedBy: userId
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="choices"
                            render={() => (
                                <FormItem>
                                    {choices.map((choice) => (
                                        <FormField
                                            key={choice}
                                            control={form.control}
                                            name="choices"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={choice}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(choice)}
                                                                onCheckedChange={(checked) => {
                                                                    console.log("HIER", checked)
                                                                    return checked
                                                                        ? field.onChange([...field.value || [], choice])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== choice
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            {choice}
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                    <FormMessage />
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