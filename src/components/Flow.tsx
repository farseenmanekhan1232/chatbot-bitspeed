import React, { useState, useCallback, DragEvent, useMemo } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import NodePanel from "./NodePanel";
import SettingsPanel from "./SettingsPanel";
import TextNode from "./TextNode";
import html2canvas from "html2canvas";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const Flow: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nodeTypes = useMemo(() => ({ textNode: TextNode }), []);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: `${nodes.length + 1}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  const validateAndSave = () => {
    const emptyTargetNodes = nodes.filter(
      (node) => edges.filter((edge) => edge.target === node.id).length === 0
    );

    if (nodes.length > 1 && emptyTargetNodes.length > 1) {
      setError("Error: Some nodes have empty target handles.");
      return;
    }

    setError(null);
    saveAsPng();
  };

  const saveAsPng = () => {
    const reactFlowWrapper = document.querySelector(".react-flow");

    if (!reactFlowWrapper) return;

    html2canvas(reactFlowWrapper as HTMLElement).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "flow.png";
      link.click();
    });
  };

  return (
    <div className="flex h-screen">
      <NodePanel />
      <div
        className="w-full h-full relative"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          className="react-flow"
        >
          <Background />
          <Controls />
        </ReactFlow>
        <button
          onClick={validateAndSave}
          className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
        {error && (
          <div className="absolute bottom-16 right-4 px-4 py-2 bg-red-600 text-white rounded">
            {error}
          </div>
        )}
      </div>
      <SettingsPanel
        selectedNode={selectedNode}
        nodes={nodes}
        setNodes={setNodes}
      />
    </div>
  );
};

export default Flow;
