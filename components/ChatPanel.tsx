import React, { useRef, useEffect, useState, useCallback, forwardRef } from 'react';
import type { Message, UnifiedConfig } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { BotIcon, UserIcon, DownloadIcon, SaveIcon, SparklesIcon, EyeIcon, UploadCloudIcon, FileTextIcon, AlertTriangleIcon, XCircleIcon, DnaIcon } from './icons/Icons';

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  isLiveUpdating: boolean;
  prompt: string;
  onPromptChange: (value: string) => void;
  onArchitectClick: (fullPrompt: string, userText: string) => void;
  config: UnifiedConfig;
  onSave: () => void;
  onPreview: () => void;
  onReflect: () => void;
  // NEW: Props for onboarding flow
  onboardingStep?: number;
  onOnboardingAction?: (actionType: 'save_onboarding_agent') => void;
}

const AIMessage: React.FC<{ message: Message, onOnboardingAction?: (actionType: 'save_onboarding_agent') => void; }> = ({ message, onOnboardingAction }) => {
  const { text, isReflection, isError, action } = message;
  
  return (
    <div className="flex items-start gap-3">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ring-1 ${
          isError ? 'bg-red-900/50 ring-red-400' :
          isReflection ? 'bg-indigo-900/50 ring-indigo-400' : 
          'bg-[rgb(var(--color-primary-val)/0.2)] ring-[rgb(var(--color-primary-val))]'
      }`}>
        {isError ? (
          <AlertTriangleIcon className="w-5 h-5 text-red-300" />
        ) : isReflection ? (
          <DnaIcon className="w-5 h-5 text-indigo-300" />
        ) : (
          <BotIcon className="w-5 h-5 text-[rgb(var(--color-primary-light-val))]" />
        )}
      </div>
      <div className={`rounded-lg p-3 max-w-2xl min-w-[60px] ${
          isError ? 'bg-red-800/40 border border-red-600/50' :
          isReflection ? 'bg-slate-800/60 border border-indigo-600/50 italic' : 
          'bg-slate-700/50'
      }`}>
          {text.length === 0 ? (
              <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[rgb(var(--color-primary-light-val))] rounded-full animate-pulse delay-0"></span>
                  <span className="w-2 h-2 bg-[rgb(var(--color-primary-light-val))] rounded-full animate-pulse delay-150"></span>
                  <span className="w-2 h-2 bg-[rgb(var(--color-primary-light-val))] rounded-full animate-pulse delay-300"></span>
              </div>
          ) : (
              <p className={`whitespace-pre-wrap ${
                  isError ? 'text-red-200' :
                  isReflection ? 'text-indigo-200' : 'text-slate-200'
              }`}>{text}</p>
          )}
          {action && onOnboardingAction && (
            <Button onClick={() => onOnboardingAction(action.type)} className="mt-3 w-full">
              <SaveIcon className="w-5 h-5" />
              {action.label}
            </Button>
          )}
      </div>
    </div>
  );
};

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

const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
};

// NEW: Wrapped in forwardRef to allow parent components to get a ref to the main div.
export const ChatPanel = forwardRef<HTMLDivElement, ChatPanelProps>(({ messages, isLoading, isLiveUpdating, prompt, onPromptChange, onArchitectClick, config, onSave, onPreview, onReflect, onboardingStep, onOnboardingAction }, ref) => {
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
        if (onboardingStep === 0 || onboardingStep === 1) {
          textarea.focus();
        }
    }
  }, [prompt, onboardingStep]);

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(config, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `or4cl3-${config.type}-blueprint.json`;
    link.click();
  };

  const handleArchitect = async () => {
    const trimmedPrompt = prompt.trim();
    if (onboardingStep === -1 || onboardingStep === undefined) {
        if (trimmedPrompt.length < MIN_PROMPT_LENGTH) {
            setError(`Please provide a more detailed description (at least ${MIN_PROMPT_LENGTH} characters).`);
            return;
        }
    }
    
    setError(null);

    let fileContents = '';
    const supportedFiles = uploadedFiles.filter(f => SUPPORTED_FILE_TYPES[f.type]?.supported);
    
    if (supportedFiles.length > 0) {
        try {
            const contents = await Promise.all(supportedFiles.map(readFileAsText));
            fileContents = contents.join('\n\n---\n\n');
        } catch (err) {
            console.error("Error reading files:", err);
            setError("Could not read one or more of the uploaded files.");
            return;
        }
    }

    const fullPrompt = fileContents
      ? `--- CONTEXT FROM UPLOADED FILES ---\n\n${fileContents}\n\n--- USER PROMPT ---\n\n${trimmedPrompt}`
      : trimmedPrompt;

    onArchitectClick(fullPrompt, trimmedPrompt);
    setUploadedFiles([]);
  }

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

  const isDuringOnboarding = onboardingStep !== undefined && onboardingStep > -1;
  const isArchitectDisabled = isLoading || (prompt.trim().length < (isDuringOnboarding ? 1 : MIN_PROMPT_LENGTH));

  return (
    <Card className="flex flex-col h-full" ref={ref}>
      <Card.Header>
        <Card.Title>Astrid: Command Console</Card.Title>
        <Card.Description>State your intent. I will translate it into a cognitive blueprint.</Card.Description>
      </Card.Header>
      <Card.Content ref={scrollRef} className="flex-grow overflow-y-auto space-y-4 p-4 scrollbar-thin">
        {messages.map((msg) =>
          msg.sender === 'ai' ? (
            <AIMessage key={msg.id} message={msg} onOnboardingAction={onOnboardingAction} />
          ) : (
            <UserMessage key={msg.id} text={msg.text} />
          )
        )}
      </Card.Content>
      <Card.Footer className="flex flex-col gap-2">
        {!isDuringOnboarding && (
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
                accept=".txt"
            />
            <div className="text-center text-sm p-2 text-slate-400">
                <UploadCloudIcon className="w-6 h-6 mx-auto mb-1" />
                <p>Drag & drop context files, or <button onClick={() => fileInputRef.current?.click()} className="text-[rgb(var(--color-primary-light-val))] hover:underline font-semibold">browse</button></p>
                <p className="text-xs text-slate-500 mt-1">.txt supported | .pdf & .docx coming soon</p>
            </div>
            </div>
        )}
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
            placeholder={
                onboardingStep === 0 ? "Tell me your name, Architect..." :
                onboardingStep === 1 ? "Enter the directive above..." :
                "e.g., 'Forge a recursively stable LLM for ethical reasoning...'"
            }
            className="w-full bg-slate-800/50 border border-[rgb(var(--color-border-val)/0.3)] rounded-lg p-2 focus:ring-2 focus:ring-[rgb(var(--color-primary-hover-val))] focus:outline-none transition text-sm resize-none scrollbar-thin max-h-40"
            rows={2}
            disabled={isLoading || onboardingStep === 4}
          />
          {isLiveUpdating && (
            <div className="absolute top-2 right-2 text-[rgb(var(--color-primary-light-val))]">
              <SparklesIcon className="w-5 h-5 animate-ping" />
            </div>
          )}
          {error && <p className="text-xs text-red-400 mt-1 pl-1">{error}</p>}
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
            <Button onClick={handleArchitect} disabled={isArchitectDisabled} className="w-full">
                <SparklesIcon className="w-5 h-5" />
                {isLoading ? 'Architecting...' : 'Architect'}
            </Button>
            <Button onClick={onReflect} disabled={isLoading || isDuringOnboarding} title="Perform ERPS Analysis" className="w-full !bg-indigo-600 hover:!bg-indigo-500 focus:!ring-indigo-500">
                <DnaIcon className="w-5 h-5" />
                ERPS Analysis
            </Button>
             <Button onClick={onSave} disabled={isLoading || isDuringOnboarding} title="Save Configuration" className="w-full !bg-green-600 hover:!bg-green-500 focus:!ring-green-500">
                <SaveIcon className="w-5 h-5" />
                Archive
            </Button>
            <Button onClick={handleExport} disabled={isLoading || isDuringOnboarding} title="Export Configuration" className="w-full !bg-[rgb(var(--color-secondary-val))] hover:!bg-[rgb(var(--color-secondary-hover-val))] focus:!ring-[rgb(var(--color-secondary-val))]">
                <DownloadIcon className="w-5 h-5" />
                Export
            </Button>
        </div>
        <Button onClick={onPreview} disabled={isLoading || isDuringOnboarding} title="Preview Blueprint" className="w-full !bg-slate-600 hover:!bg-slate-500 focus:!ring-slate-500">
            <EyeIcon className="w-5 h-5" />
            Preview Full Blueprint
        </Button>
      </Card.Footer>
    </Card>
  );
});