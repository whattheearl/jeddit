const adjectives = [
	'universityof',
	'glorious',
	'impossible',
	'top',
	'outrageous',
	'treble',
	'salty',
	'naughty',
	'troubling',
	'stinky',
	'smull',
	'crouching',
	'mediocre',
	'mild',
	'spicy',
	'scared',
	'special',
	'rabid',
	'throwaway',
	'humble',
	'kinky',
	'active',
	'super',
	'junior',
	'smart',
	'sober',
	'unfaithful',
	'calliente',
	'fairweather',
	'simple',
	'technically_a',
	'undead',
	'perculating',
	'chrochetted',
	'forever_and_ever',
	'high_fidelity'
];

const nouns = [
	'pirate',
	'poop',
	'treeforest',
	'speghetti',
	'fuego',
	'stapler',
	'sock',
	'wine',
	'junkmail',
	'cows',
	'cumulouscloud',
	'plantman',
	'speaker',
	'stroodletoaster',
	'paper_kite',
	'portablebattery',
	'karokemachine',
	'policeofficer',
	'angularfish',
	'leftsock',
	'cheesedanish',
	'turtle',
	'balarina',
	'number2pencil',
	'wifi',
	'semicircle'
];

export const generateUsername = () => {
	const first = adjectives[Math.floor(Math.random() * adjectives.length)];
	const second = nouns[Math.floor(Math.random() * nouns.length)];
	const num = Math.floor(Math.random() * 99);
	return `${first}_${second}${num}`;
};
