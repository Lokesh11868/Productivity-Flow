import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Connection,
  MarkerType,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import download from 'downloadjs';

const CustomNode = (props: NodeProps) => (
  <div className="p-2 bg-white border rounded shadow">{props.data.label}</div>
);

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Main Topic' },
    position: { x: 250, y: 0 },
    className: 'bg-primary-100 dark:bg-primary-900 border-2 border-primary-500 rounded-lg',
  },
];

const initialEdges: Edge[] = [];

const MindMap: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editNodeText, setEditNodeText] = useState('');

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [showBackground, setShowBackground] = useState(true);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (editMode && selectedNode) {
        updateNodeText();
      } else {
        addNode();
      }
    }
  };

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'bezier', // Use bezier for curved edges
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#2563eb', strokeWidth: 3 },
          },
          eds
        )
      ),
    [setEdges]
  );

  const addNode = () => {
    if (!nodeName.trim()) return;

    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      data: { label: nodeName },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      className: 'bg-secondary-100 dark:bg-secondary-900 border-2 border-secondary-500 rounded-lg',
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeName('');
  };

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  const editNode = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        setEditNodeText(node.data.label);
        setEditMode(true);
      }
    },
    [nodes]
  );

  const updateNodeText = useCallback(() => {
    if (selectedNode && editNodeText.trim()) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode) {
            return {
              ...node,
              data: {
                ...node.data,
                label: editNodeText,
              },
            };
          }
          return node;
        })
      );
      setEditMode(false);
      setEditNodeText('');
    }
  }, [selectedNode, editNodeText, setNodes]);

  const cancelEdit = useCallback(() => {
    setEditMode(false);
    setEditNodeText('');
  }, []);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
    setEditMode(false);
    setEditNodeText('');
  }, []);

  const exportMap = async (type: 'png' | 'jpeg' | 'svg' | 'json') => {
    // Hide background grid before export
    setShowBackground(false);

    // Wait for the background to be removed from DOM
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Get the actual ReactFlow canvas
    const flowNode = reactFlowWrapper.current?.querySelector('.react-flow') as HTMLElement;
    if (!flowNode) {
      setShowBackground(true);
      return;
    }

    try {
      if (type === 'png') {
        const dataUrl = await toPng(flowNode);
        download(dataUrl, 'mindmap.png');
      } else if (type === 'jpeg') {
        const dataUrl = await toJpeg(flowNode);
        download(dataUrl, 'mindmap.jpeg');
      } else if (type === 'svg') {
        const dataUrl = await toSvg(flowNode);
        download(dataUrl, 'mindmap.svg');
      } else if (type === 'json') {
        const jsonData = JSON.stringify({ nodes, edges }, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        download(blob, 'mindmap.json');
      }
    } catch (err) {
      console.error('Error exporting mind map:', err);
    } finally {
      // Restore background grid after export
      setShowBackground(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex">
      <div className="w-64 mr-4">
        <div className="glass-panel p-4">
          <h2 className="text-lg font-semibold mb-2">Node Controls</h2>

          {editMode && selectedNode ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={editNodeText}
                onChange={(e) => setEditNodeText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter new text..."
                className="input-field w-full"
              />
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={updateNodeText}
                  className="btn-primary flex-1 flex items-center justify-center"
                  disabled={!editNodeText.trim()}
                >
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelEdit}
                  className="btn-secondary flex-1 flex items-center justify-center"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2 mb-4">
                <input
                  type="text"
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter node text..."
                  className="input-field w-full"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addNode}
                  className="btn-primary flex items-center justify-center"
                  disabled={!nodeName.trim()}
                >
                  <Plus size={18} className="mr-2" />
                  Add Node
                </motion.button>
              </div>

              {selectedNode && (
                <>
                  <hr className="my-4 border-gray-200 dark:border-gray-700" />
                  <h3 className="text-md font-medium mb-2">Selected Node Actions</h3>
                  <div className="flex flex-col gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => editNode(selectedNode)}
                      className="btn-secondary flex items-center justify-center"
                    >
                      <Edit size={18} className="mr-2" />
                      Edit Node
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteNode(selectedNode)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded flex items-center justify-center"
                    >
                      <Trash2 size={18} className="mr-2" />
                      Delete Node
                    </motion.button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Mind Map</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Create and organize your thoughts visually</p>

          <div className="flex justify-end mb-2">
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
                onClick={() => exportMap('png')}
              >
                PNG
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
                onClick={() => exportMap('jpeg')}
              >
                JPEG
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
                onClick={() => exportMap('svg')}
              >
                SVG
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
                onClick={() => exportMap('json')}
              >
                JSON
              </motion.button>
            </div>
          </div>

          <div ref={reactFlowWrapper} className="glass-panel p-0 h-[600px] relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              className="bg-gray-50 dark:bg-gray-900"
              defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
              minZoom={0.5}
              maxZoom={2}
              nodesDraggable={true}
              nodesConnectable={true}
              snapToGrid={true}
              snapGrid={[15, 15]}
            >
              {showBackground && <Background color="#aaa" gap={16} />}
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindMap;
