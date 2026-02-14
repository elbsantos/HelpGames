import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

type Phase = "inhale" | "hold" | "exhale" | "rest";

interface BreathingExerciseProps {
  onComplete?: () => void;
}

export default function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const phaseConfig = {
    inhale: { duration: 4, next: "hold" as Phase, label: "Inspire profundamente", color: "from-chart-2/20 to-chart-2/40" },
    hold: { duration: 7, next: "exhale" as Phase, label: "Segure a respiração", color: "from-chart-3/20 to-chart-3/40" },
    exhale: { duration: 8, next: "rest" as Phase, label: "Expire lentamente", color: "from-primary/20 to-primary/40" },
    rest: { duration: 2, next: "inhale" as Phase, label: "Descanse", color: "from-muted/20 to-muted/40" },
  };

  useEffect(() => {
    if (!isActive) return;

    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const currentPhase = phaseConfig[phase];
      const nextPhase = currentPhase.next;
      
      if (nextPhase === "inhale") {
        const newCycles = cyclesCompleted + 1;
        setCyclesCompleted(newCycles);
        
        if (newCycles >= 3) {
          setIsActive(false);
          if (onComplete) onComplete();
          return;
        }
      }
      
      setPhase(nextPhase);
      setCount(phaseConfig[nextPhase].duration);
    }
  }, [count, isActive, phase, cyclesCompleted, onComplete]);

  const startExercise = () => {
    setIsActive(true);
    setPhase("inhale");
    setCount(4);
    setCyclesCompleted(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase("inhale");
    setCount(4);
    setCyclesCompleted(0);
  };

  const currentConfig = phaseConfig[phase];
  const progress = ((currentConfig.duration - count) / currentConfig.duration) * 100;

  return (
    <Card className={`border-2 transition-all duration-1000 bg-gradient-to-br ${currentConfig.color}`}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-8">
          {/* Círculo de respiração */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div 
              className={`absolute inset-0 rounded-full bg-primary/20 transition-all duration-1000 ${
                phase === "inhale" ? "scale-100" : phase === "hold" ? "scale-100" : "scale-50"
              }`}
              style={{
                boxShadow: isActive ? "0 0 40px rgba(var(--primary), 0.3)" : "none",
              }}
            />
            <div className="relative z-10 text-center">
              <div className="text-6xl font-bold text-primary">{count}</div>
              <div className="text-sm text-muted-foreground mt-2">segundos</div>
            </div>
          </div>

          {/* Instrução */}
          <div className="text-center space-y-2">
            <p className="text-2xl font-semibold text-foreground">
              {currentConfig.label}
            </p>
            <p className="text-sm text-muted-foreground">
              Ciclo {cyclesCompleted + 1} de 3
            </p>
          </div>

          {/* Barra de progresso */}
          <div className="w-full max-w-xs">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controles */}
          <div className="flex gap-4">
            {!isActive ? (
              <Button onClick={startExercise} size="lg" className="px-8">
                Iniciar Exercício
              </Button>
            ) : (
              <Button onClick={stopExercise} variant="outline" size="lg" className="px-8">
                Parar
              </Button>
            )}
          </div>

          {/* Explicação */}
          {!isActive && (
            <div className="text-center max-w-md space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Técnica 4-7-8:</strong> Inspire por 4 segundos, segure por 7, expire por 8.
              </p>
              <p className="text-sm text-muted-foreground">
                Este exercício ajuda a reduzir ansiedade e recuperar o controle emocional.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
