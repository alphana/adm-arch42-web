import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {InfoPanelProps} from "../../types/togafexplorer.types.ts";
import './markdown.css';
const InfoPanel: React.FC<InfoPanelProps> = ({ node, onClose }) => {
    const [content, setContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadContent = async (): Promise<void> => {
            setIsLoading(true);
            try {
                const response = await fetch(`/content/${node.contentPath}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const text = await response.text();
                setContent(text);
            } catch (error) {
                console.error('Error loading content:', error);
                setContent(`# ${node.text}\n\n${node.description}`);
            }
            setIsLoading(false);
        };

        void loadContent();
    }, [node]);

    return (
        <div className="info-panel">
            <div className="info-header">
                <h2>{node.text}</h2>
                <button
                    className="close-button"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
            <div className="info-content">
                {isLoading ? (
                    <div className="loading">Loading content...</div>
                ) : (
                    <div className="markdown-content">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfoPanel;