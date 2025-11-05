import { useBatchOperations } from '@/hooks/useBatchOperations';
import { useImageOperations } from '@/hooks/useImageOperations';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface BatchOperationsExampleProps {
  imageId: string;
}

export function BatchOperationsExample({ imageId }: BatchOperationsExampleProps) {
  const [brightness, setBrightness] = useState(1.0);
  const [contrast, setContrast] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  
  const {
    pendingOperations,
    isProcessing,
    addBrightness,
    addLogContrast,
    addRotate,
    clearOperations,
    executeOperations,
  } = useBatchOperations(imageId, {
    debounceMs: 500,
    autoExecute: true,
  });
  
  const { handleBatchOperations } = useImageOperations();

  const handleBrightnessChange = (value: number[]) => {
    const newValue = value[0];
    setBrightness(newValue);
    addBrightness(newValue);
  };

  const handleContrastChange = (value: number[]) => {
    const newValue = value[0];
    setContrast(newValue);
    addLogContrast(newValue);
  };

  const handleRotationChange = (value: number[]) => {
    const newValue = value[0];
    setRotation(newValue);
    addRotate(newValue);
  };

  const handleManualApply = async () => {
    await executeOperations();
  };

  const handlePresetEnhance = async () => {
    await handleBatchOperations(imageId, [
      { operation: 'brightness', params: { factor: 1.15 } },
      { operation: 'log_contrast', params: { k: 1.3 } },
      { operation: 'channel_blue', params: { enabled: false } },
    ]);
  };

  const handlePresetBlackWhite = async () => {
    await handleBatchOperations(imageId, [
      { operation: 'grayscale_luminosity', params: {} },
      { operation: 'exp_contrast', params: { k: 1.5 } },
      { operation: 'brightness', params: { factor: 1.05 } },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Real-time Adjustments</h3>
        <p className="text-sm text-muted-foreground">
          Changes are automatically batched and applied with debouncing
        </p>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Brightness: {brightness.toFixed(2)}
          </label>
          <Slider
            value={[brightness]}
            onValueChange={handleBrightnessChange}
            min={-1.0}
            max={1.0}
            step={0.1}
            disabled={isProcessing}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Contrast (Logarithmic): {contrast.toFixed(2)}
          </label>
          <Slider
            value={[contrast]}
            onValueChange={handleContrastChange}
            min={0.5}
            max={2.0}
            step={0.1}
            disabled={isProcessing}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Rotation: {rotation}°
          </label>
          <Slider
            value={[rotation]}
            onValueChange={handleRotationChange}
            min={0}
            max={360}
            step={15}
            disabled={isProcessing}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleManualApply}
            disabled={isProcessing || pendingOperations.length === 0}
          >
            Apply Now ({pendingOperations.length} operations)
          </Button>
          <Button
            variant="outline"
            onClick={clearOperations}
            disabled={isProcessing || pendingOperations.length === 0}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Preset Effects</h3>
        <p className="text-sm text-muted-foreground">
          Apply multiple operations in a single batch
        </p>
        
        <div className="flex gap-2">
          <Button
            onClick={handlePresetEnhance}
            disabled={isProcessing}
            variant="secondary"
          >
            Enhance Photo
          </Button>
          <Button
            onClick={handlePresetBlackWhite}
            disabled={isProcessing}
            variant="secondary"
          >
            Black & White
          </Button>
        </div>
      </div>

      {pendingOperations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Pending Operations:</h4>
          <div className="flex flex-wrap gap-2">
            {pendingOperations.map((op, index) => (
              <Badge key={index} variant="secondary">
                {op.operation}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
