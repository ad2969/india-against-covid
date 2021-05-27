export const isEmpty = (x) => {
	if (Array.isArray(x)) return x.length === 0;
	if (!(typeof x === "object")) return false; // loose checking of type to eliminate primitives
	if (!x) return false; // eliminates null
	if (x.toString() !== "[object Object]") return false; // eliminates things like Sets, Promises, RegExp, Errors
	if (Object.keys(x).length) return false; // eliminates objects that have keys
	return true;
};
