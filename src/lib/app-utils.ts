import type { Application } from '@raycast/api';
import type { AppItem } from './types';

import fs from 'fs';
import path from 'path';
import { fuzzy } from './utils';



export function filterApps(apps: AppItem[], query: string): AppItem[] {
	apps = apps.filter(app => app.isSystemApp === false);

	if (query) {
		const q = query.toLowerCase();
		apps = apps.filter(app => filterByQuery(app, q));
		apps.sort((a, b) => {
			const aHasMatch = a.name.toLocaleLowerCase().startsWith(query);
			const bHasMatch = b.name.toLocaleLowerCase().startsWith(query);

			if (aHasMatch && !bHasMatch) return -1;
			if (!aHasMatch && bHasMatch) return 1;
			return a.name.localeCompare(b.name);
		});
	}
	else {
		apps = apps.sort((a, b) => a.name.localeCompare(b.name));
	}
	return apps;
}


function filterByQuery(app: AppItem, query: string): boolean {
	if (fuzzy(app.name, query)) return true;
	if (fuzzy(app.brand, query)) return true;
	// if (fuzzy(app.path, query)) return true;
	return false;
}


export function getIcon(app: Application): string {
	let icon = app.path + "/Contents/Resources/AppIcon.icns";

	if (!fs.existsSync(icon)) {
		const icons = fs.readdirSync(app.path + "/Contents/Resources/", { withFileTypes: true });
		const file = icons.find(file => file.name.endsWith('.icns'));
		if (file) icon = file.path + file.name;
	}
	return icon;
}



export function isSystem(appPath: string): boolean {
	const normalizedPath = path.normalize(appPath);

	if (normalizedPath.startsWith('/System/')) return true;

	try {
		const stats = fs.statSync(normalizedPath);

		// System apps are typically owned by root:wheel and aren't writable by users
		if (stats.uid === 0 && !stats.mode.toString(8).endsWith('66')) return true;

		// Check SIP protection by attempting to write to the app's Contents folder
		const contentsPath = path.join(normalizedPath, 'Contents');
		fs.accessSync(contentsPath, fs.constants.W_OK);
		return false;
	}
	catch (error) {
		console.error('Error checking app:', error);
		return true;
	}
}
