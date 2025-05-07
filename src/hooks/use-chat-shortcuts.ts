import { useEffect } from 'react';
import { message } from 'antd';

interface ShortcutConfig {
  onSend: () => void;
  onClear: () => void;
}

export function useChatShortcuts({ onSend, onClear }: ShortcutConfig) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter 发送消息 
if (e.key === 'Enter' && !e.shiftKey) {
  e.preventDefault(); // 阻止默认换行行为
  onSend();
}
      // Ctrl/Cmd + K 清空对话
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSend, onClear]);
} 
