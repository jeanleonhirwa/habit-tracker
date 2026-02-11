import { useState, useRef, useCallback } from 'react';

interface DragState {
  isDragging: boolean;
  draggedIndex: number | null;
  targetIndex: number | null;
}

interface UseDragReorderOptions<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  getItemId: (item: T) => string;
}

export function useDragReorder<T>({ items, onReorder, getItemId }: UseDragReorderOptions<T>) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedIndex: null,
    targetIndex: null,
  });

  const draggedItemRef = useRef<T | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const handleDragStart = useCallback((index: number, event: React.DragEvent | React.TouchEvent) => {
    draggedItemRef.current = items[index];
    
    setDragState({
      isDragging: true,
      draggedIndex: index,
      targetIndex: index,
    });

    // For native drag events
    if ('dataTransfer' in event) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', index.toString());
      
      // Make the drag image slightly transparent
      const target = event.currentTarget as HTMLElement;
      if (target) {
        event.dataTransfer.setDragImage(target, 0, 0);
      }
    }
  }, [items]);

  const handleDragOver = useCallback((index: number, event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    if (dragState.targetIndex !== index) {
      setDragState(prev => ({
        ...prev,
        targetIndex: index,
      }));
    }
  }, [dragState.targetIndex]);

  const handleDragEnd = useCallback(() => {
    if (dragState.draggedIndex !== null && dragState.targetIndex !== null && 
        dragState.draggedIndex !== dragState.targetIndex) {
      const newItems = [...items];
      const [draggedItem] = newItems.splice(dragState.draggedIndex, 1);
      newItems.splice(dragState.targetIndex, 0, draggedItem);
      onReorder(newItems);
    }

    setDragState({
      isDragging: false,
      draggedIndex: null,
      targetIndex: null,
    });
    draggedItemRef.current = null;
  }, [dragState, items, onReorder]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    handleDragEnd();
  }, [handleDragEnd]);

  // Touch handlers for mobile
  const touchStartY = useRef<number>(0);
  const touchCurrentIndex = useRef<number | null>(null);

  const handleTouchStart = useCallback((index: number, event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStartY.current = touch.clientY;
    touchCurrentIndex.current = index;
    draggedItemRef.current = items[index];
    
    // Delay to distinguish from scroll
    setTimeout(() => {
      if (touchCurrentIndex.current === index) {
        setDragState({
          isDragging: true,
          draggedIndex: index,
          targetIndex: index,
        });
      }
    }, 200);
  }, [items]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (!dragState.isDragging || dragState.draggedIndex === null) return;

    const touch = event.touches[0];
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    
    // Find the draggable item under the touch point
    for (const el of elements) {
      const indexAttr = el.getAttribute('data-drag-index');
      if (indexAttr !== null) {
        const newIndex = parseInt(indexAttr, 10);
        if (newIndex !== dragState.targetIndex) {
          setDragState(prev => ({
            ...prev,
            targetIndex: newIndex,
          }));
        }
        break;
      }
    }
  }, [dragState.isDragging, dragState.draggedIndex, dragState.targetIndex]);

  const handleTouchEnd = useCallback(() => {
    touchCurrentIndex.current = null;
    handleDragEnd();
  }, [handleDragEnd]);

  const getDragHandleProps = useCallback((index: number) => ({
    draggable: true,
    'data-drag-index': index,
    onDragStart: (e: React.DragEvent) => handleDragStart(index, e),
    onDragOver: (e: React.DragEvent) => handleDragOver(index, e),
    onDragEnd: handleDragEnd,
    onDrop: handleDrop,
    onTouchStart: (e: React.TouchEvent) => handleTouchStart(index, e),
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  }), [handleDragStart, handleDragOver, handleDragEnd, handleDrop, handleTouchStart, handleTouchMove, handleTouchEnd]);

  const getItemStyle = useCallback((index: number): React.CSSProperties => {
    if (!dragState.isDragging) return {};

    if (index === dragState.draggedIndex) {
      return {
        opacity: 0.5,
        transform: 'scale(1.02)',
      };
    }

    if (dragState.targetIndex !== null && dragState.draggedIndex !== null) {
      if (dragState.draggedIndex < dragState.targetIndex) {
        // Dragging down
        if (index > dragState.draggedIndex && index <= dragState.targetIndex) {
          return { transform: 'translateY(-100%)' };
        }
      } else {
        // Dragging up
        if (index < dragState.draggedIndex && index >= dragState.targetIndex) {
          return { transform: 'translateY(100%)' };
        }
      }
    }

    return {};
  }, [dragState]);

  return {
    dragState,
    getDragHandleProps,
    getItemStyle,
    containerRef,
  };
}
