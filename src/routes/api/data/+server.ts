// src/routes/api/generate-html/+server.js

import { generateHtmlSection } from '$lib/generator';
import { json } from '@sveltejs/kit';

const dummy_html = `<section class="relative isolate overflow-hidden bg-slate-950 py-24 sm:py-32">
  <div class="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900),theme(colors.slate.950))] opacity-20"></div>
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-2xl lg:text-center">
      <h2 class="text-base font-semibold leading-7 text-indigo-400 uppercase tracking-widest">Analytics Platform</h2>
      <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">Data that speaks your language</p>
      <p class="mt-6 text-lg leading-8 text-slate-400">Our intelligent engine transforms complex datasets into actionable insights, helping your team make smarter decisions in real-time without the overhead.</p>
    </div>
    <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
      <div class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
        <div class="relative pl-16 group">
          <div class="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-400 transition-colors duration-300">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <dt class="text-lg font-semibold leading-7 text-white">Real-time Processing</dt>
          <dd class="mt-2 text-base leading-7 text-slate-400">Experience sub-millisecond latency with our distributed edge network processing billions of events daily.</dd>
        </div>
        <div class="relative pl-16 group">
          <div class="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-400 transition-colors duration-300">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <dt class="text-lg font-semibold leading-7 text-white">Enterprise Security</dt>
          <dd class="mt-2 text-base leading-7 text-slate-400">SOC2 Type II compliant infrastructure with end-to-end encryption and automated threat detection systems.</dd>
        </div>
        <div class="relative pl-16 group">
          <div class="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-400 transition-colors duration-300">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </div>
          <dt class="text-lg font-semibold leading-7 text-white">Predictive AI</dt>
          <dd class="mt-2 text-base leading-7 text-slate-400">Leverage machine learning models that forecast trends before they happen, giving you a competitive edge.</dd>
        </div>
      </div>
    </div>
    <div class="mt-20 flex justify-center">
      <a href="#" class="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">Get Started Today</a>
    </div>
  </div>
</section>`

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { prompt } = await request.json();

	if (!prompt) {
		return json({ error: 'Prompt is required' }, { status: 400 });
	}

	try {
		const html = dummy_html//await generateHtmlSection(prompt);
		return json({ html });
	} catch (error) {
		return json({ error }, { status: 500 });
	}
}
