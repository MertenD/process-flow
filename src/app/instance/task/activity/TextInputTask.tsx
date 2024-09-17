"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";

export interface TextInputTaskProps {
    task: string
    description: string
    inputRegex: string
    responsePath: string
    flowElementInstanceId: string,
    userInputVariableName: string
}

export default function TextInputTask({ task, description, inputRegex, responsePath, flowElementInstanceId, userInputVariableName }: Readonly<TextInputTaskProps>) {

    // TODO Regex ist scheinbar undefiniert. Es soll übergeben werden
    const FormSchema = z.object({
        textInput: z.string().refine((value) => {
            return new RegExp(inputRegex).test(value)
        }, `Please enter text that matches the required pattern (${inputRegex}).`)
    });

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
                    [userInputVariableName]: data.textInput
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
        <Card className="w-2/3">
            <CardHeader>
                <CardTitle>{task}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="textInput"
                            render={({field, fieldState}) => (
                                <FormItem className="space-y-3">
                                    <FormControl>
                                        <Textarea
                                            onChange={field.onChange}
                                            defaultValue={field.value}
                                            cols={3}
                                        />
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