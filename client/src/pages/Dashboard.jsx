import React, { useMemo, useState } from "react";

// ----------------- DND-Kit Imports -----------------
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ----------------- Component Imports -----------------
import Header from "../components/Header";
import LineAreaSection from "../components/sections/LineAreaSection";
import PieSection from "../components/sections/PieSection";
import RadarPolarSection from "../components/sections/RadarPolarSection";
import MapCard from "../components/sections/MapCard";
import SourcesCredibility from "../components/sections/SourcesCredibility";

// ----------------- Color Palettes -----------------
const darkColors = {
  bg: "rgb(10,12,20)",
  card: "rgb(18, 32, 58)",
  border: "rgb(30, 48, 80)",
  text: "rgb(200, 220, 255)",
  subtext: "rgb(120, 140, 170)",
  accentBlue: "rgb(6, 165, 225)",
  midBlue: "rgb(50, 110, 220)",
  darkBlue: "rgb(10, 40, 120)",
  accentGreen: "rgb(0, 255, 135)",
  midGreen: "rgb(50, 200, 100)",
  darkGreen: "rgb(0, 150, 70)",
};
const darkAccents = {
  gradientBlueGreen:
    "linear-gradient(to right, rgb(6, 165, 225), rgb(0, 255, 135))",
  gradientBlue: "linear-gradient(to top, rgb(50, 110, 220), rgb(6, 165, 225))",
  gradientGreen: "linear-gradient(to top, rgb(50, 200, 100), rgb(0, 255, 135))",
  line: "rgb(6, 165, 225)",
  barPrimary: "rgb(0, 255, 135)",
  barSecondary: "rgb(50, 110, 220)",
  mapPin: "rgb(0, 255, 135)",
  highlight: "rgb(6, 165, 225)",
  palette: [
    darkColors.accentBlue,
    darkColors.accentGreen,
    "rgb(124, 58, 237)",
    darkColors.midBlue,
    darkColors.midGreen,
    "rgb(249, 115, 22)",
  ],
};
const lightColors = {
  bg: "rgb(248, 250, 252)",
  card: "rgba(255, 255, 255, 0.9)",
  text: "rgb(15, 23, 42)",
  subtext: "rgba(15, 23, 42, 0.66)",
  border: "rgba(15, 23, 42, 0.06)",
  accent: "rgb(0, 110, 255)",
  midBlue: "rgb(20, 90, 200)",
  darkBlue: "rgb(8, 30, 110)",
};
const lightAccents = {
  gradientBlueGreen: `linear-gradient(to right, ${lightColors.accent}, #10b981)`,
  gradientBlue: `linear-gradient(to top, ${lightColors.midBlue}, ${lightColors.accent})`,
  gradientGreen: "linear-gradient(to top, #34d399, #10b981)",
  line: lightColors.accent,
  barPrimary: "#10b981",
  barSecondary: lightColors.midBlue,
  mapPin: "#10b981",
  highlight: lightColors.accent,
  palette: ["#0ea5e9", "#10b981", "#7c3aed", "#3b82f6", "#f59e0b", "#ef4444"],
};

// This wrapper now passes dragListeners down to its child
function SortableWrapper({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 0,
    position: "relative",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {React.cloneElement(children, { isDragging, dragListeners: listeners })}
    </div>
  );
}

// ----------------- Dashboard Component -----------------
export default function Dashboard({ theme, setTheme }) {
  const palette =
    theme === "dark"
      ? { ...darkColors, ...darkAccents }
      : { ...lightColors, ...lightAccents };
  const cssVars = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(palette).map(([key, value]) => [`--${key}`, value])
      ),
    [palette]
  );
  const sectionAccents = {
    line: { background: "linear-gradient(to right, #00C853, #69F0AE)" },
    pie: { background: "linear-gradient(to bottom , #00C853, #69F0AE)" },
    bar: { background: "linear-gradient(to top left, #00C853, #69F0AE)" },
    radar: { background: "linear-gradient(to top right, #00C853, #69F0AE)" },
    scatter: {
      background: "linear-gradient(to bottom left, #00C853, #69F0AE)",
    },
    map: { background: "linear-gradient(to bottom right, #00C853, #69F0AE)" },
  };

  const weeklyTraffic = useMemo(() => [120, 160, 110, 190, 230, 210, 260], []);
  const monthlyTrend = useMemo(
    () => [20, 50, 40, 75, 60, 90, 120, 140, 130, 170, 190, 210],
    []
  );
  const sourcesCred = useMemo(() => [95, 82, 76, 63, 40], []);
  const radarAxes = useMemo(
    () => ["Clarity", "Tone", "Correctness", "Originality", "SourceQuality"],
    []
  );
  const radarVals = useMemo(() => [80, 60, 35, 50, 70], []);
  const polarValues = useMemo(() => [40, 70, 30, 50, 80, 60], []);

  const [activeId, setActiveId] = useState(null);

  const sectionComponents = useMemo(
    () => ({
      line: {
        title: "Traffic Trends",
        Component: LineAreaSection,
        props: { weeklyTraffic, monthlyTrend, theme, palette, sectionAccents },
      },
      pie: {
        title: "Content Categories",
        Component: PieSection,
        props: { theme, sectionAccents, palette },
      },
      radar: {
        title: "Article Analysis",
        Component: RadarPolarSection,
        props: {
          radarAxes,
          radarVals,
          polarValues,
          palette,
          theme,
          sectionAccents,
        },
      },
      map: {
        title: "Geographic Hotspots",
        Component: MapCard,
        props: { theme, sectionAccents },
      },
      sources: {
        title: "Credible Sources",
        Component: SourcesCredibility,
        props: { palette, sectionAccents },
      },
    }),
    [
      theme,
      palette,
      sectionAccents,
      weeklyTraffic,
      monthlyTrend,
      radarAxes,
      radarVals,
      polarValues,
    ]
  );

  const [sections, setSections] = useState({
    left: ["map", "radar"],
    right: ["line", "pie", "sources"],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const findContainer = (id) => {
    if (sections.left.includes(id)) return "left";
    if (sections.right.includes(id)) return "right";
    return null;
  };
  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id) || over.id;

    if (activeContainer && overContainer) {
      setSections((prev) => {
        if (
          activeContainer !== overContainer &&
          prev[activeContainer].length === 1
        ) {
          return prev;
        }
        const activeIndex = prev[activeContainer].indexOf(active.id);
        const overIndex =
          prev[overContainer].indexOf(over.id) !== -1
            ? prev[overContainer].indexOf(over.id)
            : prev[overContainer].length;

        if (activeContainer === overContainer) {
          if (activeIndex === overIndex) return prev;
          return {
            ...prev,
            [activeContainer]: arrayMove(
              prev[activeContainer],
              activeIndex,
              overIndex
            ),
          };
        }

        const newActiveItems = [...prev[activeContainer]];
        const newOverItems = [...prev[overContainer]];
        const [movedItem] = newActiveItems.splice(activeIndex, 1);
        newOverItems.splice(overIndex, 0, movedItem);

        return {
          ...prev,
          [activeContainer]: newActiveItems,
          [overContainer]: newOverItems,
        };
      });
    }
    setActiveId(null);
  };

  const handleDragCancel = () => setActiveId(null);
  const activeSectionContent = activeId ? sectionComponents[activeId] : null;

  return (
    <div
      className="min-h-screen"
      style={{ ...cssVars, background: "var(--bg)" }}
    >
      <Header theme={theme} setTheme={setTheme} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="max-w-7xl mx-auto mt-6 px-8">
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            {Object.keys(sections).map((columnId) => (
              <div
                key={columnId}
                className="col-span-12 lg:col-span-6 space-y-4 lg:gap-6 min-h-[500px]"
              >
                <SortableContext
                  items={sections[columnId]}
                  strategy={verticalListSortingStrategy}
                >
                  {sections[columnId].length > 0 ? (
                    sections[columnId].map((id) => {
                      const { Component, props } = sectionComponents[id];
                      return (
                        <SortableWrapper key={id} id={id}>
                          <Component {...props} />
                        </SortableWrapper>
                      );
                    })
                  ) : (
                    <div
                      className="flex items-center justify-center h-full w-full rounded-2xl border-2 border-dashed"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--subtext)",
                      }}
                    >
                      Drop items here
                    </div>
                  )}
                </SortableContext>
              </div>
            ))}
          </div>
          <footer className="py-6 sm:py-10">
            <div
              className="max-w-6xl mx-auto px-4 text-sm text-center"
              style={{ color: "var(--subtext)" }}
            >
              WhiteBrains Misinformation Combater @2025
            </div>
          </footer>
        </div>

        <DragOverlay>
          {activeId && activeSectionContent ? (
            activeId === "map" ? (
              <div
                className="rounded-3xl border p-3 sm:p-4 opacity-100"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--card)",
                  cursor: "grabbing",
                }}
              >
                <div className="font-bold" style={{ color: "var(--text)" }}>
                  {sectionComponents.map.title}
                </div>
                <div
                  className="w-full h-64 bg-gray-500/20 rounded-md flex items-center justify-center mt-4"
                  style={{ color: "var(--subtext)" }}
                >
                  Map Preview
                </div>
              </div>
            ) : (
              <activeSectionContent.Component {...activeSectionContent.props} />
            )
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
