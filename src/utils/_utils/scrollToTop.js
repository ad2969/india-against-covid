export const scrollToTop = () => {
	document.body.scrollTop = 0; // safari
	document.documentElement.scrollTop = 0; // chrome, etc
};
