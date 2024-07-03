export interface TextInputTaskProps {
    task: string
    description: string
}

export default function TextInputTask({ task, description }: Readonly<TextInputTaskProps>) {

    return <div>
        <h1>{ task }</h1>
        <p>{ description }</p>
        <input type="text" />
        <button>Submit</button>
    </div>
}