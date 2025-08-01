import { useDroppable } from "@dnd-kit/core";

type DropTaskProps = {
    status: string;
};

export default function DropTask({ status }: DropTaskProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: status,
    });

    const style = {
        opacity: isOver ? 0.4 : undefined
    }

    return (
        <div
            className="text-xs font-semibold uppercase p-2 border border-dashed border-slate-600 mt-5 grid place-content-center text-slate-600"
            ref={setNodeRef}
            style={style}
        >Soltar tarea aquí</div>
    );
}
