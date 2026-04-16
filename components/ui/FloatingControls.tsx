'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RocketLaunch } from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Lang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const FLAGS: Record<Lang, string> = { es: '🇪🇸', en: '🇺🇸' };
const LANGS: Lang[] = ['es', 'en'];

export default function FloatingControls() {
	const { t, lang, setLang } = useLanguage();
	const [visible, setVisible] = useState(false);
	const [firing, setFiring] = useState(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > 500);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	function launch() {
		if (firing) return;
		setFiring(true);
		window.scrollTo({ top: 0, behavior: 'smooth' });
		setTimeout(() => setFiring(false), 950);
	}

	return (
		<div className="fixed bottom-8 right-6 z-40 flex flex-col items-center gap-3">
			{/* Language switcher — always visible */}
			<motion.div
				initial={{ opacity: 0, x: 24 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
				className="flex flex-col items-center gap-1 px-2.5 py-2 rounded-2xl select-none"
				style={{ background: 'var(--dj-surface)', border: '1px solid var(--dj-border)' }}
			>
				{LANGS.map((l) => (
					<button
						key={l}
						onClick={() => setLang(l)}
						aria-label={l === 'es' ? 'Español' : 'English'}
						className={cn(
							'text-base leading-none px-1 py-0.5 rounded-lg transition-all duration-200',
							lang === l ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-70',
						)}
					>
						{FLAGS[l]}
					</button>
				))}
			</motion.div>

			{/* Scroll to top rocket — only when scrolled */}
			<AnimatePresence>
				{visible && (
					<motion.button
						initial={{ opacity: 0, x: 24 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 24 }}
						transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
						onClick={launch}
						aria-label="Scroll to top"
						className="flex flex-col items-center gap-2.5 px-3 pt-4 pb-3 rounded-2xl bg-violet-600 cursor-pointer glow-purple select-none"
						whileHover={{ scale: 1.06 }}
						whileTap={{ scale: 0.91 }}
					>
						{/* Rocket + exhaust trail */}
						<div className="relative flex flex-col items-center">
							<motion.div
								animate={firing ? { y: [0, -26, 0], scale: [1, 0.6, 1] } : { y: [0, -5, 0] }}
								transition={
									firing
										? { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
										: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
								}
							>
								<RocketLaunch size={20} weight="fill" className="text-white" />
							</motion.div>

							{/* Flame exhaust */}
							<AnimatePresence>
								{firing && (
									<motion.div
										key="flame"
										initial={{ height: 0, opacity: 1, scaleX: 1 }}
										animate={{ height: 30, opacity: 0, scaleX: 0.3 }}
										transition={{ duration: 0.5, ease: 'easeOut' }}
										className="absolute top-full left-1/2 -translate-x-1/2 w-0.75 rounded-full pointer-events-none"
										style={{
											background: 'linear-gradient(to bottom, #c4b5fd 0%, #22d3ee 60%, transparent 100%)',
										}}
									/>
								)}
							</AnimatePresence>
						</div>

						{/* Divider */}
						<div className="w-4 h-px bg-white/20 rounded-full" />

						{/* Vertical text */}
						<span
							className="font-display text-[10px] tracking-[0.25em] text-white/75 leading-none"
							style={{ writingMode: 'vertical-rl' }}
						>
							{t.scrollToTop}
						</span>
					</motion.button>
				)}
			</AnimatePresence>
		</div>
	);
}
