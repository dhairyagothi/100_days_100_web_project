import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Navbar from '../navbar/Navbar';
import './editor.css';

function Editor() {
    const [markdownText, setMarkdownText] = useState('');

    const handleInputChange = (e) => {
        setMarkdownText(e.target.value);
    };

    const handleTextSelect = (text) => {
        setMarkdownText((prevText) => prevText + '\n' + text);
    };

    const downloadMarkdown = () => {
        const blob = new Blob([markdownText], { type: 'text/markdown' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'README.md'; // The default file name
        link.click();
    };

    return (
        <div className="container">
            <Navbar onTextSelect={handleTextSelect} />
            <div className='editor-container'>
                <div className="editor">
                    <textarea
                        value={markdownText}
                        onChange={handleInputChange}
                        placeholder="Write your markdown here..."
                    />
                </div>
                <div className="preview">
                    <ReactMarkdown>{markdownText}</ReactMarkdown>
                </div>
            </div>
            {/* Download Button */}
            <div className="download-button-container">
                <button className="download-button" onClick={downloadMarkdown}>
                    Download README
                </button>
            </div>
        </div>
    );
}

export default Editor;
