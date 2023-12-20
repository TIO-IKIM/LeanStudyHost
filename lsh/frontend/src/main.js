import App from './App.svelte';
import "carbon-components-svelte/css/white.css";


const app = new App({
	target: document.body,
	props: {
		// name: 'world'
	}
});

export default app;

// https://stackoverflow.com/questions/31949863/django-and-dropzone-js