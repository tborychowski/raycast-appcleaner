/* eslint-disable @raycast/prefer-title-case */
import { ActionPanel, Action, Detail } from "@raycast/api";


export function MissingDependency() {

	const error = `
# Missing Dependency!

You need either [AppCleaner](https://https://freemacsoft.net/appcleaner/) or [PearCleaner](https://itsalin.com/appInfo/?id=pearcleaner) installed.
`;

	return (
		<Detail
			markdown={error}
			navigationTitle="Error"
			actions={
				<ActionPanel>
					<Action.OpenInBrowser icon="icon.png" title="Get AppCleaner" url="https://freemacsoft.net/appcleaner/" />
					<Action.OpenInBrowser icon="pearcleaner.png" title="Get PearCleaner" url="https://itsalin.com/appInfo/?id=pearcleaner" />
				</ActionPanel>
			}/>
	);
}
