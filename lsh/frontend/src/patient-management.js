import PatientManagement from './PatientManagement.svelte';
import "carbon-components-svelte/css/white.css";

const pmgmt = new PatientManagement({
	target: document.body,
	props: {
//	 name: 'world'
	}
});

export default pmgmt;