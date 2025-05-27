import React from "react";
import QuickSortVisualization from "./components/QuickSortVisualization.jsx";
// Jika tidak menggunakan folder components: import QuickSortVisualization from './QuickSortVisualization';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          Algoritma Quick Sort
        </h1>
        <QuickSortVisualization />
      </div>
    </div>
  );
}

export default App;
