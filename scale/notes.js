function toPitch(frequency) {
	return Math.round(12 * Math.log2(frequency));
}

function normalizedOctave(frequencyRatio) {
	return Math.floor(Math.log2(frequencyRatio));
}

function positiveModule(value, module) {
    let result = value % module;
    if (result < 0) result += module;
    return result;
}

function toLetter(index) {
	return String.fromCharCode("A".charCodeAt(0) + index);
}

const naturals = [
   {index: 0, text: 'F'},
   {index: 1, text: 'C'},
   {index: 2, text: 'G'},
   {index: 3, text: 'D'},
   {index: 4, text: 'A'},
   {index: 5, text: 'E'},
   {index: 6, text: 'B'},
];
const accidentals = [
   {index: -2, text: '𝄫'},
   {index: -1, text: '♭'},
   {index: 0, text: ''},
   {index: 1, text: '♯'},
   {index: 2, text: '𝄪'},
];
const scales = [
	{notes: [0, 1, 2, 3, 4], name: "pentatonic" },
	{notes: [-1, 0, 1, 2, 3, 4, 5], name: "natural major" },
	{notes: [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5], name: "chromatic" },
	{notes: [-4, -3, -2, -1, 0, 1, 2], name: "natural minor" },
	{notes: [-4, -3, -1, 0, 1, 2, 5], name: "harmonic minor" },
	{notes: [-3, -1, 0, 1, 2, 3, 5], name: "melodic minor" },
];

function mountNote(nat, acc) {
	if (!acc) {
		acc = accidentals[2];
	}
	return {
		text: nat.text + acc.text,
		natIndex: nat.index,
		accIndex: acc.index,
		natText: nat.text,
		accText: acc.text,
		hueIndex: (nat.index * 7 + acc.index + 120) % 12,
		fifthIndex: nat.index + 7 * acc.index,
	};
}

const allNotes = accidentals.flatMap(acc => naturals.map(nat => mountNote(nat, acc)));

function findNoteByName(name) {
	let note = allNotes.find(note => note.text == name);
	if (!note) throw new Error("Invalid note: " + name);
	return note;
}

function findNoteByFifthIndex(fifthIndex) {
	let note = allNotes.find(note => note.fifthIndex == fifthIndex);
	if (!note) throw new Error("Not found note by fifthIndex: " + fifthIndex);
	return note;
}

function findScaleByName(name) {
	let scale = scales.find(scale => scale.name == name);
	if (!scale) throw new Error("Invalid scale: " + name);
	return scale;
}

function listFifthInterval(firstNoteName, lastNoteName) {
  
  let firstFifthIndex = findNoteByName(firstNoteName).fifthIndex;
  let lastFifthIndex = findNoteByName(lastNoteName).fifthIndex;
  
  return allNotes.filter(note => note.fifthIndex >= firstFifthIndex && note.fifthIndex <= lastFifthIndex);
}

function listScaleNotes(scaleName, baseNoteName) {
	let scale = findScaleByName(scaleName);
	let baseNote = findNoteByName(baseNoteName);
	return scale.notes.map(relIndex => findNoteByFifthIndex(baseNote.fifthIndex + relIndex));
}

function circleWithHueIndex(notes) {
	return notes.map(note => ({ ...note, circleIndex: note.hueIndex}));
}

function circleWithFifthIndex(notes) {
	return notes.map(note => ({ ...note, circleIndex: note.fifthIndex}));
}

function listFifthScaleNotes(firstNoteName, count) {
  let firstFifthIndex = findNoteByName(firstNoteName).fifthIndex;
  let lastFifthIndex = firstFifthIndex + count - 1;
  
  return allNotes.filter(note => note.fifthIndex >= firstFifthIndex && note.fifthIndex <= lastFifthIndex)
      .map(note => ({ ...note, circleIndex: note.hueIndex}));
}

