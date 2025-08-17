"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    FaBold, FaItalic, FaStrikethrough, FaListUl, FaListOl, FaPlus, FaMinus, FaAlignLeft,
    FaAlignRight, FaUnderline, FaLink, FaHighlighter, FaPalette, FaEllipsisV, FaImage,
    FaTasks, FaSuperscript, FaSubscript
} from 'react-icons/fa';
import { cn } from '@/src/lib/utils';

import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import { FontSize } from '@/src/lib/tiptap-fontsize';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Button } from "@/src/components/ui/button";

const Toolbar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const buttonClasses = (isActive: boolean = false) =>
        cn("p-2 rounded-md transition-colors", isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground');

    const handleFontSize = (direction: 'increase' | 'decrease') => {
        const currentSize = editor.getAttributes('textStyle').fontSize || '16';
        const newSize = parseInt(currentSize, 10) + (direction === 'increase' ? 2 : -2);
        if (newSize >= 10 && newSize <= 48) editor.chain().focus().setFontSize(String(newSize)).run();
    };

    const setLink = () => {
        const url = window.prompt('URL', editor.getAttributes('link').href);
        if (url === null || url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const addImage = () => {
        const url = window.prompt('Image URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const getCurrentFont = () => {
        if (editor.isActive('textStyle', { fontFamily: 'serif' })) return 'serif';
        if (editor.isActive('textStyle', { fontFamily: 'monospace' })) return 'monospace';
        return 'Inter';
    };

    const getCurrentStyle = () => {
        if (editor.isActive('heading', { level: 1 })) return 'h1';
        if (editor.isActive('heading', { level: 2 })) return 'h2';
        if (editor.isActive('heading', { level: 3 })) return 'h3';
        return 'paragraph';
    };

    return (
        <div className="flex flex-col p-2 border-b border-input">
            <div className="flex flex-wrap items-center gap-2">
                <Select value={getCurrentStyle()} onValueChange={value => {
                    const chain = editor.chain().focus();
                    if (value === 'h1') chain.toggleHeading({ level: 1 }).run();
                    else if (value === 'h2') chain.toggleHeading({ level: 2 }).run();
                    else if (value === 'h3') chain.toggleHeading({ level: 3 }).run();
                    else chain.setParagraph().run();
                }}>
                    <SelectTrigger className="w-[120px] h-9"><SelectValue placeholder="Style" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="paragraph">Paragraph</SelectItem>
                        <SelectItem value="h1">Heading 1</SelectItem>
                        <SelectItem value="h2">Heading 2</SelectItem>
                        <SelectItem value="h3">Heading 3</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={getCurrentFont()} onValueChange={value => {
                    if (value === 'Inter') {
                        editor.chain().focus().unsetFontFamily().run();
                    } else {
                        editor.chain().focus().setFontFamily(value).run();
                    }
                }}>
                    <SelectTrigger className="w-[120px] h-9"><SelectValue placeholder="Font" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Inter">Sans-Serif</SelectItem>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="monospace">Monospace</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex items-center rounded-md border border-input h-9">
                    <button type="button" onClick={() => handleFontSize('decrease')} className={cn(buttonClasses(), "border-r rounded-r-none")}><FaMinus className="h-4 w-4" /></button>
                    <span className="w-8 text-center text-sm tabular-nums">{editor.getAttributes('textStyle').fontSize || '16'}</span>
                    <button type="button" onClick={() => handleFontSize('increase')} className={cn(buttonClasses(), "border-l rounded-l-none")}><FaPlus className="h-4 w-4" /></button>
                </div>
                <div className={cn(buttonClasses(), "relative h-9 w-9 p-0 flex items-center justify-center")}>
                    <FaPalette className="h-4 w-4" />
                    <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()} value={editor.getAttributes('textStyle').color || '#000000'} />
                </div>
                <div className="h-6 w-px bg-input mx-1"></div>
                <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={buttonClasses(editor.isActive({ textAlign: 'left' }))}><FaAlignLeft className="h-4 w-4" /></button>
                <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={buttonClasses(editor.isActive({ textAlign: 'right' }))}><FaAlignRight className="h-4 w-4" /></button>
            </div>

            <div className="flex flex-wrap items-center gap-1 mt-2">
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClasses(editor.isActive('bold'))}><FaBold className="h-4 w-4" /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClasses(editor.isActive('italic'))}><FaItalic className="h-4 w-4" /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={buttonClasses(editor.isActive('underline'))}><FaUnderline className="h-4 w-4" /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={buttonClasses(editor.isActive('strike'))}><FaStrikethrough className="h-4 w-4" /></button>

                <div className="h-6 w-px bg-input mx-1"></div>

                <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClasses(editor.isActive('bulletList'))}><FaListUl className="h-4 w-4" /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClasses(editor.isActive('orderedList'))}><FaListOl className="h-4 w-4" /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleTaskList().run()} className={buttonClasses(editor.isActive('taskList'))}><FaTasks className="h-4 w-4" /></button>

                <div className="h-6 w-px bg-input mx-1"></div>

                <button type="button" onClick={addImage} className={buttonClasses()}><FaImage className="h-4 w-4" /></button>
                <button type="button" onClick={setLink} className={buttonClasses(editor.isActive('link'))}><FaLink className="h-4 w-4" /></button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9"><FaEllipsisV className="h-4 w-4" /></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                        <div className="flex gap-1">
                            <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className={buttonClasses(editor.isActive('highlight'))}><FaHighlighter className="h-4 w-4" /></button>
                            <button type="button" onClick={() => editor.chain().focus().toggleSubscript().run()} className={buttonClasses(editor.isActive('subscript'))}><FaSubscript className="h-4 w-4" /></button>
                            <button type="button" onClick={() => editor.chain().focus().toggleSuperscript().run()} className={buttonClasses(editor.isActive('superscript'))}><FaSuperscript className="h-4 w-4" /></button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

interface TiptapEditorProps {
    value: string;
    onChange: (richText: string) => void;
}

export function TiptapEditor({ value, onChange }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Underline,
            Link.configure({ openOnClick: false }),
            Highlight,
            Color,
            Image,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Superscript,
            Subscript,
            FontFamily.configure({ types: ['textStyle'] }),
            FontSize,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert prose-sm sm:prose-base min-h-[150px] max-w-none p-4 focus:outline-none break-words',
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="rounded-md border border-input bg-transparent dark:bg-input/30 transition-colors">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}