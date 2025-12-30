import { Check, Clock, Lock } from 'lucide-react';

const Stepper = ({ currentStep, steps, progress }) => {
  const getStepIcon = (step, index) => {
    if (progress[step.key]) {
      return <Check className="w-5 h-5 text-white" />;
    }
    
    if (index <= currentStep) {
      return <Clock className="w-5 h-5 text-white" />;
    }
    
    return <Lock className="w-5 h-5 text-gray-400" />;
  };

  const getStepClass = (step, index) => {
    if (progress[step.key]) {
      return 'bg-green-500 text-white';
    }
    
    if (index <= currentStep) {
      return 'bg-blue-500 text-white';
    }
    
    return 'bg-gray-200 text-gray-400';
  };

  const getLineClass = (step, index) => {
    if (progress[step.key] || (index < currentStep)) {
      return 'bg-green-500';
    }
    
    if (index === currentStep) {
      return 'bg-blue-500';
    }
    
    return 'bg-gray-200';
  };

  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-4">
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepClass(step, index)}`}>
              {getStepIcon(step, index)}
            </div>
            <span className="text-sm mt-2 text-center font-medium text-gray-700">
              {step.label}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div className="flex-1 mx-4">
              <div className="h-1 bg-gray-200 rounded">
                <div 
                  className={`h-full rounded transition-all duration-300 ${getLineClass(step, index)}`}
                  style={{ width: progress[step.key] ? '100%' : index < currentStep ? '100%' : '0%' }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;