import {LoadingSpinner} from "@/components/ui/loadingSpinner";

export default function Loading() {
    return <div className="w-full h-full flex flex-col justify-center items-center">
        <LoadingSpinner />
    </div>
}