import Viewport from './components/Viewport';
import HierarchyViewer from './components/HierarchyViewer';
import CssEditor from './components/CssEditor';

function App() {
  return (
    <div class="relative min-h-screen bg-gray-100">
      <HierarchyViewer />
      <Viewport />
      <CssEditor />
    </div>
  );
}

export default App
