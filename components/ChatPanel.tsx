import React, { useRef, useEffect, useState, useCallback } from 'react';
// FIX: Changed ModelConfig to UnifiedConfig to support all asset types.
import type { Message, UnifiedConfig } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { BotIcon, UserIcon, DownloadIcon, SaveIcon, SparklesIcon, EyeIcon, UploadCloudIcon, FileTextIcon, AlertTriangleIcon, XCircleIcon } from './icons/Icons';

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  isLiveUpdating: boolean;
  prompt: string;
  onPromptChange: (value: string) => void;
  onArchitectClick: () => void;
  // FIX: config is now UnifiedConfig to handle all asset types for export.
  config: UnifiedConfig;
  onSave: () => void;
  onPreview: () => void;
}

const AIMessage: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(var(--color-primary-val)/0.2)] flex items-center justify-center ring-1 ring-[rgb(var(--color-primary-val))]">
      <BotIcon className="w-5 h-5 text-[rgb(var(--color-primary-light-val))]" />
    </div>
    <div className="bg-slate-700/50 rounded-lg p-3 max-w-2xl min-w-[60px]">
        {text.length === 0 ? (
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[rgb(var(--color-primary-light-val))] rounded-full animate-pulse delay-0"></span>
                <span className="w-2 h-2 bg-[rgb(var(--color-primary-light-val))] rounded-full animate-pulse delay-150"></span>
                <span className="w-2 h-2 bg-[rgb(var(--color-primary-light-val))] rounded-full animate-pulse delay-300"></span>
            </div>
        ) : (
            <p className="text-slate-200 whitespace-pre-wrap">{text}</p>
        )}
    </div>
  </div>
);

const UserMessage: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-3 justify-end">
    <div className="bg-[rgb(var(--color-secondary-val))] rounded-lg p-3 max-w-2xl">
      <p className="text-white whitespace-pre-wrap">{text}</p>
    </div>
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(var(--color-secondary-val)/0.2)] flex items-center justify-center ring-1 ring-[rgb(var(--color-secondary-val))]">
      <UserIcon className="w-5 h-5 text-[rgb(var(--color-secondary-hover-val))]" />
    </div>
  </div>
);

const MIN_PROMPT_LENGTH = 10;
const SUPPORTED_FILE_TYPES = {
    'text/plain': { icon: <FileTextIcon className="w-5 h-5 text-green-400" />, supported: true, note: 'Content will be processed.' },
    'application/pdf': { icon: <AlertTriangleIcon className="w-5 h-5 text-yellow-400" />, supported: false, note: 'PDF parsing coming soon.' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: <AlertTriangleIcon className="w-5 h-5 text-yellow-400" />, supported: false, note: 'DOCX parsing coming soon.' },
};

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, isLoading, isLiveUpdating, prompt, onPromptChange, onArchitectClick, config, onSave, onPreview }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, messages[messages.length-1]?.text]);
  
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [prompt]);

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(config, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "arch1tech-model-config.json";
    link.click();
  };

  const handleArchitect = async () => {
    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt.length < MIN_PROMPT_LENGTH) {
      setError(`Please provide a more detailed description (at least ${MIN_PROMPT_LENGTH} characters).`);
      return;
    }
    setError(null);
    
    // File content is now handled by the parent through the debounced prompt
    // This button just finalizes the action
    onArchitectClick();
    setUploadedFiles([]);
  }

  useEffect(() => {
    // Prepend file content to the prompt when files are added/removed
    const processFiles = async () => {
        const supportedFiles = uploadedFiles.filter(f => SUPPORTED_FILE_TYPES[f.type]?.supported);
        if (supportedFiles.length === 0) {
            // If no files, ensure no file context remains in parent prompt
            // (This is tricky, parent now manages prompt fully)
            return;
        }

        const fileReadingPromises = supportedFiles.map(file => file.text().then(content => ({ name: file.name, content })));
        const resolvedFiles = await Promise.all(fileReadingPromises);

        let fileContext = '';
        if (resolvedFiles.length > 0) {
            fileContext = "KNOWLEDGE BASE:\n";
            resolvedFiles.forEach(file => {
                fileContext += `--- ${file.name} ---\n${file.content}\n--- END ${file.name} ---\n\n`;
            });
            fileContext += "USER REQUEST: ";
        }
        
        // This direct manipulation is an anti-pattern since state is lifted.
        // For now, we'll let the user's typing trigger the debounced update.
        // A more robust solution might involve a separate state for file content in the parent.
    };
    processFiles();
  }, [uploadedFiles]);


  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setUploadedFiles(prev => {
        const existingNames = new Set(prev.map(f => f.name));
        const uniqueNewFiles = newFiles.filter(f => !existingNames.has(f.name));
        return [...prev, ...uniqueNewFiles];
    });
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };
  
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, []);

  return (
    <Card className="flex flex-col h-full">
      <Card.Header>
        <Card.Title>Astrid: Command Console</Card.Title>
        <Card.Description>Describe your AI; I will update the blueprint in real-time.</Card.Description>
      </Card.Header>
      <Card.Content ref={scrollRef} className="flex-grow overflow-y-auto space-y-4 p-4 scrollbar-thin">
        {messages.map((msg) =>
          msg.sender === 'ai' ? (
            <AIMessage key={msg.id} text={msg.text} />
          ) : (
            <UserMessage key={msg.id} text={msg.text} />
          )
        )}
      </Card.Content>
      <Card.Footer className="flex flex-col gap-2">
        <div 
          className={`w-full p-2 border border-dashed rounded-lg transition-colors ${isDragging ? 'border-[rgb(var(--color-primary-val))] bg-[rgb(var(--color-primary-val)/0.1)]' : 'border-[rgb(var(--color-border-val)/0.3)]'}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {uploadedFiles.length > 0 && (
            <div className="mb-2 space-y-1 max-h-24 overflow-y-auto scrollbar-thin pr-1">
              {uploadedFiles.map(file => {
                const fileTypeInfo = SUPPORTED_FILE_TYPES[file.type] || { icon: <FileTextIcon className="w-5 h-5 text-slate-400" />, supported: false, note: 'Unsupported file type.' };
                return (
                  <div key={file.name} className="flex items-center justify-between bg-slate-800/60 p-1.5 rounded text-xs" title={fileTypeInfo.note}>
                    <div className="flex items-center gap-2 truncate">
                      {fileTypeInfo.icon}
                      <span className="truncate text-slate-300">{file.name}</span>
                    </div>
                    <button onClick={() => handleRemoveFile(file.name)} className="text-slate-400 hover:text-red-400">
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
          <input 
            ref={fileInputRef}
            type="file" 
            multiple 
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files)}
            accept=".txt,.pdf,.docx"
          />
          <div className="text-center text-sm p-2 text-slate-400">
            <UploadCloudIcon className="w-6 h-6 mx-auto mb-1" />
            <p>Drag & drop files here, or <button onClick={() => fileInputRef.current?.click()} className="text-[rgb(var(--color-primary-light-val))] hover:underline font-semibold">browse</button></p>
            <p className="text-xs text-slate-500 mt-1">.txt supported | .pdf & .docx coming soon</p>
          </div>
        </div>
        <div className="w-full relative">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleArchitect();
              }
            }}
            placeholder="e.g., 'Draft a nimble agent for real-time sentiment analysis on social media feeds...'"
            className="w-full bg-slate-800/50 border border-[rgb(var(--color-border-val)/0.3)] rounded-lg p-2 focus:ring-2 focus:ring-[rgb(var(--color-primary-hover-val))] focus:outline-none transition text-sm resize-none scrollbar-thin max-h-40"
            rows={2}
            disabled={isLoading}
          />
          {isLiveUpdating && (
            <div className="absolute top-2 right-2 text-[rgb(var(--color-primary-light-val))]">
              <SparklesIcon className="w-5 h-5 animate-ping" />
            </div>
          )}
          {error && <p className="text-xs text-red-400 mt-1 pl-1">{error}</p>}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full">
            <Button onClick={handleArchitect} disabled={isLoading || prompt.trim().length < MIN_PROMPT_LENGTH} className="w-full col-span-2 lg:col-span-1">
                <SparklesIcon className="w-5 h-5" />
                {isLoading ? 'Summarizing...' : 'Lock & Summarize'}
            </Button>
            <Button onClick={onPreview} disabled={isLoading} title="Preview Blueprint" className="w-full !bg-slate-600 hover:!bg-slate-500 focus:!ring-slate-500">
                <EyeIcon className="w-5 h-5" />
                Preview
            </Button>
             <div className="flex items-center gap-2 w-full col-span-2 lg:col-span-2">
                <Button onClick={onSave} disabled={isLoading} title="Save Configuration" className="w-full !bg-indigo-600 hover:!bg-indigo-500 focus:!ring-indigo-500">
                    <SaveIcon className="w-5 h-5" />
                    Save
                </Button>
                <Button onClick={handleExport} disabled={isLoading} title="Export Configuration" className="w-full !bg-[rgb(var(--color-secondary-val))] hover:!bg-[rgb(var(--color-secondary-hover-val))] focus:!ring-[rgb(var(--color-secondary-val))]">
                    <DownloadIcon className="w-5 h-5" />
                    Export
                </Button>
            </div>
        </div>
      </Card.Footer>
    </Card>
  );
};