import React, { useMemo } from 'react';
import ReactFlow, {
    Background,
    Handle,
    Position,
    useNodesState,
    useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { cn } from '../lib/utils';

// Custom Node Component
const PlanNode = ({ data }) => {
    return (
        <div className={cn(
            "px-10 py-8 rounded-[3rem] shadow-2xl transition-all duration-300 border-none",
            data.isRoot
                ? "bg-white text-slate-900 font-extrabold text-3xl min-w-[320px] text-center"
                : "bg-white text-slate-800 min-w-[450px] shadow-[0_30px_60px_rgba(0,0,0,0.12)]"
        )}>
            {/* Target handle for children */}
            {!data.isRoot && (
                <Handle
                    type="target"
                    position={Position.Top}
                    className="w-4 h-4 !bg-slate-300 border-2 border-white !opacity-0"
                />
            )}

            <div className="flex flex-col gap-6">
                <span className={cn(
                    "block tracking-tighter",
                    data.isRoot ? "" : "text-slate-900 font-extrabold border-b-2 border-slate-100 pb-5 mb-2 text-3xl text-left"
                )}>
                    {data.label}
                </span>

                {!data.isRoot && (
                    <div className="text-[30px] text-left whitespace-pre-line leading-relaxed text-slate-700 font-semibold px-2">
                        {data.content}
                    </div>
                )}
            </div>

            {/* Source handle for root */}
            {data.isRoot && (
                <Handle
                    type="source"
                    position={Position.Bottom}
                    className="w-4 h-4 !bg-slate-300 border-2 border-white !opacity-0"
                />
            )}
        </div>
    );
};

const nodeTypes = {
    planNode: PlanNode,
};

export default function PlanGraph({ data }) {
    const { initialNodes, initialEdges } = useMemo(() => {
        if (!data || !data.plan) return { initialNodes: [], initialEdges: [] };

        const nodes = [];
        const edges = [];

        // 1. Root Node
        nodes.push({
            id: 'root',
            type: 'planNode',
            data: { label: data.plan.title, isRoot: true },
            position: { x: 500, y: 0 },
        });

        // 2. Map children to boxes
        const children = data.plan.children || [];
        const horizontalSpacing = 550; // Increased spacing for wider nodes
        const totalWidth = (children.length - 1) * horizontalSpacing;
        const startX = 500 - totalWidth / 2;

        children.forEach((child, index) => {
            const id = `node-${index}`;

            // Format content with large numbering
            const content = child.children
                ? child.children.map((sub, i) => {
                    const line = `${i + 1}. ${sub.title}`;
                    return sub.url ? `${line}\n   (Link: ${sub.url})` : line;
                }).join('\n\n')
                : '';

            nodes.push({
                id,
                type: 'planNode',
                data: {
                    label: child.title,
                    content: content,
                    isRoot: false
                },
                position: { x: startX + index * horizontalSpacing, y: 250 },
            });

            edges.push({
                id: `edge-root-${id}`,
                source: 'root',
                target: id,
                animated: false,
                style: { stroke: '#94a3b8', strokeWidth: 3 },
            });
        });

        return { initialNodes: nodes, initialEdges: edges };
    }, [data]);

    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    if (!data || !data.plan) return null;

    return (
        <div className="w-full h-[800px] overflow-hidden relative bg-transparent border-none">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                panOnScroll
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                preventScrolling={false}
                elementsSelectable={false}
                nodesConnectable={false}
                nodesDraggable={true}
                fitViewOptions={{ padding: 0.2 }}
            >
                <Background color="transparent" />
            </ReactFlow>
        </div>
    );
}
