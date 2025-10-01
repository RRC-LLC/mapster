import { Spinner } from "./Spinner";

export default function MapLoading({}) {
    return (
        <div className="w-full h-[100dvh] flex items-center justify-center relative">
            <Spinner size={48} color="white"/>
        </div>
    );
}