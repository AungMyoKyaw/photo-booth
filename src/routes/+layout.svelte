<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Moon, Sun } from 'lucide-svelte';

	let { children } = $props();

	let darkMode = $state(false);

	// Initialize theme from localStorage or system preference
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

	// Listen for system theme changes
	function handleSystemThemeChange(e: MediaQueryListEvent) {
		if (!localStorage.getItem('theme')) {
			darkMode = e.matches;
			updateTheme();
		}
	}

	// Initialize on mount
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
	{#if darkMode}
		<Sun size={24} strokeWidth={2} />
	{:else}
		<Moon size={20} strokeWidth={2} />
	{/if}
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
		right: calc(2rem + var(--safe-area-inset-right));
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 90;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-primary);
	}

	.theme-toggle:hover {
		transform: scale(1.1);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
	}

	.theme-toggle:active {
		transform: scale(0.95);
	}

	:global(.dark) .theme-toggle {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
	}

	:global(.dark) .theme-toggle:hover {
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
	}

	@media (max-width: 640px) {
		.theme-toggle {
			bottom: calc(1.5rem + var(--safe-area-inset-bottom));
			right: calc(1.5rem + var(--safe-area-inset-right));
			width: 44px;
			height: 44px;
		}
	}
</style>
