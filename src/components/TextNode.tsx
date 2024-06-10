import React from "react";
import { Handle, Position } from "reactflow";

const TextNode: React.FC<{ data: { label: string } }> = ({ data }) => {
  return (
    <div className="p-2 bg-white border border-gray-400 rounded">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-blue-500"
      />
      <div>{data.label}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-blue-500"
      />
    </div>
  );
};

export default TextNode;
