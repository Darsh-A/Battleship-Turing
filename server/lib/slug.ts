export function slug(raw: string): string {
	return (
		raw
			// allow A–Z, a–z and 0–9, replace everything else with “_”
			.replace(/[^A-Za-z0-9]+/g, "_")
			// trim leading/trailing underscores
			.replace(/^_+|_+$/g, "")
	);
}
