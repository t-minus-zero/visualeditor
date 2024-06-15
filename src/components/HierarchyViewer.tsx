import { createSignal } from 'solid-js';
import type { ElementNode } from '../models/ElementNode';

const HierarchyViewer = () => {
  const [elements, setElements] = createSignal<ElementNode[]>([
    {
      id: '1',
      tag: 'div',
      children: [
        { id: '2', tag: 'h1', children: [] },
        { id: '3', tag: 'p', children: [] }
      ],
    },
  ]);
  const [selectedId, setSelectedId] = createSignal<string | null>(null);
  const [draggingId, setDraggingId] = createSignal<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleDragStart = (e: DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5'; // Make the element being dragged transparent
  };

  const handleDragOver = (event: DragEvent, id: string) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: DragEvent, parentId: string) => {
    event.preventDefault();
    const droppedId = draggingId();
    setDraggingId(null);

    if (droppedId && droppedId !== parentId) {
      const newElements = moveElement(elements(), droppedId, parentId);
      setElements(newElements);
    }
  };

  const handleDragEnd = (e: DragEvent) => {
    setDraggingId(null);
    e.currentTarget.style.opacity = ''; // Reset the opacity when the drag ends
  };

  const renderElements = (nodes: ElementNode[], parentId: string = '') => nodes.map(node => (
    <div
      draggable
      onDragStart={(e) => { e.stopPropagation(); handleDragStart(e, node.id); }}
      onDragOver={(e) => { e.stopPropagation(); handleDragOver(e, node.id); }}
      onDrop={(e) => { e.stopPropagation(); handleDrop(e, node.id); }}
      onDragEnd={(e) => { e.stopPropagation(); handleDragEnd(e); }}
      class={`ml-4 ${draggingId() && draggingId() !== node.id ? 'border border-blue-500' : ''}`}
    >
      <div
        class={`p-2 mt-2 rounded cursor-pointer ${selectedId() === node.id ? 'bg-blue-100' : 'bg-gray-700'}`}
        onclick={() => handleSelect(node.id)}
      >
        <p class="">{node.tag.toUpperCase()}</p>
      </div>
      {node.children.length > 0 && <div>{renderElements(node.children, node.id)}</div>}
    </div>
  ));
  

  return (
    <div class="absolute left-0 top-0 h-full w-80 bg-gray-800 text-white p-4 overflow-auto">
      <h2>Hierarchy of DIVs</h2>
      <div>{renderElements(elements())}</div>
    </div>
  );
};

export default HierarchyViewer;

function moveElement(elements: ElementNode[], droppedId: string, newParentId: string): ElementNode[] {
    let newElements = [...elements];  // Clone to prevent direct mutation
    let droppedNode: ElementNode | null = null;
  
    // Remove the node from its current position
    function removeNode(nodes: ElementNode[], id: string): ElementNode[] {
      return nodes.filter(node => {
        if (node.id === id) {
          droppedNode = node;
          return false;
        }
        node.children = removeNode(node.children, id);
        return true;
      });
    }
  
    newElements = removeNode(newElements, droppedId);
  
    // Function to insert the node into its new parent
    function insertNode(nodes: ElementNode[], parentId: string): ElementNode[] {
      return nodes.map(node => {
        if (node.id === parentId && droppedNode) {
          node.children = [...node.children, droppedNode];
        }
        node.children = insertNode(node.children, parentId);
        return node;
      });
    }
  
    if (droppedNode) {
      newElements = insertNode(newElements, newParentId);
    }
  
    return newElements;
  }
  
