import React, {useState} from 'react';
import InfoPanel from './InfoPanel';
import './index.css';
import {NodeData} from "../../types/togafexplorer.types.ts";

const nodeWidth = 150;
const nodeHeight = 60;

// Node positions are pre-calculated for simplicity
const nodes: NodeData[] = [
    {
        text: 'TOGAF ADM',
        description: 'The TOGAF Architecture Development Method',
        type: 'root',
        contentPath: 'root.md',
        x: 50,
        y: 300,
        children: [
            {
                text: 'Preliminary',
                description: 'Framework and Principles',
                type: 'phase',
                contentPath: 'phases/preliminary.md',
                x: 300,
                y: 150,
                children: [
                    {
                        text: 'Architecture Principles',
                        description: 'Principles catalog defining architecture rules',
                        type: 'deliverable',
                        contentPath: 'deliverables/preliminary/principles.md',
                        x: 550,
                        y: 100
                    },
                    {
                        text: 'Architecture Repository',
                        description: 'Central repository for architecture artifacts',
                        type: 'deliverable',
                        contentPath: 'deliverables/preliminary/repository.md',
                        x: 550,
                        y: 200
                    }
                ]
            },
            {
                text: 'Architecture Vision',
                description: 'Establishes the vision',
                type: 'phase',
                contentPath: 'phases/vision.md',
                x: 300,
                y: 300
            },
            {
                text: 'Business Architecture',
                description: 'Defines business architecture',
                type: 'phase',
                contentPath: 'phases/business.md',
                x: 300,
                y: 450
            }
        ]
    }
];

const getConnectorPath = (
    startX: number,
    startY: number,
    endX: number,
    endY: number
): string => {
    const midX = (startX + endX) / 2;
    return `M ${startX + nodeWidth} ${startY + nodeHeight / 2} 
          C ${midX} ${startY + nodeHeight / 2},
            ${midX} ${endY + nodeHeight / 2},
            ${endX} ${endY + nodeHeight / 2}`;
};

const renderConnections = (nodes: NodeData[]): JSX.Element[] => {
    const connections: JSX.Element[] = [];

    const processNode = (node: NodeData): void => {
        if (node.children) {
            node.children.forEach((child) => {
                connections.push(
                    <path
                        key={`${node.text}-${child.text}`}
                        d={getConnectorPath(node.x, node.y, child.x, child.y)}
                        className="connector"
                    />
                );
                processNode(child);
            });
        }
    };

    processNode(nodes[0]);
    return connections;
};

const TOGAFExplorer: React.FC = () => {
    const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);


    const handleSelectedNode = (event: React.MouseEvent, node: NodeData) => {
        event.stopPropagation();  // Stop event bubbling
        console.info(node);
        setSelectedNode(node);
    }

    const renderNode = (node: NodeData): React.JSX.Element => {
        return (
            <g
                key={node.text}
                onClick={(event) => handleSelectedNode(event, node)}
            >
                <rect
                    x={node.x}
                    y={node.y}
                    width={nodeWidth}
                    height={nodeHeight}
                    rx={5}
                    className={`node ${node.type}`}
                />
                <text
                    x={node.x + nodeWidth / 2}
                    y={node.y + nodeHeight / 2}
                    className="node-text"
                >
                    {node.text}
                </text>
                {node.children?.map(renderNode)}
            </g>
        );
    };

    return (
        <div className="explorer-container">
            <div className="canvas-container">
                <svg width="100%" height="100%" viewBox="0 0 800 600">
                    {renderConnections(nodes)}
                    {nodes.map(renderNode)}
                </svg>
            </div>

            {selectedNode && (
                <InfoPanel
                    node={selectedNode}
                    onClose={() => setSelectedNode(null)}
                />
            )}
        </div>
    );
};

export default TOGAFExplorer;