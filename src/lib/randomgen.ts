// Improved Random HTML Generator with Tailwind Classes
// Improvements:
// - Resolved class conflicts: Added logic to match text color with background for better readability (e.g., dark text on light bg).
// - Improved semantic correctness: Element selection now depends on depth and parent element (e.g., 'li' only inside lists, appropriate children for 'form', 'nav').
// - Varied text lengths: Introduced sentences of different lengths; text generation tailored to element type (short for headings/buttons, longer for paragraphs).

const htmlElements = [
	'div',
	'section',
	'article',
	'header',
	'footer',
	'nav',
	'main',
	'aside',
	'p',
	'span',
	'h1',
	'h2',
	'h3',
	'ul',
	'ol',
	'li',
	'button',
	'a',
	'img',
	'form',
	'input',
	'label',
	'blockquote'
];

// Categorized for semantic selection
const containerElements = [
	'div',
	'section',
	'article',
	'header',
	'footer',
	'nav',
	'main',
	'aside',
	'form'
];
const textElements = ['p', 'span', 'h1', 'h2', 'h3', 'label', 'blockquote'];
const listElements = ['ul', 'ol'];
const listItem = ['li'];
const interactiveElements = ['button', 'a', 'input'];
const mediaElements = ['img'];

// Varied text content
const genericWords = [
	'Welcome',
	'Hello',
	'Content',
	'Information',
	'Details',
	'Overview',
	'Features',
	'Benefits',
	'Services',
	'Products',
	'About',
	'Contact',
	'Home',
	'Navigation',
	'Menu',
	'Footer',
	'Header',
	'Title',
	'Description',
	'Learn More',
	'Get Started',
	'Subscribe',
	'Join Us',
	'Discover',
	'Explore',
	'Innovation',
	'Quality',
	'Excellence',
	'Solution',
	'Team'
];

const genericSentences = [
	'This is a short sentence.',
	'Here is some medium-length text that explains a concept in more detail.',
	'This is a longer paragraph providing in-depth information. It covers multiple aspects, including examples and explanations to ensure clarity and understanding.',
	'A quick note on the topic.',
	'Detailed overview: This includes several key points such as innovation, quality, and excellence in our solutions.'
];

function randomChoice(arr: any) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomText(element: string) {
	if (['h1', 'h2', 'h3', 'button', 'label', 'a'].includes(element)) {
		// Short text for headings and interactives
		const wordCount = Math.floor(Math.random() * 3) + 1;
		const words = [];
		for (let i = 0; i < wordCount; i++) {
			words.push(randomChoice(genericWords));
		}
		return words.join(' ');
	} else if (['p', 'blockquote'].includes(element)) {
		// Longer text for paragraphs
		const sentenceCount = Math.floor(Math.random() * 4) + 2; // 2-5 sentences
		const sentences = [];
		for (let i = 0; i < sentenceCount; i++) {
			sentences.push(randomChoice(genericSentences));
		}
		return sentences.join(' ');
	} else {
		// Medium text for others
		const wordCount = Math.floor(Math.random() * 6) + 3; // 3-8 words
		const words = [];
		for (let i = 0; i < wordCount; i++) {
			words.push(randomChoice(genericWords));
		}
		return words.join(' ');
	}
}

// Organized by mutually exclusive groups (only pick one from each)
const mutuallyExclusiveClasses: any = {
	display: ['block', 'inline-block', 'flex', 'inline-flex', 'grid', 'hidden'],
	flexDirection: ['flex-row', 'flex-col'],
	flexWrap: ['flex-wrap', 'flex-nowrap'],
	justifyContent: ['justify-start', 'justify-center', 'justify-between', 'justify-around'],
	alignItems: ['items-start', 'items-center', 'items-end', 'items-stretch'],
	gap: ['gap-2', 'gap-4', 'gap-6', 'gap-8'],
	paddingAll: ['p-2', 'p-4', 'p-6', 'p-8'],
	marginAll: ['m-2', 'm-4', 'm-6'],
	width: ['w-full', 'w-1/2', 'w-1/3', 'w-2/3', 'w-auto'],
	maxWidth: ['max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl'],
	height: ['h-auto', 'h-32', 'h-48', 'h-64'],
	background: [
		'bg-white',
		'bg-gray-100',
		'bg-gray-200',
		'bg-blue-500',
		'bg-blue-600',
		'bg-red-500',
		'bg-green-500'
	],
	textColor: ['text-gray-800', 'text-gray-900', 'text-white', 'text-blue-600', 'text-red-600'],
	fontSize: ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'],
	fontWeight: ['font-normal', 'font-medium', 'font-semibold', 'font-bold'],
	textAlign: ['text-left', 'text-center', 'text-right'],
	borderRadius: ['rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-full'],
	shadow: ['shadow-sm', 'shadow', 'shadow-md', 'shadow-lg'],
	cursor: ['cursor-pointer', 'cursor-default']
};

// Classes that can be freely combined together
const compatibleClasses: any = {
	// Directional padding (can combine px and py)
	paddingX: ['px-2', 'px-4', 'px-6', 'px-8'],
	paddingY: ['py-2', 'py-4', 'py-6', 'py-8'],
	paddingSpecific: ['pt-2', 'pb-2', 'pl-2', 'pr-2', 'pt-4', 'pb-4'],

	// Directional margin (can combine mx and my)
	marginX: ['mx-2', 'mx-4', 'mx-auto'],
	marginY: ['my-2', 'my-4', 'my-6'],
	marginSpecific: ['mt-2', 'mb-2', 'ml-2', 'mr-2', 'mt-4', 'mb-4'],

	// Spacing utilities
	spacing: ['space-x-2', 'space-x-4', 'space-y-2', 'space-y-4', 'space-y-6'],

	// Border properties (can combine width, color, radius)
	borderWidth: ['border', 'border-2', 'border-4', 'border-t', 'border-b'],
	borderColor: ['border-gray-300', 'border-gray-400', 'border-blue-500', 'border-red-500'],

	// Effects (these combine well)
	transition: ['transition', 'transition-all', 'transition-colors'],
	duration: ['duration-150', 'duration-300', 'duration-500'],
	hover: ['hover:bg-blue-600', 'hover:bg-gray-200', 'hover:shadow-lg', 'hover:scale-105'],

	// Text utilities
	textTransform: ['uppercase', 'lowercase', 'capitalize'],
	textDecoration: ['underline', 'no-underline'],

	// Other
	misc: ['container', 'overflow-hidden', 'truncate']
};

function getValidClassCombination(element: string) {
	let classes: string[] = [];

	// Pick from mutually exclusive groups (max one per group)
	const exclusiveCategories = Object.keys(mutuallyExclusiveClasses);
	const numExclusive = Math.floor(Math.random() * 5) + 3; // Pick 3-7 exclusive categories

	for (let i = 0; i < numExclusive; i++) {
		if (exclusiveCategories.length === 0) break;

		const categoryIndex = Math.floor(Math.random() * exclusiveCategories.length);
		const category = exclusiveCategories[categoryIndex];
		exclusiveCategories.splice(categoryIndex, 1); // Remove so we don't pick again

		classes.push(randomChoice(mutuallyExclusiveClasses[category]));
	}

	// Pick from compatible classes (can select multiple from different groups)
	const compatibleCategories = Object.keys(compatibleClasses);
	const numCompatible = Math.floor(Math.random() * 4) + 1; // Pick 1-4 compatible categories

	for (let i = 0; i < numCompatible; i++) {
		if (compatibleCategories.length === 0) break;

		const categoryIndex = Math.floor(Math.random() * compatibleCategories.length);
		const category = compatibleCategories[categoryIndex];
		compatibleCategories.splice(categoryIndex, 1);

		// For compatible classes, sometimes pick multiple from same category if compatible
		const shouldPickMultiple = Math.random() > 0.7;
		if (shouldPickMultiple && compatibleClasses[category].length > 1) {
			const numToPick = Math.min(2, compatibleClasses[category].length);
			const picked: string[] = [];
			for (let j = 0; j < numToPick; j++) {
				let pick = randomChoice(compatibleClasses[category]);
				if (!picked.includes(pick)) {
					picked.push(pick);
					classes.push(pick);
				}
			}
		} else {
			classes.push(randomChoice(compatibleClasses[category]));
		}
	}

	// Resolve potential conflicts: e.g., match text color to background for readability
	const bgClass = classes.find((c) => c.startsWith('bg-'));
	let textColorClassIndex = classes.findIndex((c) =>
		mutuallyExclusiveClasses.textColor.includes(c)
	);

	if (bgClass && textColorClassIndex !== -1) {
		const lightBgs = ['bg-white', 'bg-gray-100', 'bg-gray-200'];
		const darkBgs = ['bg-blue-500', 'bg-blue-600', 'bg-red-500', 'bg-green-500'];
		const darkTexts = ['text-gray-800', 'text-gray-900', 'text-blue-600', 'text-red-600'];
		const lightText = 'text-white';

		if (lightBgs.includes(bgClass)) {
			// Ensure dark text
			classes[textColorClassIndex] = randomChoice(darkTexts);
		} else if (darkBgs.includes(bgClass)) {
			// Ensure light text
			classes[textColorClassIndex] = lightText;
		}
	}

	// Remove irrelevant classes for certain elements (e.g., no text styles on img/input)
	if (['img', 'input'].includes(element)) {
		const irrelevantPrefixes = ['text-', 'font-', 'textAlign'];
		classes = classes.filter((c) => !irrelevantPrefixes.some((prefix) => c.startsWith(prefix)));
	}

	// Add list styles for ul/ol
	if (['ul', 'ol'].includes(element)) {
		classes.push(randomChoice(['list-disc', 'list-decimal', 'list-none']));
	}

	return classes.join(' ');
}

function chooseElement(depth: number, parent: string) {
	if (depth === 0) {
		// Top-level prefers containers
		return randomChoice(containerElements);
	}
	if (['ul', 'ol'].includes(parent)) {
		return 'li';
	}
	if (parent === 'form') {
		return randomChoice(['label', 'input', 'button']);
	}
	if (parent === 'nav') {
		return randomChoice(['ul', 'a']);
	}
	if (['header', 'footer', 'section', 'article'].includes(parent)) {
		// Likely to have headings or paragraphs
		if (Math.random() > 0.6) {
			return randomChoice(textElements);
		} else {
			return randomChoice(containerElements.concat(listElements));
		}
	}
	// General fallback: bias towards containers at deeper levels, mix others
	const rand = Math.random();
	if (rand > 0.7) {
		return randomChoice(containerElements);
	} else if (rand > 0.4) {
		return randomChoice(textElements);
	} else {
		return randomChoice(interactiveElements.concat(mediaElements, listElements));
	}
}

function generateRandomHTML(depth = 0, maxDepth = 3, parent = 'div') {
	const element = chooseElement(depth, parent);
	const classes = getValidClassCombination(element);

	let content = '';

	// Handle self-closing or special elements
	if (element === 'img') {
		return `<img src="https://via.placeholder.com/150" alt="${randomChoice(genericWords)}" class="${classes}" />`;
	}
	if (element === 'input') {
		return `<input type="text" placeholder="${getRandomText(element)}" class="${classes}" />`;
	}
	if (element === 'a') {
		return `<a href="#" class="${classes}">${getRandomText(element)}</a>`;
	}
	if (element === 'button') {
		return `<button class="${classes}">${getRandomText(element)}</button>`;
	}

	// Decide if we add text content or nested elements
	const prefersText = textElements.includes(element) || Math.random() > 0.6;
	if (depth >= maxDepth || prefersText) {
		// Add text content appropriately
		content = getRandomText(element);
	} else {
		// Add nested elements
		const childCount = Math.floor(Math.random() * 3) + 1;
		for (let i = 0; i < childCount; i++) {
			content += '\n  ' + generateRandomHTML(depth + 1, maxDepth, element).replace(/\n/g, '\n  ');
		}
		content += '\n';
	}

	return `<${element} class="${classes}">${content}</${element}>`;
}

function buildRandomHTML(options: any = {}) {
	const maxDepth = options.maxDepth || 3;
	const rootElement = 'div';
	const rootClasses = 'container mx-auto p-8';

	let html = `<${rootElement} class="${rootClasses}">\n`;

	const sectionCount = Math.floor(Math.random() * 4) + 2;
	for (let i = 0; i < sectionCount; i++) {
		html += '  ' + generateRandomHTML(0, maxDepth).replace(/\n/g, '\n  ') + '\n';
	}

	html += `</${rootElement}>`;

	return html;
}

// Example usage:
// console.log(buildRandomHTML());
// console.log('\n--- Another random example ---\n');
// console.log(buildRandomHTML({ maxDepth: 2 }));

export { buildRandomHTML, generateRandomHTML };
