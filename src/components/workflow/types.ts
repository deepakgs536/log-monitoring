export interface GraphNode {
    id: string;
    label: string;
    description: string;
    detailedDescription: string;
    col: number; // Grid column
    row: number; // Grid row
    x?: number;  // Calculated dynamically
    y?: number;  // Calculated dynamically
    width?: number;
    height?: number;
    type: 'client' | 'service' | 'storage' | 'ui';
}

export interface GraphEdge {
    from: string;
    to: string;
    label?: string;
    activity?: boolean; // If true, show active data flow animation
}
