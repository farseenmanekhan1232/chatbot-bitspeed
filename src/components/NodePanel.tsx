import React from "react";

const NodePanel: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-1/4 p-4 border-r border-gray-300">
      <div className="text-lg font-semibold mb-4">Nodes Panel</div>
      <div
        className="p-2 border border-gray-400 rounded mb-2 cursor-pointer"
        onDragStart={(event) => onDragStart(event, "textNode")}
        draggable
      >
        Text Node
      </div>
    </aside>
  );
};

export default NodePanel;
