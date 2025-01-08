export interface NodeData {
    text: string;
    description: string;
    type: 'root' | 'phase' | 'deliverable';
    contentPath: string;
    x: number;
    y: number;
    children?: NodeData[];
}

export interface InfoPanelProps {
    node: NodeData;
    onClose: () => void;
}