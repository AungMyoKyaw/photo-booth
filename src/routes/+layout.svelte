<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Moon, Sun } from 'lucide-svelte';

	let { children } = $props();

	let darkMode = $state(false);

	function initTheme() {
		const stored = localStorage.getItem('theme');
		if (stored) {
			darkMode = stored === 'dark';
		} else {
			darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
		updateTheme();
	}

	function toggleTheme() {
		darkMode = !darkMode;
		updateTheme();
	}

	function updateTheme() {
		document.documentElement.classList.toggle('dark', darkMode);
		localStorage.setItem('theme', darkMode ? 'dark' : 'light');
	}

	function handleSystemThemeChange(e: MediaQueryListEvent) {
		if (!localStorage.getItem('theme')) {
			darkMode = e.matches;
			updateTheme();
		}
	}

	$effect(() => {
		initTheme();
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', handleSystemThemeChange);
		return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<!-- Theme Toggle Button -->
<button
	class="theme-toggle"
	onclick={toggleTheme}
	type="button"
	title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
	aria-label="Toggle theme"
>
	<div class="toggle-track">
		<div class="toggle-icon toggle-sun" class:active={!darkMode}>
			<Sun size={16} strokeWidth={2.5} />
		</div>
		<div class="toggle-icon toggle-moon" class:active={darkMode}>
			<Moon size={16} strokeWidth={2.5} />
		</div>
		<div class="toggle-thumb" class:dark={darkMode}></div>
	</div>
</button>

<style>
	:global(html) {
		color-scheme: light;
	}

	:global(html.dark) {
		color-scheme: dark;
	}

	.theme-toggle {
		position: fixed;
		bottom: calc(2rem + var(--safe-area-inset-bottom));
		right: calc(1.5rem + var(--safe-area-inset-right));
		width: 64px;
		height: 36px;
		padding: 0;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 999px;
		cursor: pointer;
		box-shadow: var(--shadow-md);
		z-index: 90;
		transition: all 0.3s var(--ease-out-expo);
		overflow: hidden;
	}

	.theme-toggle:hover {
		transform: scale(1.05);
		box-shadow: var(--shadow-lg);
	}

	.theme-toggle:active {
		transform: scale(0.98);
	}

	.toggle-track {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 6px;
	}

	.toggle-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		color: var(--text-muted);
		transition: all 0.3s var(--ease-out-expo);
		z-index: 1;
	}

	.toggle-icon.active {
		color: var(--accent);
	}

	.toggle-sun {
		color: #f59e0b;
	}

	.toggle-sun.active {
		color: #f59e0b;
	}

	.toggle-moon {
		color: var(--text-muted);
	}

	.toggle-moon.active {
		color: #8b5cf6;
	}

	.toggle-thumb {
		position: absolute;
		top: 4px;
		left: 4px;
		width: 28px;
		height: 28px;
		background: var(--bg-tertiary);
		border-radius: 50%;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		transition: all 0.3s var(--ease-out-back);
	}

	.toggle-thumb.dark {
		left: calc(100% - 32px);
		background: #8b5cf6;
	}

	@media (max-width: 640px) {
		.theme-toggle {
			bottom: calc(1.5rem + var(--safe-area-inset-bottom));
			right: calc(1rem + var(--safe-area-inset-right));
			width: 56px;
			height: 32px;
		}

		.toggle-thumb {
			width: 24px;
			height: 24px;
		}

		.toggle-thumb.dark {
			left: calc(100% - 28px);
		}

		.toggle-icon {
			width: 20px;
			height: 20px;
		}

		.toggle-icon :global(svg) {
			width: 14px;
			height: 14px;
		}
	}
</style>
