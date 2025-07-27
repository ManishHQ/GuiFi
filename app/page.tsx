'use client';

import { FeatureShowcase } from '@/components/feature-showcase';
import { useRouter } from 'next/navigation';

export default function Home() {
	const router = useRouter();

	const handleNavigate = (tab: string) => {
		router.push(`/${tab}`);
	};

	return <FeatureShowcase onNavigate={handleNavigate} />;
}
