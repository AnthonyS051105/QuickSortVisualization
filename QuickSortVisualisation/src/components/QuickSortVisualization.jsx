import React, { useState, useEffect } from "react";
import "./QuickSortVisualization.css"; // Import file CSS

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

  // Render komponen
  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Visualisasi Quick Sort</h2>
      <div className="text-lg mb-2">Array: [2, 6, 5, 3, 8, 7, 1, 0]</div>

      {/* Visualisasi array */}
      <div className="mb-4 w-full max-w-2xl">
        <div className="flex justify-center mb-2">
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
                  w-12 h-12 m-1 rounded-md
                  text-white font-bold text-lg
                  ${
                    isPivot
                      ? "bg-red-500"
                      : isComparing
                      ? "bg-yellow-500"
                      : isSwapping
                      ? "bg-purple-500"
                      : "bg-blue-500"
                  }
                  transition-all duration-300
                `}
                >
                  {value}
                </div>
              );
            })}
        </div>

        {/* Indikator */}
        <div className="flex justify-between mb-4">
          <div>
            Langkah: {currentStep + 1} / {steps.length}
          </div>
          <div>Kecepatan: {speed}ms</div>
        </div>

        {/* Keterangan */}
        <div className="bg-white p-4 rounded-md mb-4">
          <p className="text-lg">
            {steps.length > 0 ? steps[currentStep].message : ""}
          </p>
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
            <span>Pivot</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-sm mr-2"></div>
            <span>Membandingkan</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-sm mr-2"></div>
            <span>Menukar</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-sm mr-2"></div>
            <span>Elemen Biasa</span>
          </div>
        </div>
      </div>

      {/* Kontrol */}
      <div className="flex flex-col items-center mb-4 w-full max-w-md">
        <div className="flex justify-between w-full mb-2">
          <button onClick={handleReset} className="btn btn-reset">
            Reset
          </button>
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`btn btn-nav ${currentStep === 0 ? "btn-disabled" : ""}`}
          >
            Sebelumnya
          </button>
          <button onClick={handlePlayPause} className="btn btn-play">
            {isPlaying ? "Jeda" : "Putar"}
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className={`btn btn-nav ${
              currentStep === steps.length - 1 ? "btn-disabled" : ""
            }`}
          >
            Berikutnya
          </button>
        </div>

        <div className="slider-container">
          <span className="mr-2">Lambat</span>
          <input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={speed}
            onChange={handleSpeedChange}
            className="w-full"
          />
          <span className="ml-2">Cepat</span>
        </div>
      </div>
    </div>
  );
};

export default QuickSortVisualization;
