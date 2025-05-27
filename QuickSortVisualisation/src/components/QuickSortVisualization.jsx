import React, { useState, useEffect } from "react";

const QuickSortVisualization = () => {
  // State untuk menyimpan langkah-langkah dari algoritma quicksort
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000); // kecepatan dalam milidetik
  const [isPlaying, setIsPlaying] = useState(false);
  const [originalArray] = useState([2, 6, 5, 3, 8, 7, 1, 0]);

  // Fungsi untuk membuat langkah-langkah quicksort
  useEffect(() => {
    const stepsArray = [];
    const array = [...originalArray];

    // Tambahkan array awal sebagai langkah pertama
    stepsArray.push({
      array: [...array],
      message: "Array awal",
      pivot: null,
      left: null,
      right: null,
      partitionIndex: null,
    });

    // Panggil quicksort
    quickSort(array, 0, array.length - 1, stepsArray);

    // Tambahkan langkah terakhir
    stepsArray.push({
      array: [...array],
      message: "Array telah diurutkan",
      pivot: null,
      left: null,
      right: null,
      partitionIndex: null,
    });

    setSteps(stepsArray);
  }, [originalArray]);

  // Fungsi utama quicksort
  const quickSort = (array, low, high, stepsArray) => {
    if (low < high) {
      // Partisi array dan dapatkan indeks pivot
      const pivotIndex = partition(array, low, high, stepsArray);

      // Rekursif untuk sub-array kiri
      quickSort(array, low, pivotIndex - 1, stepsArray);

      // Rekursif untuk sub-array kanan
      quickSort(array, pivotIndex + 1, high, stepsArray);
    }
  };

  // Fungsi partisi
  const partition = (array, low, high, stepsArray) => {
    // Pilih elemen terakhir sebagai pivot
    const pivot = array[high];

    // Tambahkan langkah pemilihan pivot
    stepsArray.push({
      array: [...array],
      message: `Pilih pivot: ${pivot}`,
      pivot: high,
      left: low,
      right: high,
      partitionIndex: null,
    });

    // Indeks elemen yang lebih kecil
    let i = low - 1;

    for (let j = low; j < high; j++) {
      // Tambahkan langkah perbandingan
      stepsArray.push({
        array: [...array],
        message: `Bandingkan elemen ${array[j]} dengan pivot ${pivot}`,
        pivot: high,
        left: low,
        right: high,
        partitionIndex: i + 1,
        comparing: j,
      });

      // Jika elemen saat ini lebih kecil dari pivot
      if (array[j] < pivot) {
        i++;

        // Tukar elemen
        if (i !== j) {
          stepsArray.push({
            array: [...array],
            message: `Tukar elemen ${array[i]} dengan ${array[j]}`,
            pivot: high,
            left: low,
            right: high,
            partitionIndex: i,
            swapping: [i, j],
          });

          [array[i], array[j]] = [array[j], array[i]];

          stepsArray.push({
            array: [...array],
            message: `Setelah penukaran`,
            pivot: high,
            left: low,
            right: high,
            partitionIndex: i,
          });
        }
      }
    }

    // Tukar pivot dengan elemen di i+1
    stepsArray.push({
      array: [...array],
      message: `Tukar pivot ${array[high]} dengan elemen ${array[i + 1]}`,
      pivot: high,
      left: low,
      right: high,
      partitionIndex: i + 1,
      swapping: [i + 1, high],
    });

    [array[i + 1], array[high]] = [array[high], array[i + 1]];

    stepsArray.push({
      array: [...array],
      message: `Pivot ${pivot} sekarang berada di posisi yang benar`,
      pivot: i + 1,
      left: low,
      right: high,
      partitionIndex: i + 1,
    });

    return i + 1;
  };

  // Efek untuk autoplay
  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep((prevStep) => prevStep + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps, speed]);

  // Handler untuk tombol navigasi
  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleSpeedChange = (e) => {
    setSpeed(parseInt(e.target.value));
  };

  // Render komponen dengan full screen layout
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500 py-4 flex-shrink-0">
        <div className="w-full px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-1">
            Visualisasi Quick Sort
          </h1>
          <p className="text-center text-gray-600 text-base md:text-lg">
            Array: [2, 6, 5, 3, 8, 7, 1, 0]
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-6 py-4 flex flex-col justify-center overflow-y-auto">
        {/* Array Visualization */}
        <div className="mb-4">
          <div className="flex justify-center items-center mb-4 flex-wrap gap-2 px-2">
            {steps.length > 0 &&
              steps[currentStep].array.map((value, index) => {
                const step = steps[currentStep];
                const isPivot = index === step.pivot;
                const isComparing = index === step.comparing;
                const isSwapping =
                  step.swapping &&
                  (index === step.swapping[0] || index === step.swapping[1]);

                return (
                  <div
                    key={index}
                    className={`
                    flex items-center justify-center
                    w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20
                    rounded-lg shadow-lg
                    text-white font-bold text-lg md:text-xl lg:text-2xl
                    transform transition-all duration-500 ease-in-out
                    ${
                      isPivot
                        ? "bg-gradient-to-br from-red-500 to-red-600 scale-110 shadow-red-300"
                        : isComparing
                        ? "bg-gradient-to-br from-yellow-500 to-yellow-600 scale-105 shadow-yellow-300"
                        : isSwapping
                        ? "bg-gradient-to-br from-purple-500 to-purple-600 scale-105 shadow-purple-300 animate-pulse"
                        : "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-300"
                    }
                    hover:scale-105
                  `}
                  >
                    {value}
                  </div>
                );
              })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4 mx-auto max-w-4xl">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            ></div>
          </div>

          {/* Step Info */}
          <div className="flex justify-between items-center mb-4 text-base md:text-lg max-w-4xl mx-auto">
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="font-semibold text-gray-700">
                Langkah: {currentStep + 1} / {steps.length}
              </span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="font-semibold text-gray-700">
                Kecepatan: {speed}ms
              </span>
            </div>
          </div>
        </div>

        {/* Message Box */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 border-l-4 border-blue-500 max-w-4xl mx-auto">
          <p className="text-lg md:text-xl text-center text-gray-800 font-medium">
            {steps.length > 0 ? steps[currentStep].message : "Memuat..."}
          </p>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 max-w-4xl mx-auto">
          <h3 className="text-lg font-bold text-center mb-3 text-gray-800">
            Keterangan Warna
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="flex items-center justify-center p-2 bg-gray-50 rounded-md">
              <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-md mr-2 shadow"></div>
              <span className="font-medium text-gray-700 text-sm">Pivot</span>
            </div>
            <div className="flex items-center justify-center p-2 bg-gray-50 rounded-md">
              <div className="w-4 h-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-md mr-2 shadow"></div>
              <span className="font-medium text-gray-700 text-sm">
                Membandingkan
              </span>
            </div>
            <div className="flex items-center justify-center p-2 bg-gray-50 rounded-md">
              <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-md mr-2 shadow"></div>
              <span className="font-medium text-gray-700 text-sm">Menukar</span>
            </div>
            <div className="flex items-center justify-center p-2 bg-gray-50 rounded-md">
              <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md mr-2 shadow"></div>
              <span className="font-medium text-gray-700 text-sm">
                Elemen Biasa
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <div className="flex justify-center gap-2 mb-4 flex-wrap">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-black rounded-md font-semibold hover:bg-gray-600 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
            >
              🔄 Reset
            </button>
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-md font-semibold transition-all shadow-md transform text-sm ${
                currentStep === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-black hover:bg-blue-600 hover:shadow-lg hover:scale-105"
              }`}
            >
              ⬅️ Sebelumnya
            </button>
            <button
              onClick={handlePlayPause}
              className="px-6 py-2 bg-green-500 text-black rounded-md font-semibold hover:bg-green-600 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
            >
              {isPlaying ? "⏸️ Jeda" : "▶️ Putar"}
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className={`px-4 py-2 rounded-md font-semibold transition-all shadow-md transform text-sm ${
                currentStep === steps.length - 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-black hover:bg-blue-600 hover:shadow-lg hover:scale-105"
              }`}
            >
              Berikutnya ➡️
            </button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-gray-700 font-medium text-sm">🐌 Lambat</span>
            <input
              type="range"
              min="200"
              max="2000"
              step="100"
              value={speed}
              onChange={handleSpeedChange}
              className="flex-1 max-w-xs h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                  ((2000 - speed) / 1800) * 100
                }%, #e5e7eb ${((2000 - speed) / 1800) * 100}%, #e5e7eb 100%)`,
              }}
            />
            <span className="text-gray-700 font-medium text-sm">🐰 Cepat</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-2 flex-shrink-0">
        <div className="w-full px-6 text-center text-gray-600 text-sm">
          <p>© 2024 Quick Sort Visualization - Interactive Learning Tool</p>
        </div>
      </footer>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default QuickSortVisualization;
