'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraphNode, GraphEdge } from './types';
import { X, Server, Database, Monitor, Globe, ArrowRight, Activity, FileText } from 'lucide-react';

// --- Graph Data (Logical Layout) ---
const LOGICAL_NODES = [
    // Ingestion Flow
    { id: 'client', label: 'Client App / Agent', type: 'client', col: 0, row: 0, description: 'Source of raw logs', detailedDescription: '**Component**: External applications or agents.\n**Action**: Sends HTTP POST requests to `/api/logs`.\n**Data**: Raw log JSON batches.' },
    { id: 'api', label: 'Ingestion API', type: 'service', col: 1, row: 0, description: 'Next.js API Route', detailedDescription: '**Component**: `src/app/api/logs/route.ts`\n**Action**: Receives requests, validates payload format.\n**Flow**: Passes data to Ingestion Service.' },
    { id: 'ingest', label: 'Ingestion Service', type: 'service', col: 2, row: 0, description: 'Core Handling Logic', detailedDescription: '**Component**: `src/services/ingestionService.ts`\n**Action**: 1. Validates Schema\n2. Pushes to Buffer\n3. Emits to Socket.IO' },

    // Real-time Branch
    { id: 'socket', label: 'Socket.IO Server', type: 'service', col: 2, row: 1, description: 'Real-time Emitter', detailedDescription: '**Component**: `src/lib/socket.ts`\n**Action**: Broadcasts new logs immediately to connected clients.' },

    // Storage Branch
    { id: 'buffer', label: 'Memory Buffer', type: 'service', col: 3, row: 0, description: 'Batch Buffer', detailedDescription: '**Component**: `src/lib/buffer.ts`\n**Action**: Accumulates logs to reduce I/O ops.\n**Trigger**: Flushes on size (100) or time (2s).' },
    { id: 'writer', label: 'Log Writer', type: 'service', col: 4, row: 0, description: 'File System Writer', detailedDescription: '**Component**: `src/lib/writer.ts`\n**Action**: Appends JSON lines to storage file.' },
    { id: 'storage', label: 'NDJSON Storage', type: 'storage', col: 4, row: 1, description: 'Persistent File', detailedDescription: '**Path**: `storage/logs.ndjson`\n**Format**: Newline Delimited JSON.\n**Role**: Single source of truth for history.' },

    // Read Path
    { id: 'stats', label: 'Stats Service', type: 'service', col: 3, row: 2, description: 'Aggregator', detailedDescription: '**Component**: `src/services/statsService.ts`\n**Action**: Reads storage, computes metrics, detects anomalies.' },
    { id: 'reader', label: 'Log Reader', type: 'service', col: 4, row: 2, description: 'Search Engine', detailedDescription: '**Component**: `src/lib/logReader.ts`\n**Action**: Efficiently reads and filters logs for the Explorer.' },

    // UI
    { id: 'ui', label: 'Dashboard UI', type: 'ui', col: 2, row: 2, description: 'React Frontend', detailedDescription: '**Components**: Dashboard, Log Explorer.\n**Inputs**: Real-time (Socket), Stats (API), Search (API).' }
];

const EDGES: GraphEdge[] = [
    { from: 'client', to: 'api', label: 'POST /api/logs', activity: true },
    { from: 'api', to: 'ingest', label: 'Validate', activity: true },
    { from: 'ingest', to: 'buffer', label: 'Push', activity: true },
    { from: 'ingest', to: 'socket', label: 'Emit event', activity: true },
    { from: 'buffer', to: 'writer', label: 'Flush batch', activity: true },
    { from: 'writer', to: 'storage', label: 'Append', activity: false },
    { from: 'socket', to: 'ui', label: 'Real-time logs', activity: true },
    { from: 'ui', to: 'stats', label: 'GET /stats', activity: false },
    { from: 'ui', to: 'reader', label: 'POST /search', activity: false },
    { from: 'stats', to: 'storage', label: 'Read', activity: false },
    { from: 'reader', to: 'storage', label: 'Read', activity: false },
];

const NODE_STYLES: Record<string, { bg: string; border: string; hoverBorder: string; iconColor: string; selectedBg: string; selectedText: string }> = {
    client: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        hoverBorder: 'hover:border-gray-300',
        iconColor: 'text-gray-500',
        selectedBg: 'bg-gray-100',
        selectedText: 'text-gray-600',
    },
    service: {
        bg: 'bg-red-50/80',
        border: 'border-red-200',
        hoverBorder: 'hover:border-red-300',
        iconColor: 'text-red-500',
        selectedBg: 'bg-red-100',
        selectedText: 'text-red-600',
    },
    storage: {
        bg: 'bg-rose-50/80',
        border: 'border-rose-200',
        hoverBorder: 'hover:border-rose-300',
        iconColor: 'text-rose-500',
        selectedBg: 'bg-rose-100',
        selectedText: 'text-rose-600',
    },
    ui: {
        bg: 'bg-orange-50/80',
        border: 'border-orange-200',
        hoverBorder: 'hover:border-orange-300',
        iconColor: 'text-orange-500',
        selectedBg: 'bg-orange-100',
        selectedText: 'text-orange-600',
    },
};

const getNodeIcon = (type: string, className: string) => {
    switch (type) {
        case 'client': return <Globe className={className} />;
        case 'service': return <Server className={className} />;
        case 'storage': return <Database className={className} />;
        case 'ui': return <Monitor className={className} />;
        default: return null;
    }
};

export const SystemGraph = () => {
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const COL_WIDTH = 250;
    const ROW_HEIGHT = 200;
    const OFFSET_X = 50;
    const OFFSET_Y = 80;
    const NODE_WIDTH = 150;
    const NODE_HEIGHT = 80;

    const nodes = LOGICAL_NODES.map(node => ({
        ...node,
        x: OFFSET_X + node.col * COL_WIDTH,
        y: OFFSET_Y + node.row * ROW_HEIGHT,
        width: NODE_WIDTH,
        height: NODE_HEIGHT
    }));

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                // Placeholder for responsive sizing logic
            }
        };
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const getPoint = (nodeId: string, side: 'top' | 'bottom' | 'left' | 'right') => {
        const node = nodes.find(n => n.id === nodeId)!;
        switch (side) {
            case 'top': return { x: node.x + node.width / 2, y: node.y };
            case 'bottom': return { x: node.x + node.width / 2, y: node.y + node.height };
            case 'left': return { x: node.x, y: node.y + node.height / 2 };
            case 'right': return { x: node.x + node.width, y: node.y + node.height / 2 };
        }
    };

    const getPath = (edge: GraphEdge) => {
        const source = nodes.find(n => n.id === edge.from)!;
        const target = nodes.find(n => n.id === edge.to)!;

        let start, end;

        if (edge.from === 'stats' && edge.to === 'storage') {
            start = getPoint(source.id, 'right');
            end = getPoint(target.id, 'bottom');
            return `M ${start.x} ${start.y} C ${start.x + 50} ${start.y}, ${end.x} ${end.y + 50}, ${end.x} ${end.y}`;
        }

        if (edge.from === 'reader' && edge.to === 'storage') {
            start = getPoint(source.id, 'top');
            end = getPoint(target.id, 'bottom');
            const midY = (start.y + end.y) / 2;
            return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
        }

        if (target.col > source.col) {
            start = getPoint(source.id, 'right');
            end = getPoint(target.id, 'left');
        } else if (target.col < source.col) {
            start = getPoint(source.id, 'left');
            end = getPoint(target.id, 'right');
        } else {
            if (target.row > source.row) {
                start = getPoint(source.id, 'bottom');
                end = getPoint(target.id, 'top');
            } else {
                start = getPoint(source.id, 'top');
                end = getPoint(target.id, 'bottom');
            }
        }

        const midX = (start.x + end.x) / 2;

        if (target.col > source.col) {
            return `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
        }

        if (source.col === target.col) {
            const curve = 50;
            if (target.row > source.row) {
                return `M ${start.x} ${start.y} C ${start.x} ${start.y + curve}, ${end.x} ${end.y - curve}, ${end.x} ${end.y}`;
            } else {
                return `M ${start.x} ${start.y} C ${start.x} ${start.y - curve}, ${end.x} ${end.y + curve}, ${end.x} ${end.y}`;
            }
        }

        return `M ${start.x} ${start.y} C ${start.x - 50} ${start.y}, ${end.x + 50} ${end.y}, ${end.x} ${end.y}`;
    };

    return (
        <div className="w-full overflow-x-auto rounded-2xl border border-red-100/60 shadow-2xl shadow-red-100/20 bg-white/50 backdrop-blur-sm custom-scrollbar">
            <div
                className="relative min-w-[1100px] h-[600px] bg-gradient-to-br from-white via-white to-red-50/20"
                ref={containerRef}
            >
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-dot-pattern-light opacity-60 pointer-events-none" />

                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#FDA4AF" />
                        </marker>
                        {/* Glow filter for active dots */}
                        <filter id="glow-red">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {EDGES.map((edge, i) => {
                        const d = getPath(edge);
                        const source = nodes.find(n => n.id === edge.from)!;
                        const target = nodes.find(n => n.id === edge.to)!;
                        const midX = (source.x + target.x) / 2 + (target.col > source.col ? 90 : 0);
                        const midY = (source.y + target.y) / 2 + 45;

                        return (
                            <g key={i}>
                                <path
                                    d={d}
                                    stroke="#FECDD3"
                                    strokeWidth="2"
                                    fill="none"
                                    markerEnd="url(#arrowhead-red)"
                                />
                                {edge.activity && (
                                    <circle r="3.5" fill="#EF4444" filter="url(#glow-red)">
                                        <animateMotion
                                            dur="2s"
                                            repeatCount="indefinite"
                                            path={d}
                                            keyPoints="0;1"
                                            keyTimes="0;1"
                                            calcMode="linear"
                                        />
                                    </circle>
                                )}
                                {edge.label && (
                                    <foreignObject x={midX - 65} y={midY - 15} width="100" height="24">
                                        <div className="flex justify-center">
                                            <span className="bg-white/95 backdrop-blur px-2 py-0.5 rounded-md border border-red-100/50 text-[10px] font-semibold text-gray-500 shadow-sm whitespace-nowrap">
                                                {edge.label}
                                            </span>
                                        </div>
                                    </foreignObject>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {nodes.map((node, i) => {
                    const style = NODE_STYLES[node.type] || NODE_STYLES.service;
                    return (
                        <motion.div
                            key={node.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                            className={`absolute p-0 rounded-xl border-2 shadow-sm cursor-pointer transition-all duration-300 backdrop-blur-sm group
                                ${style.bg} ${style.border} ${style.hoverBorder}
                                hover:shadow-lg hover:shadow-red-100/30
                                ${selectedNode?.id === node.id ? 'ring-2 ring-red-400 ring-offset-2 shadow-lg shadow-red-100/40' : ''}
                            `}
                            style={{
                                left: node.x,
                                top: node.y,
                                width: node.width,
                                height: node.height
                            }}
                            whileHover={{ y: -3 }}
                            onClick={() => setSelectedNode(node)}
                        >
                            <div className="h-full flex flex-col p-3">
                                <div className="flex items-center gap-2 mb-1.5">
                                    {getNodeIcon(node.type, `w-4 h-4 ${style.iconColor}`)}
                                    <span className="text-xs font-bold text-gray-700 truncate">{node.label}</span>
                                </div>
                                <p className="text-[10px] text-gray-500 leading-tight line-clamp-3">{node.description}</p>

                                <div className="mt-auto pt-0 flex justify-end">
                                    <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-red-400 transition-colors" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                <AnimatePresence>
                    {selectedNode && (() => {
                        const panelStyle = NODE_STYLES[selectedNode.type] || NODE_STYLES.service;
                        return (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                drag
                                dragMomentum={false}
                                className="fixed right-8 top-24 bottom-4 w-96 bg-white/95 backdrop-blur-xl shadow-2xl shadow-red-100/30 rounded-2xl border border-red-100/50 z-50 overflow-hidden cursor-move"
                            >
                                {/* Top gradient accent bar */}
                                <div className="h-1 w-full bg-gradient-to-r from-red-500 via-rose-500 to-orange-500" />

                                <div className="p-6 overflow-y-auto h-full custom-scrollbar">
                                    <button
                                        onClick={() => setSelectedNode(null)}
                                        className="absolute top-5 right-4 p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <div className="mt-6 flex items-center gap-3 mb-6">
                                        <div className={`p-3 rounded-xl shadow-sm ${panelStyle.selectedBg} ${panelStyle.selectedText}`}>
                                            {getNodeIcon(selectedNode.type, 'w-6 h-6')}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">{selectedNode.label}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${panelStyle.selectedBg} ${panelStyle.selectedText}`}>
                                                    {selectedNode.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="prose prose-sm max-w-none">
                                        <div className="space-y-3">
                                            {selectedNode.detailedDescription.split('\n').map((line: string, i: number) => {
                                                if (line.trim().startsWith('**')) {
                                                    const parts = line.split('**:');
                                                    const title = parts[0].replace('**', '').trim();
                                                    const content = parts.slice(1).join('**:').trim();
                                                    return (
                                                        <div key={i} className="bg-red-50/60 p-3 rounded-xl border border-red-100/50">
                                                            <span className="block text-xs font-bold text-red-400 uppercase tracking-wider mb-1">{title}</span>
                                                            <span className="text-sm text-gray-700 font-medium">{content}</span>
                                                        </div>
                                                    );
                                                }
                                                if (line.trim().length === 0) return null;
                                                return <p key={i} className="text-gray-600 leading-relaxed">{line}</p>;
                                            })}
                                        </div>
                                    </div>

                                    {/* Connected edges */}
                                    <div className="mt-6 pt-4 border-t border-red-100/50">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Connections</h4>
                                        <div className="space-y-2">
                                            {EDGES.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).map((edge, i) => {
                                                const isOutgoing = edge.from === selectedNode.id;
                                                const otherNode = nodes.find(n => n.id === (isOutgoing ? edge.to : edge.from));
                                                return (
                                                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50/80 border border-gray-100 text-xs">
                                                        <span className={`font-bold ${isOutgoing ? 'text-red-400' : 'text-rose-400'}`}>
                                                            {isOutgoing ? '→' : '←'}
                                                        </span>
                                                        <span className="font-semibold text-gray-700">{otherNode?.label}</span>
                                                        {edge.label && (
                                                            <span className="ml-auto text-gray-400 font-mono">{edge.label}</span>
                                                        )}
                                                        {edge.activity && (
                                                            <span className="relative flex h-1.5 w-1.5 ml-1">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })()}
                </AnimatePresence>
            </div>
        </div>
    );
};
