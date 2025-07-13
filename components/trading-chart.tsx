'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CandlestickData {
	time: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
}

interface TradingChartProps {
	symbol: string;
}

export function TradingChart({ symbol }: TradingChartProps) {
	const [timeframe, setTimeframe] = useState('1D');
	const [chartData, setChartData] = useState<CandlestickData[]>([]);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Generate mock candlestick data
	const generateMockData = (days: number) => {
		const data: CandlestickData[] = [];
		let basePrice = 0.0045;
		const now = new Date();

		for (let i = days; i >= 0; i--) {
			const date = new Date(now);
			date.setDate(date.getDate() - i);

			// Generate realistic price movement
			const volatility = 0.1;
			const trend = Math.sin(i * 0.1) * 0.02; // Add some trend
			const randomChange = (Math.random() - 0.5) * volatility;

			const open = basePrice;
			const change = basePrice * (trend + randomChange);
			const close = Math.max(0.001, open + change);
			const high = Math.max(open, close) * (1 + Math.random() * 0.05);
			const low = Math.min(open, close) * (1 - Math.random() * 0.05);
			const volume = 10000 + Math.random() * 50000;

			data.push({
				time: date.toISOString().split('T')[0],
				open: parseFloat(open.toFixed(6)),
				high: parseFloat(high.toFixed(6)),
				low: parseFloat(low.toFixed(6)),
				close: parseFloat(close.toFixed(6)),
				volume: Math.round(volume),
			});

			basePrice = close;
		}

		return data;
	};

	// Draw candlestick chart
	const drawChart = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas || !chartData.length) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas size
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width * window.devicePixelRatio;
		canvas.height = rect.height * window.devicePixelRatio;
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

		const width = rect.width;
		const height = rect.height;

		// Clear canvas
		ctx.fillStyle = '#f8fafc';
		ctx.fillRect(0, 0, width, height);

		// Chart margins
		const margin = { top: 20, right: 80, bottom: 40, left: 60 };
		const chartWidth = width - margin.left - margin.right;
		const chartHeight = height - margin.top - margin.bottom;

		// Find price range
		const prices = chartData.flatMap((d) => [d.high, d.low]);
		const minPrice = Math.min(...prices);
		const maxPrice = Math.max(...prices);
		const priceRange = maxPrice - minPrice;
		const padding = priceRange * 0.1;

		// Helper functions
		const getX = (index: number) =>
			margin.left + (index * chartWidth) / (chartData.length - 1);
		const getY = (price: number) =>
			margin.top +
			chartHeight -
			((price - minPrice + padding) / (priceRange + 2 * padding)) * chartHeight;

		// Draw grid lines
		ctx.strokeStyle = '#e2e8f0';
		ctx.lineWidth = 1;

		// Horizontal grid lines
		for (let i = 0; i <= 5; i++) {
			const price = minPrice + (priceRange * i) / 5;
			const y = getY(price);
			ctx.beginPath();
			ctx.moveTo(margin.left, y);
			ctx.lineTo(width - margin.right, y);
			ctx.stroke();

			// Price labels
			ctx.fillStyle = '#64748b';
			ctx.font = '12px sans-serif';
			ctx.textAlign = 'left';
			ctx.fillText(price.toFixed(4), width - margin.right + 5, y + 4);
		}

		// Vertical grid lines
		const timeStep = Math.max(1, Math.floor(chartData.length / 6));
		for (let i = 0; i < chartData.length; i += timeStep) {
			const x = getX(i);
			ctx.beginPath();
			ctx.moveTo(x, margin.top);
			ctx.lineTo(x, height - margin.bottom);
			ctx.stroke();

			// Time labels
			ctx.fillStyle = '#64748b';
			ctx.font = '12px sans-serif';
			ctx.textAlign = 'center';
			const date = new Date(chartData[i].time);
			ctx.fillText(
				date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
				x,
				height - 10
			);
		}

		// Draw candlesticks
		chartData.forEach((candle, index) => {
			const x = getX(index);
			const openY = getY(candle.open);
			const closeY = getY(candle.close);
			const highY = getY(candle.high);
			const lowY = getY(candle.low);

			const isGreen = candle.close > candle.open;
			const candleWidth = Math.max(2, (chartWidth / chartData.length) * 0.8);

			// Draw wick
			ctx.strokeStyle = isGreen ? '#10b981' : '#ef4444';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(x, highY);
			ctx.lineTo(x, lowY);
			ctx.stroke();

			// Draw body
			ctx.fillStyle = isGreen ? '#10b981' : '#ef4444';
			const bodyHeight = Math.abs(closeY - openY);
			const bodyY = Math.min(openY, closeY);

			if (bodyHeight < 1) {
				// Very small body, draw as line
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(x - candleWidth / 2, openY);
				ctx.lineTo(x + candleWidth / 2, openY);
				ctx.stroke();
			} else {
				ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
			}
		});

		// Draw price line
		ctx.strokeStyle = '#3b82f6';
		ctx.lineWidth = 2;
		ctx.beginPath();
		chartData.forEach((candle, index) => {
			const x = getX(index);
			const y = getY(candle.close);
			if (index === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		});
		ctx.stroke();

		// Current price indicator
		if (chartData.length > 0) {
			const lastCandle = chartData[chartData.length - 1];
			const lastY = getY(lastCandle.close);

			// Price line
			ctx.strokeStyle = '#3b82f6';
			ctx.lineWidth = 1;
			ctx.setLineDash([5, 5]);
			ctx.beginPath();
			ctx.moveTo(margin.left, lastY);
			ctx.lineTo(width - margin.right, lastY);
			ctx.stroke();
			ctx.setLineDash([]);

			// Price label
			ctx.fillStyle = '#3b82f6';
			ctx.fillRect(width - margin.right, lastY - 10, 70, 20);
			ctx.fillStyle = 'white';
			ctx.font = 'bold 12px sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText(
				lastCandle.close.toFixed(4),
				width - margin.right + 35,
				lastY + 4
			);
		}
	}, [chartData]);

	// Load data when component mounts or timeframe changes
	useEffect(() => {
		const getDays = () => {
			switch (timeframe) {
				case '1D':
					return 1;
				case '7D':
					return 7;
				case '1M':
					return 30;
				case '3M':
					return 90;
				case '1Y':
					return 365;
				default:
					return 30;
			}
		};

		const data = generateMockData(getDays());
		setChartData(data);
	}, [timeframe]);

	// Redraw chart when data changes
	useEffect(() => {
		if (chartData.length > 0) {
			// Small delay to ensure canvas is ready
			setTimeout(drawChart, 100);
		}
	}, [chartData, drawChart]);

	// Redraw on window resize
	useEffect(() => {
		const handleResize = () => {
			setTimeout(drawChart, 100);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [drawChart]);

	const timeframes = ['1D', '7D', '1M', '3M', '1Y'];

	const currentPrice =
		chartData.length > 0 ? chartData[chartData.length - 1].close : 0;
	const previousPrice =
		chartData.length > 1 ? chartData[chartData.length - 2].close : currentPrice;
	const priceChange = currentPrice - previousPrice;
	const priceChangePercent = previousPrice
		? (priceChange / previousPrice) * 100
		: 0;

	return (
		<div className='space-y-4'>
			{/* Chart Controls */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div className='flex items-center gap-2'>
					<span className='font-semibold'>{symbol}/USD</span>
					<span className='text-2xl font-bold'>${currentPrice.toFixed(4)}</span>
					<Badge
						className={
							priceChange >= 0
								? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
								: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
						}
					>
						{priceChange >= 0 ? '+' : ''}
						{priceChangePercent.toFixed(2)}%
					</Badge>
				</div>

				<div className='flex gap-1'>
					{timeframes.map((tf) => (
						<Button
							key={tf}
							variant={timeframe === tf ? 'default' : 'neutral'}
							size='sm'
							onClick={() => setTimeframe(tf)}
							className='px-3'
						>
							{tf}
						</Button>
					))}
				</div>
			</div>

			{/* Chart Canvas */}
			<div className='relative bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800'>
				<canvas
					ref={canvasRef}
					className='w-full h-80 lg:h-96 rounded-lg'
					style={{ display: 'block' }}
				/>

				{/* Chart Overlay */}
				<div className='absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 p-2 rounded shadow-sm'>
					<div className='text-xs space-y-1'>
						<div className='flex items-center gap-2'>
							<div className='w-3 h-3 bg-green-500 rounded'></div>
							<span>Bullish Candle</span>
						</div>
						<div className='flex items-center gap-2'>
							<div className='w-3 h-3 bg-red-500 rounded'></div>
							<span>Bearish Candle</span>
						</div>
						<div className='flex items-center gap-2'>
							<div className='w-3 h-0.5 bg-blue-500'></div>
							<span>Price Trend</span>
						</div>
					</div>
				</div>
			</div>

			{/* Chart Stats */}
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
				<div className='text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'>
					<div className='text-sm text-slate-600 dark:text-slate-400'>
						24h High
					</div>
					<div className='font-semibold'>
						$
						{chartData.length > 0
							? Math.max(...chartData.slice(-1).map((d) => d.high)).toFixed(4)
							: '0.0000'}
					</div>
				</div>
				<div className='text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'>
					<div className='text-sm text-slate-600 dark:text-slate-400'>
						24h Low
					</div>
					<div className='font-semibold'>
						$
						{chartData.length > 0
							? Math.min(...chartData.slice(-1).map((d) => d.low)).toFixed(4)
							: '0.0000'}
					</div>
				</div>
				<div className='text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'>
					<div className='text-sm text-slate-600 dark:text-slate-400'>
						24h Volume
					</div>
					<div className='font-semibold'>
						{chartData.length > 0
							? (chartData[chartData.length - 1].volume / 1000).toFixed(1) + 'K'
							: '0'}
					</div>
				</div>
				<div className='text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'>
					<div className='text-sm text-slate-600 dark:text-slate-400'>
						Volatility
					</div>
					<div className='font-semibold'>
						{chartData.length > 1
							? Math.abs(priceChangePercent).toFixed(1) + '%'
							: '0%'}
					</div>
				</div>
			</div>
		</div>
	);
}
