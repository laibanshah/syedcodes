"use client";

import { useEffect, useRef, useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Plus, X } from "lucide-react";

interface Item {
  id: string;
  text: string;
}

let seq = 0;
const newId = () => `item-${++seq}`;
const toItems = (values: string[]): Item[] => values.map((text) => ({ id: newId(), text }));

interface RowProps {
  item: Item;
  index: number;
  total: number;
  placeholder?: string;
  registerRef: (id: string, el: HTMLTextAreaElement | null) => void;
  onText: (id: string, text: string) => void;
  onRemove: (id: string) => void;
  onEnter: (id: string) => void;
  onBackspaceEmpty: (id: string) => void;
  onPasteLines: (id: string, lines: string[]) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}

function Row({
  item, index, total, placeholder, registerRef, onText, onRemove, onEnter, onBackspaceEmpty, onPasteLines, onMove,
}: RowProps) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      as="li"
      value={item}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.015, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
      className="flex items-start gap-1.5 rounded-xl border border-border bg-background p-1.5 relative"
    >
      <button
        type="button"
        // touch-none stops the page from scrolling while the handle is dragged on a phone.
        className="touch-none cursor-grab active:cursor-grabbing shrink-0 w-9 h-11 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
        aria-label={`Reorder item ${index + 1} of ${total}. Drag, or use the up and down arrow keys.`}
        onPointerDown={(e) => controls.start(e)}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            onMove(item.id, -1);
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            onMove(item.id, 1);
          }
        }}
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <textarea
        ref={(el) => registerRef(item.id, el)}
        value={item.text}
        rows={1}
        placeholder={placeholder}
        onChange={(e) => onText(item.id, e.target.value.replace(/\n/g, " "))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onEnter(item.id);
          } else if (e.key === "Backspace" && item.text === "") {
            e.preventDefault();
            onBackspaceEmpty(item.id);
          }
        }}
        onPaste={(e) => {
          const text = e.clipboardData.getData("text");
          if (/\r?\n/.test(text.trim())) {
            e.preventDefault();
            onPasteLines(item.id, text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean));
          }
        }}
        // field-sizing grows the box with its text (modern browsers); rows={1} is the fallback.
        className="flex-1 min-w-0 min-h-11 px-3 py-2.5 bg-transparent text-base resize-none focus:outline-none field-sizing-content"
      />
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="shrink-0 w-9 h-11 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        aria-label={`Remove item ${index + 1}`}
      >
        <X className="w-4 h-4" />
      </button>
    </Reorder.Item>
  );
}

interface ListEditorProps {
  /** Initial values. Give the component a `key` to reset it when you load a different record. */
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}

/**
 * Replaces the old "one item per line" textarea: every item is its own row that
 * can be dragged (mouse or touch) or moved with the arrow keys.
 * Enter adds a row, pasting several lines splits them into rows.
 */
export default function ListEditor({ value, onChange, placeholder, addLabel = "Add item" }: ListEditorProps) {
  const [items, setItems] = useState<Item[]>(() => toItems(value));
  const [focusId, setFocusId] = useState<string | null>(null);
  const refs = useRef<Map<string, HTMLTextAreaElement>>(new Map());

  const commit = (next: Item[]) => {
    setItems(next);
    onChange(next.map((i) => i.text));
  };

  useEffect(() => {
    if (!focusId) return;
    refs.current.get(focusId)?.focus();
    setFocusId(null);
  }, [focusId, items]);

  const insertAfter = (id: string | null, texts: string[]) => {
    const fresh = texts.map((text) => ({ id: newId(), text }));
    const at = id ? items.findIndex((i) => i.id === id) + 1 : items.length;
    commit([...items.slice(0, at), ...fresh, ...items.slice(at)]);
    if (fresh.length) setFocusId(fresh[fresh.length - 1].id);
  };

  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground px-1">Nothing here yet.</p>
      )}
      <Reorder.Group as="ul" axis="y" values={items} onReorder={commit} className="space-y-2">
        {items.map((item, index) => (
          <Row
            key={item.id}
            item={item}
            index={index}
            total={items.length}
            placeholder={placeholder}
            registerRef={(id, el) => {
              if (el) refs.current.set(id, el);
              else refs.current.delete(id);
            }}
            onText={(id, text) => commit(items.map((i) => (i.id === id ? { ...i, text } : i)))}
            onRemove={(id) => commit(items.filter((i) => i.id !== id))}
            onEnter={(id) => insertAfter(id, [""])}
            onBackspaceEmpty={(id) => {
              const at = items.findIndex((i) => i.id === id);
              commit(items.filter((i) => i.id !== id));
              const prev = items[at - 1];
              if (prev) setFocusId(prev.id);
            }}
            onPasteLines={(id, lines) => {
              const at = items.findIndex((i) => i.id === id);
              const current = items[at];
              const rest: Item[] = current && current.text !== "" ? [current] : [];
              const fresh = lines.map((text) => ({ id: newId(), text }));
              const next = [...items.slice(0, at), ...rest, ...fresh, ...items.slice(at + 1)];
              commit(next);
            }}
            onMove={(id, dir) => {
              const at = items.findIndex((i) => i.id === id);
              const to = at + dir;
              if (to < 0 || to >= items.length) return;
              const next = [...items];
              [next[at], next[to]] = [next[to], next[at]];
              commit(next);
            }}
          />
        ))}
      </Reorder.Group>
      <button
        type="button"
        onClick={() => insertAfter(null, [""])}
        className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <Plus className="w-4 h-4" /> {addLabel}
      </button>
    </div>
  );
}
