import React, { useEffect, useState } from "react";
import { Node } from "reactflow";

interface SettingsPanelProps {
  selectedNode: string | null;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  selectedNode,
  nodes,
  setNodes,
}) => {
  const [text, setText] = useState("");

  useEffect(() => {
    const node = nodes.find((n) => n.id === selectedNode);
    if (node) {
      setText(node.data.label);
    }
  }, [selectedNode, nodes]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode) {
          return { ...node, data: { ...node.data, label: event.target.value } };
        }
        return node;
      })
    );
  };

  if (!selectedNode) {
    return (
      <aside className="w-1/4 p-4 border-l border-gray-300">
        Select a node to edit its settings.
      </aside>
    );
  }

  return (
    <aside className="w-1/4 p-4 border-l border-gray-300">
      <div className="text-lg font-semibold mb-4">Settings Panel</div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Text:</label>
        <input
          type="text"
          value={text}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </aside>
  );
};

export default SettingsPanel;
