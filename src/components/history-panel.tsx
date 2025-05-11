'use client';

import type { HistoryMetadata } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Copy, Check, Layers, DollarSign, Pencil, Sparkles as SparklesIcon, HardDrive, Database } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

type HistoryPanelProps = {
    history: HistoryMetadata[];
    onSelectImage: (item: HistoryMetadata) => void;
    onClearHistory: () => void;
    getImageSrc: (filename: string) => string | undefined;
};

const formatDuration = (ms: number): string => {
    if (ms < 1000) {
        return `${ms}ms`;
    }
    return `${(ms / 1000).toFixed(1)}s`;
};

const calculateCost = (value: number, rate: number): string => {
    const cost = value * rate;
    return isNaN(cost) ? 'N/A' : cost.toFixed(4);
};

export function HistoryPanel({ history, onSelectImage, onClearHistory, getImageSrc }: HistoryPanelProps) {
    const [openPromptDialogTimestamp, setOpenPromptDialogTimestamp] = React.useState<number | null>(null);
    const [openCostDialogTimestamp, setOpenCostDialogTimestamp] = React.useState<number | null>(null);
    const [isTotalCostDialogOpen, setIsTotalCostDialogOpen] = React.useState(false);
    const [copiedTimestamp, setCopiedTimestamp] = React.useState<number | null>(null);

    const { totalCost, totalImages } = React.useMemo(() => {
        let cost = 0;
        let images = 0;
        history.forEach((item) => {
            if (item.costDetails) {
                cost += item.costDetails.estimated_cost_usd;
            }
            images += item.images?.length ?? 0;
        });

        return { totalCost: Math.round(cost * 10000) / 10000, totalImages: images };
    }, [history]);

    const averageCost = totalImages > 0 ? totalCost / totalImages : 0;

    const handleCopy = async (text: string | null | undefined, timestamp: number) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopiedTimestamp(timestamp);
            setTimeout(() => setCopiedTimestamp(null), 1500);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <Card className='flex h-full w-full flex-col overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900'>
            <CardHeader className='flex flex-row items-center justify-between gap-4 border-b border-neutral-800 px-4 py-3'>
                <div className='flex items-center gap-2'>
                    <CardTitle className='text-lg font-medium text-neutral-100'>History</CardTitle>
                    {totalCost > 0 && (
                        <Dialog open={isTotalCostDialogOpen} onOpenChange={setIsTotalCostDialogOpen}>
                            <DialogTrigger asChild>
                                <button
                                    className='mt-0.5 flex items-center gap-1 rounded-full bg-emerald-600/80 px-1.5 py-0.5 text-[12px] text-neutral-100 transition-colors hover:bg-emerald-500/90'
                                    aria-label='Show total cost summary'>
                                    Total Cost: ${totalCost.toFixed(4)}
                                </button>
                            </DialogTrigger>
                            <DialogContent className='border-neutral-700 bg-neutral-900 text-neutral-100 sm:max-w-[625px]'>
                                <DialogHeader>
                                    <DialogTitle className='text-neutral-100'>Total Cost Summary</DialogTitle>
                                    <DialogDescription className='sr-only'>
                                        A summary of all costs incurred during image generation and editing.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className='max-h-[400px] overflow-y-auto rounded-md border border-neutral-700 bg-neutral-800 p-3 py-4 text-sm text-neutral-300'>
                                    <div className='space-y-2'>
                                        <div className='flex justify-between'>
                                            <span>Total Images Generated:</span>{' '}
                                            <span>{totalImages.toLocaleString()}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span>Total Text Input Tokens:</span>{' '}
                                            <span>{totalTextInputTokens.toLocaleString()}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span>Total Text Output Tokens:</span>{' '}
                                            <span>{totalTextOutputTokens.toLocaleString()}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span>Total Image Tokens:</span>{' '}
                                            <span>{totalImageTokens.toLocaleString()}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span>Total Cost:</span>{' '}
                                            <span>${totalCost.toFixed(4)}</span>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={onClearHistory}
                    className='text-neutral-400 hover:text-neutral-100'>
                    Clear History
                </Button>
            </CardHeader>
            <CardContent className='flex-1 overflow-y-auto p-0'>
                {history.length === 0 ? (
                    <div className='flex h-full items-center justify-center p-4 text-neutral-400'>
                        No history yet. Generate or edit some images to see them here.
                    </div>
                ) : (
                    <div className='divide-y divide-neutral-800'>
                        {history.map((item, index) => (
                            <div
                                key={item.timestamp}
                                className='group relative flex cursor-pointer flex-col gap-2 p-4 transition-colors hover:bg-neutral-800/50'>
                                <div className='flex items-start justify-between gap-4'>
                                    <div className='flex-1 space-y-1'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-sm font-medium text-neutral-100'>
                                                {item.mode === 'generate' ? 'Generated' : 'Edited'} Image
                                                {item.images.length > 1 ? 's' : ''}
                                            </span>
                                            {item.costDetails && (
                                                <Dialog open={isCostDialogOpen === index} onOpenChange={(open) => setIsCostDialogOpen(open ? index : null)}>
                                                    <DialogTrigger asChild>
                                                        <button
                                                            className='mt-0.5 flex items-center gap-1 rounded-full bg-emerald-600/80 px-1.5 py-0.5 text-[12px] text-neutral-100 transition-colors hover:bg-emerald-500/90'
                                                            aria-label='Show cost details'>
                                                            Cost: ${calculateTotalCost(item.costDetails).toFixed(4)}
                                                        </button>
                                                    </DialogTrigger>
                                                    <DialogContent className='border-neutral-700 bg-neutral-900 text-neutral-100 sm:max-w-[625px]'>
                                                        <DialogHeader>
                                                            <DialogTitle className='text-neutral-100'>Cost Details</DialogTitle>
                                                            <DialogDescription className='sr-only'>
                                                                Detailed breakdown of costs for this image generation or edit.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className='max-h-[400px] overflow-y-auto rounded-md border border-neutral-700 bg-neutral-800 p-3 py-4 text-sm text-neutral-300'>
                                                            <div className='space-y-2'>
                                                                <div className='flex justify-between'>
                                                                    <span>Text Input Tokens:</span>{' '}
                                                                    <span>
                                                                        {item.costDetails.text_input_tokens.toLocaleString()}{' '}
                                                                        (~$
                                                                        {calculateCost(
                                                                            item.costDetails.text_input_tokens,
                                                                            0.000005
                                                                        )}
                                                                        )
                                                                    </span>
                                                                </div>
                                                                <div className='flex justify-between'>
                                                                    <span>Text Output Tokens:</span>{' '}
                                                                    <span>
                                                                        {item.costDetails.text_output_tokens.toLocaleString()}{' '}
                                                                        (~$
                                                                        {calculateCost(
                                                                            item.costDetails.text_output_tokens,
                                                                            0.000015
                                                                        )}
                                                                        )
                                                                    </span>
                                                                </div>
                                                                <div className='flex justify-between'>
                                                                    <span>Image Tokens:</span>{' '}
                                                                    <span>
                                                                        {item.costDetails.image_tokens.toLocaleString()}{' '}
                                                                        (~$
                                                                        {calculateCost(
                                                                            item.costDetails.image_tokens,
                                                                            0.00001
                                                                        )}
                                                                        )
                                                                    </span>
                                                                </div>
                                                                <div className='flex justify-between'>
                                                                    <span>Total Cost:</span>{' '}
                                                                    <span>
                                                                        $
                                                                        {calculateTotalCost(item.costDetails).toFixed(4)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </div>
                                        <div className='space-y-1 rounded-b-md border border-t-0 border-neutral-700 bg-neutral-800 p-2 text-xs text-neutral-400'>
                                            <p title={`Generated on: ${new Date(item.timestamp).toLocaleString()}`}>
                                                <span className='font-medium text-neutral-300'>Time:</span>{' '}
                                                {formatDuration(item.durationMs)}
                                            </p>
                                            <p>
                                                <span className='font-medium text-neutral-300'>Quality:</span> {item.quality}
                                            </p>
                                            <p>
                                                <span className='font-medium text-neutral-300'>BG:</span> {item.background}
                                            </p>
                                            <p>
                                                <span className='font-medium text-neutral-300'>Mod:</span> {item.moderation}
                                            </p>
                                        </div>
                                    </div>
                                    <Dialog open={isPromptDialogOpen === index} onOpenChange={(open) => setIsPromptDialogOpen(open ? index : null)}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                className='text-neutral-400 hover:text-neutral-100'>
                                                View Prompt
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className='border-neutral-700 bg-neutral-900 text-neutral-100 sm:max-w-[625px]'>
                                            <DialogHeader>
                                                <DialogTitle className='text-neutral-100'>Prompt</DialogTitle>
                                                <DialogDescription className='sr-only'>
                                                    The full prompt used to generate this image batch.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className='max-h-[400px] overflow-y-auto rounded-md border border-neutral-700 bg-neutral-800 p-3 py-4 text-sm text-neutral-300'>
                                                {item.prompt || 'No prompt recorded.'}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                                    {item.images.map((img) => (
                                        <div
                                            key={img.filename}
                                            className='group relative aspect-square overflow-hidden rounded-md border border-neutral-700 bg-neutral-800'>
                                            <Image
                                                src={getImageSrc(img.filename) || ''}
                                                alt={`Generated image ${img.filename}`}
                                                fill
                                                className='object-cover transition-transform group-hover:scale-105'
                                                onClick={() => onSelectImage(item)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
