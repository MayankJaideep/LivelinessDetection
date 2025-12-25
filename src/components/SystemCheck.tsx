import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Cpu, Camera, Lock } from 'lucide-react';

interface SystemCheckProps {
    onComplete: () => void;
}

interface CheckItem {
    id: string;
    label: string;
    icon: React.ElementType;
}

const CHECKS: CheckItem[] = [
    { id: 'secure', label: 'Verifying Secure Connection', icon: Lock },
    { id: 'hardware', label: 'Checking Hardware Acceleration', icon: Cpu },
    { id: 'camera', label: 'Initializing Camera Interface', icon: Camera },
    { id: 'ai', label: 'Loading Neural Engine', icon: Shield },
];

export function SystemCheck({ onComplete }: SystemCheckProps) {
    const [activeCheckIndex, setActiveCheckIndex] = useState(0);
    const [completedChecks, setCompletedChecks] = useState<string[]>([]);

    useEffect(() => {
        let mounted = true;

        const runChecks = async () => {
            for (let i = 0; i < CHECKS.length; i++) {
                if (!mounted) return;
                setActiveCheckIndex(i);

                // Simulate check duration (randomized for realism)
                await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));

                if (!mounted) return;
                setCompletedChecks(prev => [...prev, CHECKS[i].id]);
            }

            // All done
            await new Promise(resolve => setTimeout(resolve, 500));
            if (mounted) onComplete();
        };

        runChecks();

        return () => { mounted = false; };
    }, [onComplete]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] w-full max-w-md mx-auto p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full space-y-6"
            >
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                        System Diagnostics
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        Preparing secure environment...
                    </p>
                </div>

                <div className="space-y-4">
                    {CHECKS.map((check, index) => {
                        const isActive = index === activeCheckIndex;
                        const isCompleted = completedChecks.includes(check.id);

                        return (
                            <div
                                key={check.id}
                                className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-300 ${isActive
                                        ? 'bg-primary/5 border-primary/20 scale-105'
                                        : isCompleted
                                            ? 'bg-background/50 border-border/50 opacity-70'
                                            : 'opacity-30 border-transparent'
                                    }`}
                            >
                                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-colors
                  ${isCompleted ? 'bg-green-500/20 text-green-500' : isActive ? 'bg-primary/20 text-primary animate-pulse' : 'bg-muted text-muted-foreground'}
                `}>
                                    {isCompleted ? <Check className="w-4 h-4" /> : <check.icon className="w-4 h-4" />}
                                </div>

                                <div className="flex-1">
                                    <div className="text-sm font-medium">
                                        {check.label}
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            className="h-1 bg-primary/20 mt-2 rounded-full overflow-hidden"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <motion.div
                                                className="h-full bg-primary"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
