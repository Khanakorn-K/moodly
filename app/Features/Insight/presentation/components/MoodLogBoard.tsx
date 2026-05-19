import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { MoreHorizontal, MessageSquare } from "lucide-react";
import { MoodType, standardMoods } from "@/app/shared/moodType";
import { moodColors } from "@/app/shared/moodColors";
import { convertDateToThaiDateFormat } from "@/cores/utils/thaiDate";
import type {
  MoodLogEntity,
  MoodLogPageEntity,
} from "../../domain/entities/MoodLogEntity";

interface MoodLogBoardProps {
  moodLogPage: MoodLogPageEntity | null;
  isListLoading: boolean;
  handleDragEnd: (event: DragEndEvent) => void;
}

const MoodLogBoard = ({
  moodLogPage,
  isListLoading,
  handleDragEnd,
}: MoodLogBoardProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto px-1 pb-10 scrollbar-hide sm:gap-6 sm:px-2">
        {standardMoods.map((moodOption) => {
          const moodLogs =
            moodLogPage?.items.filter(
              (moodLog) => String(moodLog.mood) === String(moodOption.value),
            ) || [];

          return (
            <Column
              key={moodOption.value}
              column={moodOption}
              moodLogs={moodLogs}
              isLoading={isListLoading}
            />
          );
        })}
      </div>
    </DndContext>
  );
};

interface ColumnProps {
  column: MoodType;
  moodLogs: MoodLogEntity[];
  isLoading: boolean;
}

const Column = ({ column, moodLogs, isLoading }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: String(column.value) });
  const themeColor =
    moodColors[column.value as keyof typeof moodColors] || "#FFFFFF";

  return (
    <div className="flex w-[min(18rem,calc(100vw-2rem))] shrink-0 flex-col sm:w-[320px]">
      <div className="mb-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{column.emoji}</span>
          <h3 className="text-sm font-black uppercase tracking-tight text-white">
            {column.label}
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 text-white/20 font-bold">
            {moodLogs.length}
          </span>
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 hover:bg-white/5 rounded-lg text-white/20 transition-colors">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`min-h-[420px] flex-1 space-y-4 rounded-[1.5rem] border-2 border-transparent p-3 transition-all duration-300 sm:min-h-[600px] sm:rounded-[2rem] ${
          isOver ? "bg-white/[0.04] border-white/5 shadow-2xl" : "bg-black/20"
        }`}
      >
        {moodLogs.map((moodLog) => (
          <DraggableCard
            key={moodLog.id}
            moodLog={moodLog}
            themeColor={themeColor}
            emoji={column.emoji}
          />
        ))}

        {!isLoading && moodLogs.length === 0 && (
          <div className="h-32 border border-dashed border-white/5 rounded-[1.5rem] flex items-center justify-center">
            <span className="text-[10px] text-white/10 font-black uppercase tracking-widest">
              Empty Space
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

interface DraggableCardProps {
  moodLog: MoodLogEntity;
  themeColor: string;
  emoji: string;
}

const DraggableCard = ({
  moodLog,
  themeColor,
  emoji,
}: DraggableCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: String(moodLog.id),
      data: { moodLog },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group relative overflow-hidden rounded-[1.5rem] border border-white/[0.05] bg-[#16161E] p-4 shadow-xl transition-all sm:p-5 ${
        isDragging
          ? "opacity-30 cursor-grabbing scale-95"
          : "hover:border-white/20 cursor-grab active:cursor-grabbing"
      }`}
    >
      <div
        className="absolute top-0 left-0 w-1 h-full opacity-40"
        style={{ backgroundColor: themeColor }}
      />

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs">{emoji}</span>
              <span className="text-[10px] text-white/20 font-black uppercase tracking-wider">
                {convertDateToThaiDateFormat(moodLog.createdAt)}
              </span>
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed line-clamp-3 italic">
              {moodLog.note || ""}
            </p>
          </div>
        </div>

        {moodLog.causes && moodLog.causes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {moodLog.causes.map((cause, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-lg text-[9px] font-bold bg-white/5 text-white/30 border border-white/5 uppercase tracking-tighter"
              >
                # {cause}
              </span>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-white/[0.03] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
              <MessageSquare size={10} className="text-white/20" />
            </div>
            <span className="text-[9px] text-white/20 font-bold">
              {convertDateToThaiDateFormat(moodLog.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodLogBoard;
