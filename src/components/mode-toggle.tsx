'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ModeToggleProps = {
    currentMode: 'generate' | 'edit';
    onModeChange: (mode: 'generate' | 'edit') => void;
};

export function ModeToggle({ currentMode, onModeChange }: ModeToggleProps) {
    return (
        <Tabs
            value={currentMode}
            onValueChange={(value) => onModeChange(value as 'generate' | 'edit')}
            className='w-auto'>
            <TabsList className='grid h-auto grid-cols-2 gap-1 rounded-md border-none bg-transparent p-0'>
                <TabsTrigger
                    value='generate'
                    className={`rounded-md border px-3 py-1 text-sm transition-colors ${
                        currentMode === 'generate'
                            ? 'border-neutral-200 bg-neutral-200 text-neutral-900'
                            : 'border-dashed border-neutral-600 bg-transparent text-neutral-400 hover:border-neutral-500 hover:text-neutral-300'
                    } `}>
                    Generate
                </TabsTrigger>
                <TabsTrigger
                    value='edit'
                    className={`rounded-md border px-3 py-1 text-sm transition-colors ${
                        currentMode === 'edit'
                            ? 'border-neutral-200 bg-neutral-200 text-neutral-900'
                            : 'border-dashed border-neutral-600 bg-transparent text-neutral-400 hover:border-neutral-500 hover:text-neutral-300'
                    } `}>
                    Edit
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
