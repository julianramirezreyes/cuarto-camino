import "@testing-library/jest-dom/vitest";

// jsdom does not implement scrollIntoView; real browsers do.
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
