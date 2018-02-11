(w => {
	let Helper = {};

	// Cartesian to Polar 
	// Takes in two array x and y, and returns two arrays:
	// a and p which corresponds to amplitude and phase
	Helper.CtoP = (x, y) => {
		if (x.length !== y.length) throw new TypeError("Length mismatch");

		return [
			x.map( (k, i) => Math.hypot(k, y[i]) ), 
			x.map( (k, i) => Math.atan2(y[i], k) )
		];
	}

	// Polar to Cartesian
	Helper.PtoC = (x, y) => {
		if (x.length !== y.length) throw new TypeError("Length mismatch");

		return [
			x.map( (k, i) => k*Math.cos(y[i]) ),
			x.map( (k, i) => k*Math.sin(y[i]) )
		];
	}

	// Tuning file parser
	// Output file should include name and 12 values of cents deviated from ET.
	Helper.TuningFileParsing = v => {
		let lines = v.split("\n");
		let output = [];

		let byCents = {
			numLines	: 12,
			parser		: arr => {
				if (arr.length !== 13) throw new Error("Error Parsing Tuning File: Insufficient values.")
				let name = arr[0].substr(3).trim();
				output.push([name, arr.slice(1, 13)]);
			}
		}

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i].trim();

			if (line.substr(0, 1) == "" || line.substr(0, 1) == "#") {
				// ignored
			} else if ( /\(.\)/.test(line.substr(0, 3)) ) {
				switch (line.substr(1,1)) {
					case 'c':
						byCents.parser(lines.slice(i, i + byCents.numLines + 1));
						i += byCents.numLines;
					break;
					default:
						throw new Error("Failed parsing tuning file: Unrecognized tuning scheme at line " + i);
				}
			} else {
				throw new Error("Failed parsing tuning file:\nUnexpected character at line " + i + ": " +line)
			}
		}

		return output;
	}

Helper.DEFAULT_TUNING_FILE = `
# This a tuning collection file.
# Below are lists of different temperaments

# Any line preceding with a pound sign is a comment and will be disregarded.
# To include a tuning, simply start with a line with (c)
# Then follow by the twelve values

# (c) stands for Cents
# Whenever you start with (c), the program expects the next 12 lines
# to be values of cents deviated from 12-Equal-Temperament.

# There might be other tuning schemes I'll develop later. 
# Only (c) for now.

# Temperaments below are just for examples.
# I cannot guarantee they are correct, I'm just scraping them off 
# some website for the sake of testing the application.

(c) Just Intonation
0
11.731
3.91
15.641
-13.686
-1.955
-17.487
1.955
13.686
-15.641
17.596
-11.731

(c) Just (G anchored)
-1.9550008
11.731
3.91
15.641
-15.641
-1.955
-17.487
0
13.686
-15.641
17.596
-11.731

(c) Werckmeister
0
-10
-8
-6
-10
-2
-12
-4
-8
-2
-4
-8

(c) Werckmeister (G anchored)
-4
-10
-8
-6
-14
-2
-12
0
-8
-2
-4
-8
`;

	w.Helper = Helper;
})(window)