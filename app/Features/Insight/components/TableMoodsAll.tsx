import React from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  MoreHorizontal,
  Plus,
  MessageSquare,
  Link as LinkIcon,
} from "lucide-react";
import { MoodType, standartMoods } from "@/app/share/moodType";
import { moodColors } from "@/app/share/moodColors";
import { convertDateToThaiDateFormat } from "@/cors/utils/thaiDate";
import { insightEntity, moodsResultEntity } from "../domain/entity/InsightEntity";

interface TableMoodsAllProps {
  insightList: insightEntity | null;
  isListLoading: boolean;
  handleDragEnd: (event: any) => void;
}

const TableMoodsAll = ({
  insightList,
  isListLoading,
  handleDragEnd,
}: TableMoodsAllProps) => {
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
      <div className="flex gap-6 h-full overflow-x-auto pb-10 scrollbar-hide px-2">
        {standartMoods.map((standartMoods) => {
          const filteredData =
            insightList?.data.filter(
              (insightList) =>
                String(insightList.mood) === String(standartMoods.value) ||
                insightList.mood === standartMoods.label,
            ) || [];

          return (
            <Column
              key={standartMoods.value}
              column={standartMoods}
              moodsList={filteredData}
              isLoading={isListLoading}
            />
          );
        })}
      </div>
    </DndContext>
  );
};

interface columnProps {
  column: MoodType;
  moodsList: moodsResultEntity[];
  isLoading: boolean;
}

const Column = ({ column, moodsList, isLoading }: columnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: String(column.value) });
  const themeColor =
    moodColors[column.value as keyof typeof moodColors] || "#white";

  return (
    <div className="flex flex-col w-[320px] shrink-0">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{column.emoji}</span>
          <h3 className="text-sm font-black text-white uppercase tracking-tight">
            {column.label}
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 text-white/20 font-bold">
            {moodsList.length}
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
        className={`flex-1 space-y-4 min-h-[600px] rounded-[2rem] transition-all duration-300 p-3 border-2 border-transparent ${
          isOver ? "bg-white/[0.04] border-white/5 shadow-2xl" : "bg-black/20"
        }`}
      >
        {moodsList.map((mood: moodsResultEntity) => (
          <DraggableCard
            key={mood.id}
            insightList={mood}
            themeColor={themeColor}
            emoji={column.emoji}
          />
        ))}

        {!isLoading && moodsList.length === 0 && (
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

interface draggableCardProps {
  insightList: moodsResultEntity;
  themeColor: string;
  emoji: string;
}

const DraggableCard = ({ insightList, themeColor, emoji }: draggableCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: String(insightList.id),
      data: { insightList },
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
      className={`bg-[#16161E] border border-white/[0.05] rounded-[1.5rem] p-5 shadow-xl transition-all group relative overflow-hidden ${
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
                {convertDateToThaiDateFormat(insightList.createdAt)}
              </span>
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed line-clamp-3 italic">
              {insightList.note || ""}
            </p>
          </div>
        </div>

        {insightList.causes && insightList.causes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {/* เปลี่ยนจาก (causes, index) เป็น (cause, index) */}
            {insightList.causes.map((cause, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-lg text-[9px] font-bold bg-white/5 text-white/30 border border-white/5 uppercase tracking-tighter"
              >
                {/* แสดงผลตัวแปร cause ที่เป็น string ได้เลย ไม่ต้อง .cause */}#{" "}
                {cause}
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
              {convertDateToThaiDateFormat(insightList.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableMoodsAll;
