import React, { useState, useEffect } from 'react';
import { Calculator, Lightbulb, Check, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Slider } from '../components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';

const Sphere = () => {
  const [radius, setRadius] = useState(5);
  const [height, setHeight] = useState(5);
  const [calculatedRadius, setCalculatedRadius] = useState(null);
  const [calculation, setCalculation] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userInputs, setUserInputs] = useState({ step1: '', step2: '', result: '' });
  const [inputStatus, setInputStatus] = useState({ step1: null, step2: null, result: null });
  const [stepCompleted, setStepCompleted] = useState({ step1: false, step2: false, result: false });
  const [shape, setShape] = useState(null);
  const [isCustomShape, setIsCustomShape] = useState(true);
  const [customShape, setCustomShape] = useState({
    name: '',
    formula: '',
    description: ''
  });
  const [placedShapes, setPlacedShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const minRadius = 1;
  const maxRadius = 10;
  const scaleFactor = 25;
  const [highlightedBlock, setHighlightedBlock] = useState(null);
  const [blockCalculations, setBlockCalculations] = useState({
    bottomBlock: null,
    topBlock: null,
    total: null,
    overlap: null
  });
  const [showCalculations, setShowCalculations] = useState(false);
  const [highlightedRect, setHighlightedRect] = useState(null);
  const [calculationStep, setCalculationStep] = useState(0);
  const [dimensionInputs, setDimensionInputs] = useState({
    bottomLength: '',
    bottomWidth: '',
    bottomHeight: '',
    topLength: '',
    topWidth: '',
    topHeight: ''
  });
  const [dimensionStatus, setDimensionStatus] = useState({
    bottomLength: null,
    bottomWidth: null,
    bottomHeight: null,
    topLength: null,
    topWidth: null,
    topHeight: null
  });
  const [dimensionsCompleted, setDimensionsCompleted] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [calculationInputs, setCalculationInputs] = useState({
    step1Result: '',
    step2Result: '',
    step3Result: '',
    finalAnswer: ''
  });
  const [calculationInputStatus, setCalculationInputStatus] = useState({
    step1Result: null,
    step2Result: null,
    step3Result: null,
    finalAnswer: null
  });
  const [calculatorDisplay, setCalculatorDisplay] = useState('0');
  const [calculatorMemory, setCalculatorMemory] = useState(null);
  const [calculatorOperation, setCalculatorOperation] = useState(null);
  const [calculatorWaitingForOperand, setCalculatorWaitingForOperand] = useState(false);
  const [calculatorExpanded, setCalculatorExpanded] = useState(false);
     const [calculatorPosition, setCalculatorPosition] = useState({ x: 700, y: 275 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [focusedCalcBlock, setFocusedCalcBlock] = useState(null); // 'bottom' | 'top' | null
  const [focusedStep3, setFocusedStep3] = useState(false);
  const [faceInputsVisible, setFaceInputsVisible] = useState(false);
  const [currentFace, setCurrentFace] = useState(1); // 1 or 2 for now
  const [faceInputs, setFaceInputs] = useState({ 1: '', 2: '' });
  const [faceStatuses, setFaceStatuses] = useState({ 1: null, 2: null }); // 'correct' | 'incorrect' | null
  // Highlight for Face-by-Face workflow
  const [focusedFace1, setFocusedFace1] = useState(false);
  // Highlight for Face 2 (backwards L side)
  const [focusedFace2, setFocusedFace2] = useState(false);

  const shapeLibrary = [
    { id: 'circle', name: 'Circle', svg: '○', formula: 'πr²' },
    { id: 'square', name: 'Square', svg: '□', formula: 's²' },
    { id: 'triangle', name: 'Triangle', svg: '△', formula: '½bh' },
    { id: 'rectangle', name: 'Rectangle', svg: '▭', formula: 'lw' },
    { id: 'hexagon', name: 'Hexagon', svg: '⬡', formula: '3√3s²/2' },
    { id: 'pentagon', name: 'Pentagon', svg: '⬠', formula: '5s²/4' }
  ];

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Proxima Nova';
        src: url('/fonts/ProximaNova-Regular.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
      }
      /* Apply Proxima Nova globally */
      html, body, input, button, select, textarea, label, span, p, h1, h2, h3, h4, h5, h6 {
        font-family: 'Proxima Nova', sans-serif !important;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .calculation-line {
        opacity: 0;
        animation: fadeIn 0.5s ease-in forwards;
      }
      @keyframes typing {
        from { width: 0 }
        to { width: 100% }
      }
      .typing-animation {
        overflow: hidden;
        white-space: nowrap;
        width: 0;
        animation: typing 1s steps(40, end) forwards;
        font-family: 'Proxima Nova', sans-serif;
      }
      .calculation-text {
        font-family: 'Proxima Nova', sans-serif;
      }
      .orbit-glow-btn {
        position: relative;
        background: #008542;
        border: none;
        border-radius: 20px;
        color: white;
        font-weight: bold;
        font-size: 1rem;
        padding: 0 18px;
        height: 40px;
        z-index: 1;
        overflow: visible;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: box-shadow 0.2s;
        white-space: nowrap;
      }
      .orbit-glow-btn:active {
        box-shadow: 0 0 0 2px #00ffb2;
      }
      .orbit-glow-underline {
        position: absolute;
        left: 10%;
        right: 10%;
        bottom: 6px;
        height: 4px;
        border-radius: 2px;
        background: linear-gradient(90deg, #00ffb2, #00ffb2 60%, transparent 100%);
        filter: blur(1px);
        z-index: 1;
        animation: orbit-glow-underline 1.2s infinite alternate;
      }
      @keyframes orbit-glow-underline {
        0% { width: 80%; opacity: 1; left: 10%; right: 10%; }
        100% { width: 100%; opacity: 0.7; left: 0; right: 0; }
      }
      .shape-switch-btn {
        background: #f3f4f6;
        color: #008542;
        border: 1.5px solid black;
        border-radius: 8px;
        padding: 8px 18px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s, color 0.2s, border-color 0.2s;
      }
      .shape-switch-btn:hover, .shape-switch-btn:focus {
        background: #008542;
        color: #fff;
        border-color: #008542;
      }
      .shape-switch-btn.active {
        background: #008542;
        color: #fff;
        border-color: #008542;
      }
      /* Remove number input arrows */
      input[type="number"]::-webkit-outer-spin-button,
      input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const calculateSurfaceArea = () => {
    let step1, step2, result;
    
    if (shape === 'sphere') {
      step1 = 4 * Math.PI;
      step2 = radius * radius;
      result = step1 * step2;
    } else if (shape === 'cylinder') {
      step1 = 2 * Math.PI * radius * radius; // top and bottom circles
      step2 = 2 * Math.PI * radius * height; // lateral surface
      result = step1 + step2;
    } else if (shape === 'hemisphere') {
      step1 = 2 * Math.PI;
      step2 = radius * radius;
      result = step1 * step2;
    } else if (shape === 'cube') {
      step1 = 6; // number of faces
      step2 = radius * radius; // area of one face
      result = step1 * step2;
    }

    setCalculation({
      step1: step1.toFixed(4),
      step1Approx: (shape === 'sphere' ? 4 * 3.14 : shape === 'cylinder' ? 2 * 3.14 : 2 * 3.14).toFixed(4),
      step2: step2.toFixed(4),
      result: result.toFixed(4),
      resultApprox: (shape === 'sphere' ? 4 * 3.14 * step2 : shape === 'cylinder' ? (2 * 3.14 * radius * radius) + (2 * 3.14 * radius * height) : 2 * 3.14 * step2).toFixed(4)
    });
    setCalculatedRadius(radius);
    setCurrentStepIndex(0);
    setUserInputs({ step1: '', step2: '', result: '' });
    setInputStatus({ step1: null, step2: null, result: null });
    setStepCompleted({ step1: false, step2: false, result: false });
  };

  const calculateStairStepSurfaceArea = () => {
    // Bottom block: 7cm x 3cm x 1cm
    const bottomLength = 7;
    const bottomWidth = 3;
    const bottomHeight = 1;
    
    // Top block: 7cm x 2cm x 4cm
    const topLength = 7;
    const topWidth = 2;
    const topHeight = 4;
    
    // Calculate surface areas
    const bottomBlockSA = 2 * (bottomLength * bottomWidth + bottomLength * bottomHeight + bottomWidth * bottomHeight);
    const topBlockSA = 2 * (topLength * topWidth + topLength * topHeight + topWidth * topHeight);
    
    // No overlap subtraction
    const totalSA = bottomBlockSA + topBlockSA;
    
    setBlockCalculations({
      bottomBlock: bottomBlockSA.toFixed(2),
      topBlock: topBlockSA.toFixed(2),
      total: totalSA.toFixed(2),
      overlap: '0.00'
    });
    setShowCalculations(true);
    setCalculationStep(0);
  };

  const sphereSize = (radius - minRadius + 1) * scaleFactor;

  const renderShape = () => {
    const extraSpace = radius <= 2 ? 1.5 : 0;
    const maxTranslation = radius === 10 ? 0.7 : (radius >= 8.5 ? 0.75 : 1);
    const cubeTranslation = radius >= 7 ? 0.5 : 1;
    const cubeScaleFactor = radius >= 7 ? 15 : 25;
    const translation = calculation ? `-${(sphereSize * (shape === 'cube' ? cubeTranslation : Math.min(1 + radius/10 + extraSpace, maxTranslation)))}px` : '0px';
    if (shape === 'sphere') {
      return (
        <div className="relative flex items-center justify-center w-full h-64">
          <svg 
            width={sphereSize * 2} 
            height={sphereSize} 
            viewBox={`0 0 ${sphereSize * 2} ${sphereSize}`}
            style={{ overflow: 'visible', transform: `translateX(${translation})` }}
            className="sphere-container transition-all duration-500"
          >
            <g transform={`translate(${sphereSize/2}, 0)`}>
              <circle
                cx={sphereSize/2}
                cy={sphereSize / 2}
                r={sphereSize / 2 - 1}
                fill="none"
                stroke="#008542"
                strokeWidth="2"
              />
              <path
                d={`M ${sphereSize/2 - sphereSize/2},${sphereSize / 2} C ${sphereSize/2 - sphereSize/2 + sphereSize/10},${sphereSize / 3} ${sphereSize/2 + sphereSize/2 - sphereSize/10},${sphereSize / 3} ${sphereSize/2 + sphereSize/2},${sphereSize / 2}`}
                fill="none"
                stroke="#008542"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <path
                d={`M ${sphereSize/2 - sphereSize/2},${sphereSize / 2} C ${sphereSize/2 - sphereSize/2 + sphereSize/10},${2 * sphereSize / 3} ${sphereSize/2 + sphereSize/2 - sphereSize/10},${2 * sphereSize / 3} ${sphereSize/2 + sphereSize/2},${sphereSize / 2}`}
                fill="none"
                stroke="#008542"
                strokeWidth="2"
              />
              <circle
                cx={sphereSize/2}
                cy={sphereSize / 2}
                r="3"
                fill="red"
              />
              <line
                x1={sphereSize/2}
                y1={sphereSize / 2}
                x2={sphereSize/2 + sphereSize/2}
                y2={sphereSize / 2}
                stroke="#008542"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <text
                x={sphereSize/2 + sphereSize/4}
                y={sphereSize / 2 - 10}
                fill="#008542"
                fontSize="14"
                textAnchor="middle"
              >
                r
              </text>
            </g>
          </svg>
        </div>
      );
    } else if (shape === 'cylinder') {
      // Cylinder SVG with radius line and label
      return (
        <div className="relative flex items-center justify-center w-full h-64">
          <svg width={sphereSize * 2} height={sphereSize} viewBox={`0 0 ${sphereSize * 2} ${sphereSize}`} style={{ overflow: 'visible', transform: `translateX(${translation})` }}>
            {/* Full top ellipse for cylinder integrity */}
            <ellipse cx={sphereSize} cy={sphereSize / 6} rx={sphereSize / 2} ry={sphereSize / 6} fill="none" stroke="#008542" strokeWidth="2" />
            {/* Body (no top edge) */}
            <path d={`M ${sphereSize / 2},${sphereSize / 6} L ${sphereSize / 2},${sphereSize * 5 / 6} L ${sphereSize * 3 / 2},${sphereSize * 5 / 6} L ${sphereSize * 3 / 2},${sphereSize / 6}`} fill="none" stroke="#008542" strokeWidth="2" />
            {/* Bottom ellipse */}
            <ellipse cx={sphereSize} cy={sphereSize * 5 / 6} rx={sphereSize / 2} ry={sphereSize / 6} fill="none" stroke="#008542" strokeWidth="2" />
            {/* Full radius line (dotted, drawn last for visibility) */}
            <line
              x1={sphereSize}
              y1={sphereSize / 6}
              x2={sphereSize + sphereSize / 2}
              y2={sphereSize / 6}
              stroke="#008542"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            {/* Radius label */}
            <text
              x={sphereSize + sphereSize / 4}
              y={sphereSize / 6 - 10}
              fill="#008542"
              fontSize="14"
              textAnchor="middle"
            >
              r
            </text>
            {/* Height line (dashed, centered) */}
            <line
              x1={sphereSize}
              y1={sphereSize / 6}
              x2={sphereSize}
              y2={sphereSize * 5 / 6}
              stroke="#008542"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            {/* Height label */}
            <text
              x={sphereSize + 10}
              y={sphereSize / 2}
              fill="#008542"
              fontSize="14"
              textAnchor="middle"
            >
              h
            </text>
            {/* Dot at radius-height intersection */}
            <circle
              cx={sphereSize}
              cy={sphereSize / 6}
              r="3"
              fill="red"
            />
          </svg>
        </div>
      );
    } else if (shape === 'hemisphere') {
      // Rectangular Prism SVG (not a cube)
      // Use the same scaling logic as the cube, but decrease the scale so it fits
      const prismScaleFactor = scaleFactor * 0.45;
      const prismLength = (radius - minRadius + 1) * 2.0 * prismScaleFactor;
      const prismWidth = (radius - minRadius + 1) * 0.6 * prismScaleFactor;
      const prismHeight = (radius - minRadius + 1) * 0.4 * prismScaleFactor;
      const prismDepth = (radius - minRadius + 1) * 0.5 * prismScaleFactor;
      const x = 60;
      const y = 40;
      const svgWidth = prismLength + prismDepth + 80;
      const svgHeight = prismHeight + prismDepth + 80;
      // Add translation animation like other shapes
      const extraSpace = radius <= 2 ? 1.5 : 0;
      const maxTranslation = radius === 10 ? 0.7 : (radius >= 8.5 ? 0.75 : 1);
      const translation = calculation ? `-${(prismLength * Math.min(1 + radius/10 + extraSpace, maxTranslation))}px` : '0px';
      return (
        <div className="relative flex items-center justify-center w-full h-64">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ overflow: 'visible', transform: `translateX(${translation})` }} className="sphere-container transition-all duration-500">
            {/* Front face */}
            <rect x={x} y={y + prismDepth} width={prismLength} height={prismHeight} fill="none" stroke="#008542" strokeWidth="2" />
            {/* Top face */}
            <polygon points={`
              ${x},${y + prismDepth}
              ${x + prismDepth},${y}
              ${x + prismLength + prismDepth},${y}
              ${x + prismLength},${y + prismDepth}
            `} fill="none" stroke="#008542" strokeWidth="2" />
            {/* Side face */}
            <polygon points={`
              ${x + prismLength},${y + prismDepth}
              ${x + prismLength + prismDepth},${y}
              ${x + prismLength + prismDepth},${y + prismHeight}
              ${x + prismLength},${y + prismHeight + prismDepth}
            `} fill="none" stroke="#008542" strokeWidth="2" />
            {/* Vertical lines for depth */}
            <line x1={x} y1={y + prismDepth} x2={x + prismDepth} y2={y} stroke="#008542" strokeWidth="2" />
            <line x1={x + prismLength} y1={y + prismDepth} x2={x + prismLength + prismDepth} y2={y} stroke="#008542" strokeWidth="2" />
            <line x1={x + prismLength} y1={y + prismHeight + prismDepth} x2={x + prismLength + prismDepth} y2={y + prismHeight} stroke="#008542" strokeWidth="2" />
            <line x1={x} y1={y + prismHeight + prismDepth} x2={x + prismDepth} y2={y + prismHeight} stroke="#008542" strokeWidth="2" />
            {/* Back face (dashed) */}
            <rect x={x + prismDepth} y={y} width={prismLength} height={prismHeight} fill="none" stroke="#008542" strokeWidth="2" strokeDasharray="5,5" />
            {/* Length line (dashed) */}
            <line 
              x1={x} 
              y1={y + prismDepth + prismHeight/2} 
              x2={x + prismLength} 
              y2={y + prismDepth + prismHeight/2} 
              stroke="#008542" 
              strokeWidth="2" 
              strokeDasharray="5,5" 
            />
            {/* Length label */}
            <text
              x={x + prismLength/2}
              y={y + prismDepth + prismHeight/2 - Math.max(15, prismLength/4)}
              dominantBaseline="bottom"
              textAnchor="middle"
              fill="#008542"
              fontSize="14"
            >
              l
            </text>
          </svg>
        </div>
      );
    } else if (shape === 'cube') {
      const cubeSize = (radius - minRadius + 1) * (shape === 'cube' && radius >= 7 ? cubeScaleFactor : scaleFactor);
      return (
        <div className="relative flex items-center justify-center w-full h-64">
          <svg width={cubeSize * 2} height={cubeSize} viewBox={`0 0 ${cubeSize * 2} ${cubeSize}`} style={{ overflow: 'visible', transform: `translateX(${translation})` }}>
            {/* Back face (dashed) */}
            <path
              d={`M ${cubeSize/2 - cubeSize/4},${cubeSize/8} L ${cubeSize/2 - cubeSize/4},${cubeSize*9/8} L ${cubeSize/2 + cubeSize*3/4},${cubeSize*9/8} L ${cubeSize/2 + cubeSize*3/4},${cubeSize/8} Z`}
              fill="none"
              stroke="#008542"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            {/* Bottom face (dashed) */}
            <path
              d={`M ${cubeSize/2},${cubeSize*5/4} L ${cubeSize/2 - cubeSize/4},${cubeSize*9/8} L ${cubeSize/2 + cubeSize*3/4},${cubeSize*9/8} L ${cubeSize/2 + cubeSize},${cubeSize*5/4}`}
              fill="none"
              stroke="#008542"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            {/* Front face */}
            <rect
              x={cubeSize/2}
              y={cubeSize/4}
              width={cubeSize}
              height={cubeSize}
              fill="none"
              stroke="#008542"
              strokeWidth="2"
            />
            {/* Top face */}
            <path
              d={`M ${cubeSize/2},${cubeSize/4} L ${cubeSize/2 - cubeSize/4},${cubeSize/8} L ${cubeSize/2 + cubeSize*3/4},${cubeSize/8} L ${cubeSize/2 + cubeSize},${cubeSize/4}`}
              fill="none"
              stroke="#008542"
              strokeWidth="2"
            />
            {/* Right face */}
            <path
              d={`M ${cubeSize/2 + cubeSize},${cubeSize/4} L ${cubeSize/2 + cubeSize*3/4},${cubeSize/8} L ${cubeSize/2 + cubeSize*3/4},${cubeSize*9/8} L ${cubeSize/2 + cubeSize},${cubeSize*5/4}`}
              fill="none"
              stroke="#008542"
              strokeWidth="2"
            />
            {/* Left face */}
            <path
              d={`M ${cubeSize/2},${cubeSize/4} L ${cubeSize/2 - cubeSize/4},${cubeSize/8} L ${cubeSize/2 - cubeSize/4},${cubeSize*9/8} L ${cubeSize/2},${cubeSize*5/4}`}
              fill="none"
              stroke="#008542"
              strokeWidth="2"
            />
            {/* Edge length line */}
            <line
              x1={cubeSize/2}
              y1={cubeSize/4}
              x2={cubeSize/2 + cubeSize}
              y2={cubeSize/4}
              stroke="#008542"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            {/* Edge length label */}
            <text
              x={cubeSize}
              y={cubeSize/4 - 10}
              fill="#008542"
              fontSize="14"
              textAnchor="middle"
            >
              s
            </text>
          </svg>
        </div>
      );
    }
    return null;
  };

  const handleStepInputChange = (e, field) => {
    setUserInputs({ ...userInputs, [field]: e.target.value });
    setInputStatus({ ...inputStatus, [field]: null });
  };

  const checkStep = (field) => {
    let isCorrect = false;
    switch (field) {
      case 'step1':
        isCorrect = Math.abs(parseFloat(userInputs.step1) - parseFloat(calculation.step1)) < 0.01 ||
                    Math.abs(parseFloat(userInputs.step1) - parseFloat(calculation.step1Approx)) < 0.01;
        break;
      case 'step2':
        isCorrect = Math.abs(parseFloat(userInputs.step2) - parseFloat(calculation.step2)) < 0.01;
        break;
      case 'result':
        isCorrect = Math.abs(parseFloat(userInputs.result) - parseFloat(calculation.result)) < 0.01 ||
                    Math.abs(parseFloat(userInputs.result) - parseFloat(calculation.resultApprox)) < 0.01;
        break;
    }

    setInputStatus({ ...inputStatus, [field]: isCorrect ? 'correct' : 'incorrect' });
    if (isCorrect) {
      setStepCompleted({ ...stepCompleted, [field]: true });
      if (currentStepIndex < 2) {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }
  };

  const skipStep = (field) => {
    setUserInputs({ ...userInputs, [field]: calculation[field] });
    setInputStatus({ ...inputStatus, [field]: 'correct' });
    setStepCompleted({ ...stepCompleted, [field]: true });
    if (currentStepIndex < 2) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const getInputClassName = (field) => {
    let baseClass = "text-xs px-1 text-left";
    switch (inputStatus[field]) {
      case 'correct':
        return `${baseClass} border-green-500 focus:border-green-500`;
      case 'incorrect':
        return `${baseClass} border-red-500 focus:border-red-500`;
      default:
        return `${baseClass} border-gray-300 focus:border-blue-500`;
    }
  };

  const handleDragStart = (shape) => {
    setSelectedShape(shape);
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    if (selectedShape) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setPlacedShapes([...placedShapes, {
        ...selectedShape,
        id: `${selectedShape.id}-${Date.now()}`,
        position: { x, y }
      }]);
      setSelectedShape(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleShapeDelete = (shapeId) => {
    setPlacedShapes(placedShapes.filter(shape => shape.id !== shapeId));
  };

  const checkDimension = (field, expectedValue) => {
    const inputValue = parseFloat(dimensionInputs[field]);
    const isCorrect = Math.abs(inputValue - expectedValue) < 0.1;
    
    setDimensionStatus(prev => ({
      ...prev,
      [field]: isCorrect ? 'correct' : 'incorrect'
    }));

    // Check if all dimensions are correct
    const allCorrect = Object.keys(dimensionInputs).every(key => {
      const expected = key.includes('bottom') ? 
        (key.includes('Length') ? 7 : key.includes('Width') ? 3 : 1) :
        (key.includes('Length') ? 7 : key.includes('Width') ? 2 : 4);
      return Math.abs(parseFloat(dimensionInputs[key] || 0) - expected) < 0.1;
    });

    if (allCorrect) {
      setDimensionsCompleted(true);
    }
  };

  const resetDimensions = () => {
    setDimensionInputs({
      bottomLength: '',
      bottomWidth: '',
      bottomHeight: '',
      topLength: '',
      topWidth: '',
      topHeight: ''
    });
    setDimensionStatus({
      bottomLength: null,
      bottomWidth: null,
      bottomHeight: null,
      topLength: null,
      topWidth: null,
      topHeight: null
    });
    setDimensionsCompleted(false);
    setShowCalculations(false);
    setCalculationInputs({
      step1Result: '',
      step2Result: '',
      step3Result: '',
      finalAnswer: ''
    });
    setCalculationInputStatus({
      step1Result: null,
      step2Result: null,
      step3Result: null,
      finalAnswer: null
    });
  };

  const checkCalculationStep = (field, expectedValue) => {
    const inputValue = parseFloat(calculationInputs[field]);
    const isCorrect = Math.abs(inputValue - expectedValue) < 0.1;
    
    setCalculationInputStatus(prev => ({
      ...prev,
      [field]: isCorrect ? 'correct' : 'incorrect'
    }));
  };

  // Calculator functions
  const calculatorInputDigit = (digit) => {
    if (calculatorWaitingForOperand) {
      setCalculatorDisplay(String(digit));
      setCalculatorWaitingForOperand(false);
    } else {
      setCalculatorDisplay(calculatorDisplay === '0' ? String(digit) : calculatorDisplay + digit);
    }
  };

  const calculatorInputDecimal = () => {
    if (calculatorWaitingForOperand) {
      setCalculatorDisplay('0.');
      setCalculatorWaitingForOperand(false);
    } else if (calculatorDisplay.indexOf('.') === -1) {
      setCalculatorDisplay(calculatorDisplay + '.');
    }
  };

  const calculatorClear = () => {
    setCalculatorDisplay('0');
    setCalculatorMemory(null);
    setCalculatorOperation(null);
    setCalculatorWaitingForOperand(false);
  };

  const calculatorPerformOperation = (nextOperation) => {
    const inputValue = parseFloat(calculatorDisplay);

    if (calculatorMemory === null) {
      setCalculatorMemory(inputValue);
    } else if (calculatorOperation) {
      const currentValue = calculatorMemory || 0;
      const newValue = calculatorPerformCalculation(currentValue, inputValue, calculatorOperation);
      setCalculatorMemory(newValue);
      setCalculatorDisplay(String(newValue));
    }

    setCalculatorWaitingForOperand(true);
    setCalculatorOperation(nextOperation);
  };

  const calculatorPerformCalculation = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return firstValue / secondValue;
      default: return secondValue;
    }
  };

  const calculatorEquals = () => {
    if (!calculatorOperation || calculatorMemory === null) return;

    const inputValue = parseFloat(calculatorDisplay);
    const newValue = calculatorPerformCalculation(calculatorMemory, inputValue, calculatorOperation);
    setCalculatorDisplay(String(newValue));
    setCalculatorMemory(null);
    setCalculatorOperation(null);
    setCalculatorWaitingForOperand(false);
  };

  // Draggable calculator handlers
  const handleCalculatorMouseDown = (e) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleCalculatorMouseMove = (e) => {
    if (!isDragging) return;
    setCalculatorPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleCalculatorMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleCalculatorMouseMove);
      document.addEventListener('mouseup', handleCalculatorMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleCalculatorMouseMove);
        document.removeEventListener('mouseup', handleCalculatorMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Position calculator underneath the speech bubble text on You Try page 2
  useEffect(() => {
    if (isCustomShape && dimensionsCompleted && showCalculations) {
      setCalculatorPosition({ x: 700, y: 275 });
    }
  }, [isCustomShape, dimensionsCompleted, showCalculations]);

  const checkCurrentFace = () => {
    const val = parseFloat(faceInputs[currentFace]);
    const expected = currentFace === 1 ? 21 : 14; // Face1: 7x3, Face2: 7x2
    setFaceStatuses(prev => ({ ...prev, [currentFace]: (!isNaN(val) && Math.abs(val - expected) < 0.0001) ? 'correct' : 'incorrect' }));
  };

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <Card className="w-full max-w-2xl mx-auto shadow-md bg-white">
        <div style={{ padding: '24px 24px 0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 600, color: '#008542' }}>Surface Area of the 3D Staircase</span>
          </div>
          {/* Flexi mascot just below the header and above the 3D shape, only on calculations page */}
          {isCustomShape && dimensionsCompleted && showCalculations && (
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', margin: '32px 0 16px 0', paddingLeft: '15px' }}>
              <img src={import.meta.env.BASE_URL + 'Flexi_Teacher.png'} alt="Mascot teacher" style={{ width: 100, height: 'auto', display: 'block' }} />
            </div>
          )}
          {/* Flexi mascot just below the header and above the 3D shape, only on dimensions input page (You Try page 1) */}
          {isCustomShape && !showCalculations && (
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', margin: '32px 0 16px 0', paddingLeft: '15px' }}>
              <img src={import.meta.env.BASE_URL + 'Flexi_ThumbsUp.png'} alt="Mascot thumbs up" style={{ width: 100, height: 'auto', display: 'block' }} />
              <div style={{
                background: 'white',
                border: '2px solid #008542',
                borderRadius: '16px',
                padding: '16px 20px',
                marginLeft: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                fontSize: '1rem',
                color: '#222',
                maxWidth: 320,
                position: 'relative',
                minWidth: 220
              }}>
                Identify the dimensions of the two blocks.
              </div>
            </div>
          )}
          {isCustomShape && (
            <div
              className="space-y-4 flex items-center justify-center"
              style={{
                position: 'relative',
                width: '100%',
                height: '500px',
                marginTop: showCalculations ? '-6rem' : '-9rem', // Move container 0.5rem further up
                border: '2px solid #008542',
                borderRadius: '16px',
                padding: '16px',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ position: 'relative', width: '500px', height: '500px' }}>
                <svg width="500" height="500">
                  {/* 3D Rectangle at (2,2) with isometric projection */}
                  {/* First box (2 units wide, 1 unit tall, 3 units deep) */}
                  <polyline points="150,350 250,350" fill="none" stroke="#008542" strokeWidth="2" />
                  {/* Keep diagonal line from (0.2, 3.8) to (2,2) but remove horizontal segment from (0.2, 3.8) to (2.2, 3.8) */}
                  <polyline points="60,260 150,350" fill="none" stroke="#008542" strokeWidth="2" />
                  <polyline points="150,300 250,300 160,210 60,210 150,300" fill="none" stroke="#008542" strokeWidth="2" />
                  <line x1="150" y1="350" x2="150" y2="300" stroke="#008542" strokeWidth="2" />
                  <line x1="60" y1="260" x2="60" y2="210" stroke="#008542" strokeWidth="2" />
                  {/* Removed vertical line from (2.2, 3.8) to (2.2, 5.8) - removed line from 160,260 to 160,160 */}
                  <line x1="300" y1="350" x2="300" y2="250" stroke="#008542" strokeWidth="2" />

                  {/* Second box (1 unit wide, 2 units tall, 3 units deep) for staircase effect */}
                  {/* Base rectangle */}
                  <line x1="250" y1="350" x2="300" y2="350" stroke="#008542" strokeWidth="2" />
                  {/* Removed diagonal line from (5,2) to (4,3) - removed line from 300,350 to 210,260 */}
                  {/* Removed horizontal line from (0, 3.8) to (3.2, 3.8) - removed line from 160,260 to 210,260 */}
                  {/* Removed diagonal line from (4,2) to (2.3, 3.7) - no line connects 250,350 to 160,260 */}
                  {/* Top rectangle */}
                  <polyline points="250,250 300,250 210,160 160,160 250,250" fill="none" stroke="#008542" strokeWidth="2" />
                  {/* Vertical edges */}
                  <line x1="250" y1="300" x2="250" y2="250" stroke="#008542" strokeWidth="2" />
                  
                  {/* Vertical line from (2.2, 3.8) to (2.2, 5.8) but removed segment from (2.2, 3.8) to (2.2, 4.8) */}
                  <line x1="160" y1="210" x2="160" y2="160" stroke="#008542" strokeWidth="2" />
                  {/* Removed vertical line from (3.2, 3.8) to (3.2, 5.8) - removed line from 210,260 to 210,160 */}
                  <line x1="300" y1="350" x2="300" y2="250" stroke="#008542" strokeWidth="2" />

                  {/* Highlight polygons for rectangles (all visible faces) */}
                  {/* Bottom Block: Length (7) - diagonal edge from (60,260) to (150,350) */}
                  <polyline
                    points="60,260 150,350"
                    fill="none"
                    stroke={focusedInput === 'bottomLength' ? '#5953F0' : '#008542'}
                    strokeWidth={focusedInput === 'bottomLength' ? 4 : 2}
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  />
                  {/* Bottom Block: Width (3) - top back edge */}
                  <polyline
                    points="160,210 60,210"
                    fill="none"
                    stroke={focusedInput === 'bottomWidth' ? '#5953F0' : '#008542'}
                    strokeWidth={focusedInput === 'bottomWidth' ? 4 : 2}
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  />
                  {/* Bottom Block: Height (1) - left vertical edge */}
                  <polyline
                    points="60,210 60,260"
                    fill="none"
                    stroke={focusedInput === 'bottomHeight' ? '#5953F0' : '#008542'}
                    strokeWidth={focusedInput === 'bottomHeight' ? 4 : 2}
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  />
                  {/* Top Block: Length (7) - diagonal edge from (210,160) to (300,250) */}
                  <polyline
                    points="210,160 300,250"
                    fill="none"
                    stroke={focusedInput === 'topLength' ? '#5953F0' : '#008542'}
                    strokeWidth={focusedInput === 'topLength' ? 4 : 2}
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  />
                  {/* Top Block: Width (2) - top back edge */}
                  <polyline
                    points="210,160 160,160"
                    fill="none"
                    stroke={focusedInput === 'topWidth' ? '#5953F0' : '#008542'}
                    strokeWidth={focusedInput === 'topWidth' ? 4 : 2}
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  />
                  {/* Top Block: Height (4) - right vertical edge */}
                  <polyline
                    points="300,250 300,350"
                    fill="none"
                    stroke={focusedInput === 'topHeight' ? '#5953F0' : '#008542'}
                    strokeWidth={focusedInput === 'topHeight' ? 4 : 2}
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  />

                  {/* Existing polygons for block faces, but no highlight logic now */}
                  <polygon
                    points="150,300 250,300 160,210 60,210"
                    fill={focusedCalcBlock === 'bottom' || focusedStep3 || (focusedFace1 && currentFace === 1) ? 'rgba(89,83,240,0.18)' : 'transparent'}
                    stroke="none"
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  />
                  <polygon
                    points="150,350 250,350 250,300 150,300"
                    fill={focusedCalcBlock === 'bottom' || focusedStep3 || (focusedFace2 && currentFace === 2) ? 'rgba(89,83,240,0.18)' : 'transparent'}
                    stroke="none"
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  />
                  <polygon
                    points="150,350 150,300 60,210 60,260"
                    fill={focusedCalcBlock === 'bottom' || focusedStep3 ? 'rgba(89,83,240,0.18)' : 'transparent'}
                    stroke="none"
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  />
                  {/* Right/top rectangle faces */}
                  <polygon
                    points="250,250 300,250 210,160 160,160"
                    fill={focusedCalcBlock === 'top' || focusedStep3 ? 'rgba(89,83,240,0.18)' : 'transparent'}
                    stroke="none"
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  />
                  <polygon
                    points="250,350 300,350 300,250 250,250"
                    fill={focusedCalcBlock === 'top' || focusedStep3 || (focusedFace2 && currentFace === 2) ? 'rgba(89,83,240,0.18)' : 'transparent'}
                    stroke="none"
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  />
                  <polygon
                    points="300,350 300,250 210,160 210,260"
                    fill={focusedCalcBlock === 'top' || focusedStep3 ? 'rgba(89,83,240,0.18)' : 'transparent'}
                    stroke="none"
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  />
                  <polygon
                    points="210,260 210,160 160,160 160,260"
                    fill={focusedCalcBlock === 'top' || focusedStep3 || (focusedFace2 && currentFace === 2) ? 'rgba(89,83,240,0.18)' : 'transparent'}
                    stroke="none"
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  />

                  {/* Dimension numbers for left/bottom rectangle */}
                  <text x="225" y="375" fill="#008542" fontSize="18" fontWeight="bold" textAnchor="middle">5</text> {/* length, front edge, both rectangles */}
                  <text x="110" y="205" fill="#008542" fontSize="18" fontWeight="bold" textAnchor="middle">3</text> {/* width, left/bottom rectangle, top back edge */}
                  <text x="135" y="325" fill="#008542" fontSize="18" fontWeight="bold" textAnchor="middle">2</text> {/* height */}
                  <text x="95" y="320" fill="#008542" fontSize="18" fontWeight="bold" textAnchor="middle">7</text> {/* depth */}
                  {/* Dimension numbers for right/top rectangle */}
                  <text x="325" y="300" fill="transparent" fontSize="18" fontWeight="bold" textAnchor="middle"></text>
                  <text x="235" y="275" fill="#008542" fontSize="18" fontWeight="bold" textAnchor="middle">2</text> {/* height of top block, left vertical edge parallel to '1' */}
                </svg>
              </div>
              
              {!showCalculations && (
                <>
                  {/* Forward button (always visible). Active only on the first calculations page */}
                  <button
                    onClick={() => {
                      if (!faceInputsVisible) {
                        setFaceInputsVisible(true);
                        setCurrentFace(1);
                      } else if (currentFace === 1) {
                        setCurrentFace(2);
                      }
                    }}
                    className="flex items-center justify-center"
                    style={{ position: 'absolute', right: '30px', bottom: '30px', width: '30px', height: '30px', backgroundColor: '#008542', color: '#fff', borderRadius: '6px', pointerEvents: 'auto' }}
                    aria-label="Forward"
                  >
                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5l7 7-7 7"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>

                  {/* Back button (always visible). Disabled on the first calculations page */}
                  <button
                    onClick={() => {
                      if (faceInputsVisible) {
                        if (currentFace === 2) {
                          setCurrentFace(1);
                        } else {
                          setFaceInputsVisible(false);
                        }
                      }
                    }}
                    className="flex items-center justify-center"
                    style={{ position: 'absolute', right: '70px', bottom: '30px', width: '30px', height: '30px', backgroundColor: '#008542', color: '#fff', borderRadius: '6px', opacity: faceInputsVisible ? 1 : 0.4, pointerEvents: faceInputsVisible ? 'auto' : 'none' }}
                    aria-label="Back"
                  >
                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l-7-7 7-7"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </>
              )}

              {/* Calculations Section */}
              <div className="w-80 space-y-4" style={{ 
                position: 'relative', 
                zIndex: 100, 
                marginLeft: '-100px', 
                marginTop: !dimensionsCompleted ? '20px' : '-220px' 
              }}>
                <div className="p-4">
                  {(!dimensionsCompleted) && (
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Calculations</h3>
                  )}
                  
                  {!dimensionsCompleted ? (
                    <div className="space-y-4">
                      {/* Remove mascot image from here if present */}
                      
                      {faceInputsVisible && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-800 text-sm">{`Face ${currentFace}`}</h4>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={faceInputs[currentFace]}
                              onChange={(e) => setFaceInputs(prev => ({ ...prev, [currentFace]: e.target.value }))}
                              onFocus={() => {
                                if (currentFace === 1) {
                                  setFocusedFace1(true);
                                } else if (currentFace === 2) {
                                  setFocusedFace2(true);
                                }
                              }}
                              onBlur={() => {
                                setFocusedFace1(false);
                                setFocusedFace2(false);
                              }}
                              className={`w-24 px-2 py-1 text-xs border rounded ${
                                faceStatuses[currentFace] === 'correct' ? 'border-green-500 bg-green-50' :
                                faceStatuses[currentFace] === 'incorrect' ? 'border-red-500 bg-red-50' :
                                'border-gray-300'
                              }`}
                              placeholder="?"
                              style={{ pointerEvents: 'auto' }}
                            />
                            <button
                              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                              style={{ pointerEvents: 'auto' }}
                              onClick={checkCurrentFace}
                            >
                              Check
                            </button>
                            {currentFace === 2 && (
                              <button
                                className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                                style={{ pointerEvents: 'auto' }}
                                onClick={() => {
                                  setFaceInputs(prev => ({ ...prev, 2: '14' }));
                                  setFaceStatuses(prev => ({ ...prev, 2: null }));
                                }}
                              >
                                Hint
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Bottom Block Dimensions */}
                      <div className="space-y-2" style={{ display: faceInputsVisible ? 'none' : 'block' }}>
                        <h4 className="font-semibold text-gray-800 text-sm">Bottom Block:</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-xs text-gray-600">Length:</label>
                            <input
                              type="text"
                              value={dimensionInputs.bottomLength}
                              onChange={(e) => setDimensionInputs(prev => ({...prev, bottomLength: e.target.value}))}
                              onFocus={() => setFocusedInput('bottomLength')}
                              onBlur={() => setFocusedInput(null)}
                              className={`w-full px-2 py-1 text-xs border rounded ${
                                dimensionStatus.bottomLength === 'correct' ? 'border-green-500 bg-green-50' :
                                dimensionStatus.bottomLength === 'incorrect' ? 'border-red-500 bg-red-50' :
                                'border-gray-300'
                              }`}
                              placeholder="?"
                              style={{ pointerEvents: 'auto' }}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600">Width:</label>
                            <input
                              type="text"
                              value={dimensionInputs.bottomWidth}
                              onChange={(e) => setDimensionInputs(prev => ({...prev, bottomWidth: e.target.value}))}
                              onFocus={() => setFocusedInput('bottomWidth')}
                              onBlur={() => setFocusedInput(null)}
                              className={`w-full px-2 py-1 text-xs border rounded ${
                                dimensionStatus.bottomWidth === 'correct' ? 'border-green-500 bg-green-50' :
                                dimensionStatus.bottomWidth === 'incorrect' ? 'border-red-500 bg-red-50' :
                                'border-gray-300'
                              }`}
                              placeholder="?"
                              style={{ pointerEvents: 'auto' }}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600">Height:</label>
                            <input
                              type="text"
                              value={dimensionInputs.bottomHeight}
                              onChange={(e) => setDimensionInputs(prev => ({...prev, bottomHeight: e.target.value}))}
                              onFocus={() => setFocusedInput('bottomHeight')}
                              onBlur={() => setFocusedInput(null)}
                              className={`w-full px-2 py-1 text-xs border rounded ${
                                dimensionStatus.bottomHeight === 'correct' ? 'border-green-500 bg-green-50' :
                                dimensionStatus.bottomHeight === 'incorrect' ? 'border-red-500 bg-red-50' :
                                'border-gray-300'
                              }`}
                              placeholder="?"
                              style={{ pointerEvents: 'auto' }}
                            />
                          </div>
                        </div>
                        <button 
                          className="w-full px-2 py-1 text-white rounded text-xs"
                          style={{ backgroundColor: '#008542', borderColor: '#008542', pointerEvents: 'auto' }}
                          onMouseOver={e => e.currentTarget.style.backgroundColor = '#006b36'}
                          onMouseOut={e => e.currentTarget.style.backgroundColor = '#008542'}
                          onClick={() => {
                            checkDimension('bottomLength', 7);
                            checkDimension('bottomWidth', 3);
                            checkDimension('bottomHeight', 1);
                          }}
                        >
                          Check
                        </button>
                      </div>

                      {/* Top Block Dimensions */}
                      <div className="space-y-2" style={{ display: faceInputsVisible ? 'none' : 'block' }}>
                        <h4 className="font-semibold text-gray-800 text-sm">Top Block:</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-xs text-gray-600">Length:</label>
                            <input
                              type="text"
                              value={dimensionInputs.topLength}
                              onChange={(e) => setDimensionInputs(prev => ({...prev, topLength: e.target.value}))}
                              onFocus={() => setFocusedInput('topLength')}
                              onBlur={() => setFocusedInput(null)}
                              className={`w-full px-2 py-1 text-xs border rounded ${
                                dimensionStatus.topLength === 'correct' ? 'border-green-500 bg-green-50' :
                                dimensionStatus.topLength === 'incorrect' ? 'border-red-500 bg-red-50' :
                                'border-gray-300'
                              }`}
                              placeholder="?"
                              style={{ pointerEvents: 'auto' }}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600">Width:</label>
                            <input
                              type="text"
                              value={dimensionInputs.topWidth}
                              onChange={(e) => setDimensionInputs(prev => ({...prev, topWidth: e.target.value}))}
                              onFocus={() => setFocusedInput('topWidth')}
                              onBlur={() => setFocusedInput(null)}
                              className={`w-full px-2 py-1 text-xs border rounded ${
                                dimensionStatus.topWidth === 'correct' ? 'border-green-500 bg-green-50' :
                                dimensionStatus.topWidth === 'incorrect' ? 'border-red-500 bg-red-50' :
                                'border-gray-300'
                              }`}
                              placeholder="?"
                              style={{ pointerEvents: 'auto' }}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600">Height:</label>
                            <input
                              type="text"
                              value={dimensionInputs.topHeight}
                              onChange={(e) => setDimensionInputs(prev => ({...prev, topHeight: e.target.value}))}
                              onFocus={() => setFocusedInput('topHeight')}
                              onBlur={() => setFocusedInput(null)}
                              className={`w-full px-2 py-1 text-xs border rounded ${
                                dimensionStatus.topHeight === 'correct' ? 'border-green-500 bg-green-50' :
                                dimensionStatus.topHeight === 'incorrect' ? 'border-red-500 bg-red-50' :
                                'border-gray-300'
                              }`}
                              placeholder="?"
                              style={{ pointerEvents: 'auto' }}
                            />
                          </div>
                        </div>
                        <button 
                          className="w-full px-2 py-1 text-white rounded text-xs"
                          style={{ backgroundColor: '#008542', borderColor: '#008542', pointerEvents: 'auto' }}
                          onMouseOver={e => e.currentTarget.style.backgroundColor = '#006b36'}
                          onMouseOut={e => e.currentTarget.style.backgroundColor = '#008542'}
                          onClick={() => {
                            checkDimension('topLength', 7);
                            checkDimension('topWidth', 2);
                            checkDimension('topHeight', 4);
                          }}
                        >
                          Check
                        </button>
                      </div>
                    </div>
                  ) : !showCalculations ? (
                    <div className="space-y-3">
                      <div className="p-2 bg-green-50 border border-green-200 rounded hidden">
                        <p className="text-sm text-green-700 font-semibold">✓ All dimensions correct!</p>
                        <p className="text-xs text-green-600 mt-1">
                          <span>Bottom: 7 × 3 × 1</span><br/>
                          <span>Top: 7 × 2 × 4</span>
                        </p>
                      </div>
                      <button 
                        className="orbit-glow-btn w-full text-sm"
                        onClick={calculateStairStepSurfaceArea}
                        style={{ pointerEvents: 'auto' }}
                      >
                        Calculate Surface Area
                      </button>
                      <button 
                        className="w-full px-2 py-1 bg-gray-400 text-gray-700 rounded text-xs hover:bg-gray-500"
                        onClick={resetDimensions}
                        style={{ pointerEvents: 'auto' }}
                      >
                        Reset Dimensions
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Flexi mascot under the header on calculations page */}
                      <div className="space-y-3">
                        {/* Dimension Labels - Only show on calculation page */}
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded hidden">
                          <h4 className="font-semibold text-green-800 text-sm mb-2 hidden">Dimensions:</h4>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="font-medium text-green-700">Bottom Block:</span>
                              <div className="text-green-600">L: 7, W: 3, H: 1</div>
                            </div>
                            <div>
                              <span className="font-medium text-green-700">Top Block:</span>
                              <div className="text-green-600">L: 7, W: 2, H: 4</div>
                            </div>
                          </div>
                        </div>
                        
                        {faceInputsVisible && (
                          <div className="mb-4 p-3 rounded text-sm bg-blue-50 border border-blue-200">
                            <h4 className="font-semibold text-gray-800 text-xs">{`Face ${currentFace}`}</h4>
                            <p className="text-xs text-gray-600 mb-2">Enter the area for face 1:</p>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={faceInputs[currentFace]}
                                onChange={(e) => setFaceInputs(prev => ({ ...prev, [currentFace]: e.target.value }))}
                                className="w-16 px-2 py-1 text-xs border rounded border-gray-300"
                                placeholder="?"
                                style={{ pointerEvents: 'auto' }}
                              />
                            </div>
                          </div>
                        )}
                        <div style={{ display: faceInputsVisible ? 'none' : 'block' }} className={`mb-4 p-3 rounded text-sm ${
                          calculationInputStatus.step1Result === 'correct'
                            ? 'bg-green-50 border border-green-200'
                            : calculationStep >= 0
                              ? 'bg-blue-50 border border-blue-200'
                              : 'bg-gray-50'
                        }`}>
                          <h4 className="font-semibold text-gray-800 text-xs">Step 1: Bottom Block</h4>
                          <p className="text-xs text-gray-600 mb-2">2(lw + lh + wh)</p>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={calculationInputs.step1Result}
                              onChange={(e) => setCalculationInputs(prev => ({...prev, step1Result: e.target.value}))}
                              className={`w-16 px-2 py-1 text-xs border rounded ${
                                calculationInputStatus.step1Result === 'correct' ? 'border-green-500 bg-green-50' :
                                calculationInputStatus.step1Result === 'incorrect' ? 'border-red-500 bg-red-50' :
                                'border-gray-300'
                              }`}
                              placeholder="?"
                              style={{ pointerEvents: 'auto' }}
                              onFocus={() => setFocusedCalcBlock('bottom')}
                              onBlur={() => setFocusedCalcBlock(null)}
                            />
                            <button 
                              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                              onClick={() => checkCalculationStep('step1Result', 62)}
                              style={{ pointerEvents: 'auto' }}
                            >
                              Check
                            </button>
                          </div>
                        </div>
                        
                        <div className={`mb-4 p-3 rounded text-sm hidden ${
                          calculationInputStatus.step2Result === 'correct'
                            ? 'bg-green-50 border border-green-200'
                            : calculationStep >= 1
                              ? 'bg-blue-50 border border-blue-200'
                              : 'bg-gray-50'
                        }`}>
                          <h4 className="font-semibold text-gray-800 text-xs hidden">Step 2: Top Block</h4>
                          <p className="text-xs text-gray-600 mb-2">2(lw + lh + wh)</p>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={calculationInputs.step2Result}
                              onChange={(e) => setCalculationInputs(prev => ({...prev, step2Result: e.target.value}))}
                              className={`w-16 px-2 py-1 text-xs border rounded ${
                                calculationInputStatus.step2Result === 'correct' ? 'border-green-500 bg-green-50' :
                                calculationInputStatus.step2Result === 'incorrect' ? 'border-red-500 bg-red-50' :
                                'border-gray-300'
                              }`}
                              placeholder="?"
                              style={{ pointerEvents: 'auto' }}
                              onFocus={() => setFocusedCalcBlock('top')}
                              onBlur={() => setFocusedCalcBlock(null)}
                            />
                            <button 
                              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                              onClick={() => checkCalculationStep('step2Result', 100)}
                              style={{ pointerEvents: 'auto' }}
                            >
                              Check
                            </button>
                          </div>
                        </div>
                        
                        <div className={`mb-4 p-3 rounded text-sm hidden ${
                          calculationInputStatus.step3Result === 'correct'
                            ? 'bg-green-50 border border-green-200'
                            : calculationStep >= 2
                              ? 'bg-blue-50 border border-blue-200'
                              : 'bg-gray-50'
                        }`}>
                          <h4 className="font-semibold text-gray-800 text-xs hidden">Step 3: Add Together</h4>
                          <p className="text-xs text-gray-600 mb-2">Bottom block value + Top block value = </p>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={calculationInputs.step3Result}
                              onChange={(e) => setCalculationInputs(prev => ({...prev, step3Result: e.target.value}))}
                              onFocus={() => setFocusedStep3(true)}
                              onBlur={() => setFocusedStep3(false)}
                              className={`w-16 px-2 py-1 text-xs border rounded ${
                                calculationInputStatus.step3Result === 'correct' ? 'border-green-500 bg-green-50' :
                                calculationInputStatus.step3Result === 'incorrect' ? 'border-red-500 bg-red-50' :
                                'border-gray-300'
                              }`}
                              placeholder="?"
                              style={{ pointerEvents: 'auto' }}
                            />
                            <button 
                              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                              onClick={() => checkCalculationStep('step3Result', 162)}
                              style={{ pointerEvents: 'auto' }}
                            >
                              Check
                            </button>
                          </div>
                        </div>
                        
                        <div className={`mb-4 p-3 rounded text-sm hidden ${
                          calculationInputStatus.finalAnswer === 'correct'
                            ? 'bg-green-50 border border-green-200'
                            : calculationStep >= 3
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-50'
                        }`}>
                          <h4 className="font-semibold text-gray-800 text-xs hidden">Final Answer</h4>
                          <p className="text-xs text-gray-600 mb-2">Total surface area = </p>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={calculationInputs.finalAnswer}
                              onChange={(e) => setCalculationInputs(prev => ({...prev, finalAnswer: e.target.value}))}
                              className={`w-20 px-2 py-1 text-xs border rounded ${
                                calculationInputStatus.finalAnswer === 'correct' ? 'border-green-500 bg-green-50' :
                                calculationInputStatus.finalAnswer === 'incorrect' ? 'border-red-500 bg-red-50' :
                                'border-gray-300'
                              }`}
                              placeholder="?"
                              style={{ pointerEvents: 'auto' }}
                            />
                            <span className="text-xs text-gray-600">square units</span>
                            <button 
                              className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                              onClick={() => checkCalculationStep('finalAnswer', 162)}
                              style={{ pointerEvents: 'auto' }}
                            >
                              Check
                            </button>
                          </div>
                        </div>
                        
                        {/* Back button moved to bottom of calculations */}
                        <div className="flex justify-start items-center mt-4">
                          <button 
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#008542] text-white hover:bg-[#006b36] transition-colors"
                            onClick={() => setShowCalculations(false)}
                            style={{ pointerEvents: 'auto' }}
                            aria-label="Back"
                          >
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            {!isCustomShape && (
              <>
                <div style={{ margin: '16px 0' }}>
                  <span style={{ fontWeight: 600, color: '#333' }}>
                    {shape === 'cube' ? 'Current Side Length:' : shape === 'hemisphere' ? 'Current Length:' : 'Current Radius:'}
                  </span>
                  <span style={{ marginLeft: 8, color: '#008542', fontWeight: 'bold', fontSize: '1.3rem' }}>{radius.toFixed(1)} units</span>
                </div>
                <label className="block text-lg font-medium text-gray-700">
                  {shape === 'cube' ? "Adjust the cube's side length:" : shape === 'hemisphere' ? "Adjust the rectangular prism's length:" : `Adjust the ${shape}'s radius:`}
                </label>
                <Slider
                  min={minRadius}
                  max={maxRadius}
                  step={0.5}
                  value={[radius]}
                  onValueChange={(value) => {
                    setRadius(value[0]);
                    if (shape === 'cylinder') {
                      setHeight(value[0] * 1.4);
                    }
                  }}
                  className="w-full cursor-pointer"
                />
                {shape === 'cylinder' && (
                  <div style={{ margin: '16px 0' }}>
                    <span style={{ fontWeight: 600, color: '#333' }}>Current Height:</span>
                    <span style={{ marginLeft: 8, color: '#008542', fontWeight: 'bold', fontSize: '1.3rem' }}>{height.toFixed(1)} units</span>
                  </div>
                )}
                {shape === 'hemisphere' && (
                  <>
                    <div style={{ margin: '8px 0' }}>
                      <span style={{ fontWeight: 600, color: '#333' }}>Current Width:</span>
                      <span style={{ marginLeft: 8, color: '#008542', fontWeight: 'bold', fontSize: '1.1rem' }}>{(radius * 0.6).toFixed(1)} units</span>
                    </div>
                    <div style={{ margin: '8px 0' }}>
                      <span style={{ fontWeight: 600, color: '#333' }}>Current Height:</span>
                      <span style={{ marginLeft: 8, color: '#008542', fontWeight: 'bold', fontSize: '1.1rem' }}>{(radius * 0.4).toFixed(1)} units</span>
                    </div>
                  </>
                )}
                <div className="h-64 flex items-center justify-center overflow-hidden relative">
                  {renderShape()}
                  {calculation && (
                    <div className="absolute" style={{ 
                      left: shape === 'cylinder' ? '280px' : '350px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '650px'
                    }}>
                      <div className="space-y-4">
                        {shape === 'sphere' && (
                          <>
                            <p className="text-3xl font-normal text-black typing-animation" style={{ animationDelay: '1000ms', fontWeight: 400, fontFamily: 'inherit' }}>SA = 4πr²</p>
                            <div className="space-y-2">
                              <p className="text-2xl font-normal text-black typing-animation" style={{ animationDelay: '2500ms', fontWeight: 400, fontFamily: 'inherit' }}>SA = 4π({radius.toFixed(1)})²</p>
                              <p className="text-2xl font-normal text-black typing-animation" style={{ animationDelay: '4000ms', fontWeight: 400, fontFamily: 'inherit' }}>SA = 4π({(radius * radius).toFixed(1)})</p>
                              <div className="typing-animation" style={{ animationDelay: '5500ms' }}>
                                <p className="text-2xl font-normal text-black calculation-text" style={{ fontWeight: 400, fontFamily: 'inherit' }}>SA = {calculation.result}</p>
                                <p className="text-2xl font-normal text-black calculation-text" style={{ fontWeight: 400, fontFamily: 'inherit' }}>square units</p>
                              </div>
                            </div>
                          </>
                        )}
                        {shape === 'cylinder' && (
                          <>
                            <p className="text-3xl font-normal text-black typing-animation" style={{ animationDelay: '1000ms', fontWeight: 400, fontFamily: 'inherit' }}>SA = 2πr² + 2πrh</p>
                            <div className="space-y-2">
                              <p className="text-2xl font-normal text-black typing-animation" style={{ animationDelay: '2500ms', fontWeight: 400, fontFamily: 'inherit' }}>SA = 2π({radius.toFixed(1)})² + 2π({radius.toFixed(1)} × {height.toFixed(1)})</p>
                              <p className="text-2xl font-normal text-black typing-animation" style={{ animationDelay: '4000ms', fontWeight: 400, fontFamily: 'inherit' }}>SA = 2π({(radius * radius).toFixed(1)}) + 2π({(radius * height).toFixed(1)})</p>
                              <div className="typing-animation" style={{ animationDelay: '5500ms' }}>
                                <p className="text-2xl font-normal text-black calculation-text" style={{ fontWeight: 400, fontFamily: 'inherit' }}>SA = {calculation.result}</p>
                                <p className="text-2xl font-normal text-black calculation-text" style={{ fontWeight: 400, fontFamily: 'inherit' }}>square units</p>
                              </div>
                            </div>
                          </>
                        )}
                        {shape === 'hemisphere' && calculation && (
                          <>
                            <div style={{ maxWidth: '100%', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                              <p className="text-3xl font-normal text-black typing-animation" style={{ animationDelay: '1000ms', fontWeight: 400, fontFamily: 'inherit', wordBreak: 'break-word', overflowWrap: 'break-word' }}>SA = 2(lw + lh + wh)</p>
                              <div className="space-y-2">
                                <p className="text-2xl font-normal text-black typing-animation" style={{ animationDelay: '2500ms', fontWeight: 400, fontFamily: 'inherit', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                  SA = 2({radius.toFixed(1)} × {(radius * 0.6).toFixed(1)} + {radius.toFixed(1)} × <br />
                                  {(radius * 0.4).toFixed(1)} + {(radius * 0.6).toFixed(1)} × {(radius * 0.4).toFixed(1)})
                                </p>
                                <p className="text-2xl font-normal text-black typing-animation" style={{ animationDelay: '4000ms', fontWeight: 400, fontFamily: 'inherit', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                  SA = 2({(radius * (radius * 0.6)).toFixed(2)} + {(radius * (radius * 0.4)).toFixed(2)} + <br />
                                  {((radius * 0.6) * (radius * 0.4)).toFixed(2)})
                                </p>
                                <div className="typing-animation" style={{ animationDelay: '5500ms', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                  <p className="text-2xl font-normal text-black calculation-text" style={{ fontWeight: 400, fontFamily: 'inherit', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                    SA = {(
                                      2 * (
                                        (radius * (radius * 0.6)) +
                                        (radius * (radius * 0.4)) +
                                        ((radius * 0.6) * (radius * 0.4))
                                      )
                                    ).toFixed(2)}
                                  </p>
                                  <p className="text-2xl font-normal text-black calculation-text" style={{ fontWeight: 400, fontFamily: 'inherit', wordBreak: 'break-word', overflowWrap: 'break-word' }}>square units</p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {shape === 'cube' && (
                          <>
                            <p className="text-3xl font-normal text-black typing-animation" style={{ animationDelay: '1000ms', fontWeight: 400, fontFamily: 'inherit' }}>SA = 6s²</p>
                            <div className="space-y-2">
                              <p className="text-2xl font-normal text-black typing-animation" style={{ animationDelay: '2500ms', fontWeight: 400, fontFamily: 'inherit' }}>SA = 6({radius.toFixed(1)})²</p>
                              <p className="text-2xl font-normal text-black typing-animation" style={{ animationDelay: '4000ms', fontWeight: 400, fontFamily: 'inherit' }}>SA = 6({(radius * radius).toFixed(1)})</p>
                              <div className="typing-animation" style={{ animationDelay: '5500ms' }}>
                                <p className="text-2xl font-normal text-black calculation-text" style={{ fontWeight: 400, fontFamily: 'inherit' }}>SA = {calculation.result}</p>
                                <p className="text-2xl font-normal text-black calculation-text" style={{ fontWeight: 400, fontFamily: 'inherit' }}>square units</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex space-x-4">
                  <button className="orbit-glow-btn" onClick={calculateSurfaceArea}>
                    Calculate Surface Area
                  </button>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start bg-gray-50">
        </CardFooter>
      </Card>
    </div>
  );
};

export default Sphere;